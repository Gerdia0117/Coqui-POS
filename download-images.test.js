// =============================================================
// Unit tests for download-images.js
// Run with:  node --test download-images.test.js
// =============================================================

const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const https = require("https");
const http = require("http");
const path = require("path");
const { PassThrough, Writable } = require("stream");
const { EventEmitter } = require("events");

const { download, ensureOutputDir, OUTPUT_DIR } = require("./download-images");

// ── helpers ────────────────────────────────────────────────────

/** Create a lightweight mock HTTP request (EventEmitter + setTimeout/destroy) */
function createMockRequest(opts = {}) {
  const req = new EventEmitter();
  req.setTimeout = function (ms, cb) {
    if (opts.triggerTimeout) process.nextTick(cb);
  };
  req.destroy = function () {};
  return req;
}

// ── 1. Output directory creation ──────────────────────────────

describe("ensureOutputDir", () => {
  it("should create the output directory if it does not exist", (t) => {
    t.mock.method(fs, "existsSync", () => false);
    t.mock.method(fs, "mkdirSync", () => undefined);
    t.mock.method(console, "log", () => {});

    ensureOutputDir();

    assert.strictEqual(fs.mkdirSync.mock.callCount(), 1);
    const [dirPath, options] = fs.mkdirSync.mock.calls[0].arguments;
    assert.strictEqual(dirPath, OUTPUT_DIR);
    assert.deepStrictEqual(options, { recursive: true });
  });

  it("should not create the directory if it already exists", (t) => {
    t.mock.method(fs, "existsSync", () => true);
    t.mock.method(fs, "mkdirSync", () => undefined);

    ensureOutputDir();

    assert.strictEqual(fs.mkdirSync.mock.callCount(), 0);
  });
});

// ── 2. Skip existing images ──────────────────────────────────

describe("download – skip existing", () => {
  it("should skip downloading an image if it already exists in the output directory", async (t) => {
    t.mock.method(fs, "existsSync", () => true);
    t.mock.method(console, "log", () => {});
    const getMock = t.mock.method(https, "get", () => {
      throw new Error("https.get should not be called");
    });

    await download("existing.jpg", "https://example.com/existing.jpg");

    // No HTTP request should have been made
    assert.strictEqual(getMock.mock.callCount(), 0);

    // Should log "Already exists"
    const logs = console.log.mock.calls.map((c) => c.arguments[0]);
    assert.ok(logs.some((m) => typeof m === "string" && m.includes("Already exists")));
  });
});

// ── 3. Successful download ────────────────────────────────────

describe("download – success", () => {
  it("should correctly download an image from a given URL", async (t) => {
    t.mock.method(fs, "existsSync", () => false);
    t.mock.method(console, "log", () => {});

    const fakeData = Buffer.from("fake-image-data");
    let writtenData = Buffer.alloc(0);

    // Mock write stream
    const mockWs = new Writable({
      write(chunk, _enc, cb) {
        writtenData = Buffer.concat([writtenData, chunk]);
        cb();
      },
    });
    mockWs.close = () => {};
    t.mock.method(fs, "createWriteStream", () => mockWs);

    // Mock https.get → 200 with data
    t.mock.method(https, "get", (url, cb) => {
      const res = new PassThrough();
      res.statusCode = 200;
      res.headers = {};
      process.nextTick(() => {
        cb(res);
        res.end(fakeData);
      });
      return createMockRequest();
    });

    await download("photo.jpg", "https://example.com/photo.jpg");

    // Verify createWriteStream was called with the correct path
    const expectedPath = path.join(OUTPUT_DIR, "photo.jpg");
    assert.strictEqual(fs.createWriteStream.mock.calls[0].arguments[0], expectedPath);

    // Verify the data that was piped to the file
    assert.deepStrictEqual(writtenData, fakeData);
  });
});

// ── 4. HTTP redirects (301, 302) ──────────────────────────────

