// ============================================
// KITCHEN TICKETS COMPONENT
// ============================================
// Displays kitchen tickets with:
// - Open / Completed tabs
// - Live running timer for open tickets
// - Detail view per ticket
// - Manager-only: individual item sent timestamps

import { useState, useEffect } from "react";

export default function KitchenTickets({ onClose, userRole }) {
  // ============================================
  // STATE MANAGEMENT
  // ============================================
  const [tickets, setTickets] = useState([]);
  const [activeTab, setActiveTab] = useState("open"); // 'open' or 'closed'
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [, setTick] = useState(0); // Force re-render for live timers
  const [showVoidPrompt, setShowVoidPrompt] = useState(null); // { type: 'item'|'ticket', ticketId, itemIndex? }
  const [voidPassword, setVoidPassword] = useState("");
  const [voidReason, setVoidReason] = useState("");

  // ============================================
  // FETCH TICKETS
  // ============================================
  const fetchTickets = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/tickets");
      if (response.ok) {
        const data = await response.json();
        setTickets(data.tickets || []);
      }
    } catch (err) {
      console.error("Error fetching tickets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // Live timer: re-render every second for open tickets
  useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // ============================================
  // HELPERS
  // ============================================
  const formatElapsed = (isoString) => {
    const start = new Date(isoString);
    const now = new Date();
    const diff = Math.floor((now - start) / 1000);
    const hrs = Math.floor(diff / 3600);
    const mins = Math.floor((diff % 3600) / 60);
    const secs = diff % 60;
    if (hrs > 0) return `${hrs}h ${mins}m ${secs}s`;
    if (mins > 0) return `${mins}m ${secs}s`;
    return `${secs}s`;
  };

  const formatDuration = (startIso, endIso) => {
    const start = new Date(startIso);
    const end = new Date(endIso);
    const diff = Math.floor((end - start) / 1000);
    const hrs = Math.floor(diff / 3600);
    const mins = Math.floor((diff % 3600) / 60);
    const secs = diff % 60;
    if (hrs > 0) return `${hrs}h ${mins}m ${secs}s`;
    if (mins > 0) return `${mins}m ${secs}s`;
    return `${secs}s`;
  };

  const formatTime = (isoString) => {
    return new Date(isoString).toLocaleTimeString();
  };

  const getTimerClass = (isoString) => {
    const start = new Date(isoString);
    const now = new Date();
    const mins = (now - start) / 60000;
    if (mins >= 20) return "timer-red";
    if (mins >= 10) return "timer-yellow";
    return "timer-green";
  };

  // ============================================
  // VOID HANDLERS
  // ============================================
  const handleVoidItem = (ticketId, itemIndex) => {
    setShowVoidPrompt({ type: "item", ticketId, itemIndex });
    setVoidPassword("");
    setVoidReason("");
  };

  const handleVoidTicket = (ticketId) => {
    setShowVoidPrompt({ type: "ticket", ticketId });
    setVoidPassword("");
    setVoidReason("");
  };

  const processVoid = async () => {
    if (!showVoidPrompt) return;
    const { type, ticketId, itemIndex } = showVoidPrompt;

    const endpoint =
      type === "item"
        ? `http://localhost:5000/api/tickets/${ticketId}/void-item`
        : `http://localhost:5000/api/tickets/${ticketId}/void`;

    const body = {
      managerPassword: voidPassword,
      voidedBy: userRole,
      reason: voidReason,
    };
    if (type === "item") body.itemIndex = itemIndex;

    try {
      const response = await fetch(endpoint, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json();

      if (response.ok) {
        alert(`\u2705 ${type === "item" ? "Item" : "Ticket"} voided successfully!`);
        setShowVoidPrompt(null);
        setSelectedTicket(null);
        fetchTickets();
      } else {
        alert(data.message || "Failed to void");
      }
    } catch (err) {
      alert("Error processing void: " + err.message);
    }
  };

  // Filter tickets by tab
  const filteredTickets = tickets
    .filter((t) => t.status === activeTab)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // ============================================
  // RENDER: TICKET DETAIL VIEW
  // ============================================
  if (selectedTicket) {
    const ticket = selectedTicket;
    const isOpen = ticket.status === "open";

    return (
      <div className="ticket-overlay">
        <div className="ticket-modal">
          <div className="ticket-modal-header">
            <h2>🎫 Ticket Detail</h2>
            <button className="close-btn" onClick={() => setSelectedTicket(null)}>✕</button>
          </div>

          <div className="ticket-detail-content">
            <div className="ticket-detail-info">
              <div className="ticket-detail-row">
                <span className="detail-label">Ticket ID:</span>
                <span>{ticket.ticketId}</span>
              </div>
              <div className="ticket-detail-row">
                <span className="detail-label">Status:</span>
                <span className={`ticket-status-badge ${ticket.status}`}>
                  {isOpen ? "🔴 Open" : ticket.status === "voided" ? "⛔ Voided" : "🟢 Closed"}
                </span>
              </div>
              <div className="ticket-detail-row">
                <span className="detail-label">Sent at:</span>
                <span>{formatTime(ticket.createdAt)}</span>
              </div>
              {isOpen ? (
                <div className="ticket-detail-row">
                  <span className="detail-label">Elapsed:</span>
                  <span className={`ticket-timer ${getTimerClass(ticket.createdAt)}`}>
                    ⏱ {formatElapsed(ticket.createdAt)}
                  </span>
                </div>
              ) : (
                <div className="ticket-detail-row">
                  <span className="detail-label">Total time:</span>
                  <span>{formatDuration(ticket.createdAt, ticket.closedAt)}</span>
                </div>
              )}
              <div className="ticket-detail-row">
                <span className="detail-label">Sent by:</span>
                <span>{ticket.sentBy}</span>
              </div>
            </div>

            {/* Items list */}
            <h3>Items</h3>
            <div className="ticket-detail-items">
              {ticket.items.map((item, idx) => (
                <div key={idx} className="ticket-detail-item">
                  <span className="item-qty">{item.quantity}x</span>
                  <span className="item-name">{item.name}</span>
                  {/* Manager-only: show individual item sent time */}
                  {userRole === "Manager" && (
                    <span className="item-sent-time">
                      🕐 {formatTime(item.sentAt)}
                    </span>
                  )}
                  {/* Void item button (only for open tickets, manager only) */}
                  {isOpen && userRole === "Manager" && (
                    <button
                      className="void-item-btn"
                      onClick={() => handleVoidItem(ticket.ticketId, idx)}
                    >
                      ✕ Void
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Void entire ticket button (only for open tickets, manager only) */}
            {isOpen && userRole === "Manager" && (
              <button
                className="void-ticket-btn"
                onClick={() => handleVoidTicket(ticket.ticketId)}
              >
                ⛔ Void Entire Ticket
              </button>
            )}

            {/* Manager-only: item timestamp accountability section */}
            {userRole === "Manager" && (
              <div className="manager-timestamp-section">
                <h3>🔒 Item Timestamp Log (Manager Only)</h3>
                <div className="timestamp-log">
                  {ticket.items.map((item, idx) => (
                    <div key={idx} className="timestamp-row">
                      <span className="timestamp-item">{item.quantity}x {item.name}</span>
                      <span className="timestamp-time">{new Date(item.sentAt).toLocaleString()}</span>
                      <span className="timestamp-by">Sent by: {ticket.sentBy}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Void Password Prompt */}
          {showVoidPrompt && (
            <div className="void-prompt-overlay">
              <div className="void-prompt">
                <h3>⚠️ Manager Authorization Required</h3>
                <p>
                  {showVoidPrompt.type === "item"
                    ? "Enter manager password to void this item"
                    : "Enter manager password to void this ticket"}
                </p>
                <input
                  type="password"
                  placeholder="Manager password"
                  value={voidPassword}
                  onChange={(e) => setVoidPassword(e.target.value)}
                  className="void-password-input"
                  autoFocus
                />
                <input
                  type="text"
                  placeholder="Reason for void (optional)"
                  value={voidReason}
                  onChange={(e) => setVoidReason(e.target.value)}
                  className="void-reason-input"
                />
                <div className="void-actions">
                  <button onClick={() => setShowVoidPrompt(null)}>Cancel</button>
                  <button className="process-void-btn" onClick={processVoid}>
                    Confirm Void
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ============================================
  // RENDER: TICKETS LIST
  // ============================================
  return (
    <div className="ticket-overlay">
      <div className="ticket-modal large">
        <div className="ticket-modal-header">
          <h2>🎫 Kitchen Tickets</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Tab selector */}
        <div className="ticket-tabs">
          <button
            className={`ticket-tab ${activeTab === "open" ? "active" : ""}`}
            onClick={() => setActiveTab("open")}
          >
            🔴 Open
          </button>
          <button
            className={`ticket-tab ${activeTab === "closed" ? "active" : ""}`}
            onClick={() => setActiveTab("closed")}
          >
            🟢 Completed
          </button>
          {userRole === "Manager" && (
            <button
              className={`ticket-tab ${activeTab === "voided" ? "active" : ""}`}
              onClick={() => setActiveTab("voided")}
            >
              ⛔ Voided
            </button>
          )}
          <button className="ticket-refresh-btn" onClick={fetchTickets}>
            🔄 Refresh
          </button>
        </div>

        {/* Tickets grid */}
        <div className="ticket-grid">
          {loading && <p className="ticket-loading">Loading tickets...</p>}

          {!loading && filteredTickets.length === 0 && (
            <p className="ticket-empty">
              {activeTab === "open"
                ? "No open tickets"
                : activeTab === "voided"
                ? "No voided tickets"
                : "No completed tickets"}
            </p>
          )}

          {!loading &&
            filteredTickets.map((ticket) => (
              <div
                key={ticket.ticketId}
                className={`ticket-card ${ticket.status}`}
                onClick={() => setSelectedTicket(ticket)}
              >
                <div className="ticket-card-header">
                  <span className="ticket-id">{ticket.ticketId}</span>
                  {ticket.status === "open" ? (
                    <span className={`ticket-timer ${getTimerClass(ticket.createdAt)}`}>
                      ⏱ {formatElapsed(ticket.createdAt)}
                    </span>
                  ) : (
                    <span className="ticket-duration">
                      ✅ {formatDuration(ticket.createdAt, ticket.closedAt)}
                    </span>
                  )}
                </div>

                <div className="ticket-card-items">
                  {ticket.items.map((item, idx) => (
                    <div key={idx} className="ticket-card-item">
                      <span>{item.quantity}x {item.name}</span>
                    </div>
                  ))}
                </div>

                <div className="ticket-card-footer">
                  <span className="ticket-time">
                    Sent: {formatTime(ticket.createdAt)}
                  </span>
                  <span className="ticket-view-detail">View Detail →</span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
