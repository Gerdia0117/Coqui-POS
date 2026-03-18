// ============================================================
// COQUÍ POS — Menu Image Downloader (Node.js)
// Works on Windows, Mac, and Linux — no extra tools needed.
//
// HOW TO RUN (from inside your Coqui-POS-main folder):
//   node download-images.js
// ============================================================

const https = require("https");
const http  = require("http");
const fs    = require("fs");
const path  = require("path");

// Where images will be saved
const OUTPUT_DIR = path.join(__dirname, "frontend", "public", "images");

// Create the folder if it doesn't exist
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log(`✅ Created folder: ${OUTPUT_DIR}\n`);
}

// ============================================================
// ALL 26 MENU IMAGES
// Each entry: [filename, unsplash_url]
// ============================================================
const IMAGES = [
  // BEVERAGES
  ["pina-colada.jpg",       "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=300&fit=crop&auto=format"],
  ["mojito.jpg",            "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&h=300&fit=crop&auto=format"],
  ["orange-juice.jpg",      "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=300&fit=crop&auto=format"],
  ["cafe-con-leche.jpg",    "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=300&fit=crop&auto=format"],

  // APPETIZERS
  ["tostones.jpg",          "https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1?w=400&h=300&fit=crop&auto=format"],
  ["alcapurrias.jpg",       "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop&auto=format"],
  ["empanadillas.jpg",      "https://images.unsplash.com/photo-1604177091072-6e6f28ce7e7f?w=400&h=300&fit=crop&auto=format"],
  ["bacalaitos.jpg",        "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=300&fit=crop&auto=format"],

  // SALADS
  ["avocado-salad.jpg",     "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop&auto=format"],
  ["caesar-salad.jpg",      "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop&auto=format"],
  ["fruit-salad.jpg",       "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=400&h=300&fit=crop&auto=format"],

  // MAIN COURSE
  ["mofongo-camarones.jpg", "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400&h=300&fit=crop&auto=format"],
  ["pernil.jpg",            "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop&auto=format"],
  ["arroz-con-pollo.jpg",   "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&h=300&fit=crop&auto=format"],
  ["churrasco.jpg",         "https://images.unsplash.com/photo-1558030006-450675393462?w=400&h=300&fit=crop&auto=format"],
  ["pescado-frito.jpg",     "https://images.unsplash.com/photo-1519984388953-d2406bc725e1?w=400&h=300&fit=crop&auto=format"],
  ["ropa-vieja.jpg",        "https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=300&fit=crop&auto=format"],

  // DESSERTS
  ["flan-coco.jpg",         "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop&auto=format"],
  ["tembleque.jpg",         "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400&h=300&fit=crop&auto=format"],
  ["tres-leches.jpg",       "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=400&h=300&fit=crop&auto=format"],
  ["quesito.jpg",           "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=300&fit=crop&auto=format"],

  // SIDES
  ["white-rice.jpg",        "https://images.unsplash.com/photo-1516684732162-798a0062be99?w=400&h=300&fit=crop&auto=format"],
  ["rice-and-beans.jpg",    "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop&auto=format"],
  ["maduros.jpg",           "https://images.unsplash.com/photo-1528712306091-ed0763094c98?w=400&h=300&fit=crop&auto=format"],
  ["black-beans.jpg",       "https://images.unsplash.com/photo-1540189549336-e6e99eb4b400?w=400&h=300&fit=crop&auto=format"],
  ["mashed-potatoes.jpg",   "https://images.unsplash.com/photo-1596560548464-f010549b84d7?w=400&h=300&fit=crop&auto=format"],
  ["grilled-vegetables.jpg","https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop&auto=format"],
  ["yuca-frita.jpg",        "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=400&h=300&fit=crop&auto=format"],
  ["ensalada-verde.jpg",    "https://images.unsplash.com/photo-1511357840105-748c95f0b4b4?w=400&h=300&fit=crop&auto=format"],
];

// ============================================================
// DOWNLOAD FUNCTION — follows redirects automatically
// ============================================================
function download(filename, url) {
  return new Promise((resolve, reject) => {
    const filepath = path.join(OUTPUT_DIR, filename);

    // Skip if already downloaded
    if (fs.existsSync(filepath)) {
      console.log(`  ✓ Already exists: ${filename}`);
      return resolve();
    }

    const protocol = url.startsWith("https") ? https : http;

    const request = protocol.get(url, (res) => {
      // Follow redirects (301, 302, etc.)
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return download(filename, res.headers.location).then(resolve).catch(reject);
      }

      if (res.statusCode !== 200) {
        console.log(`  ✗ Failed (${res.statusCode}): ${filename}`);
        return resolve(); // don't crash, just skip
      }

      const file = fs.createWriteStream(filepath);
      res.pipe(file);
      file.on("finish", () => {
        file.close();
        console.log(`  ✅ Downloaded: ${filename}`);
        resolve();
      });
      file.on("error", (err) => {
        fs.unlink(filepath, () => {}); // clean up partial file
        console.log(`  ✗ Write error: ${filename} — ${err.message}`);
        resolve();
      });
    });

    request.on("error", (err) => {
      console.log(`  ✗ Network error: ${filename} — ${err.message}`);
      resolve();
    });

    request.setTimeout(15000, () => {
      request.destroy();
      console.log(`  ✗ Timeout: ${filename}`);
      resolve();
    });
  });
}

// ============================================================
// RUN ALL DOWNLOADS — one at a time to avoid rate limiting
// ============================================================
async function main() {
  console.log(`🐸 Coqui POS — Downloading ${IMAGES.length} menu images...\n`);

  let success = 0;
  let failed  = 0;

  for (const [filename, url] of IMAGES) {
    const filepath = path.join(OUTPUT_DIR, filename);
    const existed  = fs.existsSync(filepath);
    await download(filename, url);
    if (fs.existsSync(filepath)) {
      if (!existed) success++;
    } else {
      failed++;
    }
  }

  console.log(`\n========================================`);
  console.log(`🐸 Done!`);
  console.log(`   ✅ Downloaded: ${success} new images`);
  console.log(`   ✗  Failed:     ${failed} images`);
  console.log(`   📁 Saved to:   frontend/public/images/`);
  console.log(`\nNext step:`);
  console.log(`  Replace frontend/src/data/menuData.js with the new version`);
  console.log(`  Then run: cd frontend && npm run dev`);
  console.log(`========================================\n`);
}

main().catch(console.error);