describe("download – redirects", () => {
  it("should follow a 302 redirect and download from the new location", async (t) => {
    t.mock.method(fs, "existsSync", () => false);
    t.mock.method(console, "log", () => {});

    const fakeData = Buffer.from("redirected-image");
    let writtenData = Buffer.alloc(0);
    let callCount = 0;

    const mockWs = new Writable({
      write(chunk, _enc, cb) {
        writtenData = Buffer.concat([writtenData, chunk]);
        cb();
      },
    });
    mockWs.close = () => {};
    t.mock.method(fs, "createWriteStream", () => mockWs);

    t.mock.method(https, "get", (url, cb) => {
      callCount++;
      if (callCount === 1) {
        // First request → 302 redirect
        const res = new PassThrough();
        res.statusCode = 302;
        res.headers = { location: "https://cdn.example.com/photo.jpg" };
        process.nextTick(() => {
          cb(res);
          res.end();
        });
      } else {
        // Second request (redirected) → 200
        const res = new PassThrough();
        res.statusCode = 200;
        res.headers = {};
        process.nextTick(() => {
          cb(res);
          res.end(fakeData);
        });
      }
      return createMockRequest();
    });

    await download("photo.jpg", "https://example.com/photo.jpg");

    assert.strictEqual(https.get.mock.callCount(), 2);
    assert.deepStrictEqual(writtenData, fakeData);
  });

  it("should follow a 301 redirect and download from the new location", async (t) => {
    t.mock.method(fs, "existsSync", () => false);
    t.mock.method(console, "log", () => {});

    const fakeData = Buffer.from("moved-permanently-image");
    let writtenData = Buffer.alloc(0);
    let callCount = 0;

    const mockWs = new Writable({
      write(chunk, _enc, cb) {
        writtenData = Buffer.concat([writtenData, chunk]);
        cb();
      },
    });
    mockWs.close = () => {};
    t.mock.method(fs, "createWriteStream", () => mockWs);

    t.mock.method(https, "get", (url, cb) => {
      callCount++;
      if (callCount === 1) {
        const res = new PassThrough();
        res.statusCode = 301;
        res.headers = { location: "https://new.example.com/photo.jpg" };
        process.nextTick(() => {
          cb(res);
          res.end();
        });
      } else {
        const res = new PassThrough();
        res.statusCode = 200;
        res.headers = {};
        process.nextTick(() => {
          cb(res);
          res.end(fakeData);
        });
      }
      return createMockRequest();
    });

    await download("photo.jpg", "https://example.com/photo.jpg");

    assert.strictEqual(https.get.mock.callCount(), 2);
    assert.deepStrictEqual(writtenData, fakeData);
  });
});

// ── 5. Error handling (404, network error, timeout) ───────────

describe("download – error handling", () => {
  it("should log an error and skip on HTTP 404", async (t) => {
    t.mock.method(fs, "existsSync", () => false);
    const logMock = t.mock.method(console, "log", () => {});

    t.mock.method(https, "get", (url, cb) => {
      const res = new PassThrough();
      res.statusCode = 404;
      res.headers = {};
      process.nextTick(() => {
        cb(res);
        res.end();
      });
      return createMockRequest();
    });

    // Should resolve, not reject
    await download("missing.jpg", "https://example.com/missing.jpg");

    const logs = logMock.mock.calls.map((c) => c.arguments[0]);
    assert.ok(logs.some((m) => typeof m === "string" && m.includes("Failed") && m.includes("404")));
  });

  it("should log an error and skip on a network error", async (t) => {
    t.mock.method(fs, "existsSync", () => false);
    const logMock = t.mock.method(console, "log", () => {});

    t.mock.method(https, "get", (_url, _cb) => {
      const req = new EventEmitter();
      req.setTimeout = () => {};
      req.destroy = () => {};
      process.nextTick(() => req.emit("error", new Error("ECONNREFUSED")));
      return req;
    });

    await download("fail.jpg", "https://example.com/fail.jpg");

    const logs = logMock.mock.calls.map((c) => c.arguments[0]);
    assert.ok(logs.some((m) => typeof m === "string" && m.includes("Network error") && m.includes("ECONNREFUSED")));
  });

  it("should log an error and skip on a timeout", async (t) => {
    t.mock.method(fs, "existsSync", () => false);
    const logMock = t.mock.method(console, "log", () => {});

    t.mock.method(https, "get", (_url, _cb) => {
      return createMockRequest({ triggerTimeout: true });
    });

    await download("slow.jpg", "https://example.com/slow.jpg");

    const logs = logMock.mock.calls.map((c) => c.arguments[0]);
    assert.ok(logs.some((m) => typeof m === "string" && m.includes("Timeout")));
  });
});
