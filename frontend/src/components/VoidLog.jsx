// ============================================
// VOID LOG COMPONENT (MANAGER ONLY)
// ============================================
// Displays a log of all voided items and tickets:
// - What was voided (item or ticket)
// - Who voided it
// - Who originally sent it
// - When it was voided
// - Reason (if provided)

import { useState, useEffect } from "react";

export default function VoidLog({ onClose }) {
  const [voids, setVoids] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchVoids = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/voids");
      if (response.ok) {
        const data = await response.json();
        setVoids(data.voids || []);
      }
    } catch (err) {
      console.error("Error fetching voids:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVoids();
  }, []);

  // Sort most recent first
  const sortedVoids = [...voids].sort(
    (a, b) => new Date(b.voidedAt) - new Date(a.voidedAt)
  );

  return (
    <div className="void-log-overlay">
      <div className="void-log-modal">
        <div className="void-log-header">
          <h2>🚫 Void Log</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="void-log-content">
          {loading && <p className="void-log-loading">Loading void records...</p>}

          {!loading && sortedVoids.length === 0 && (
            <p className="void-log-empty">No void records found</p>
          )}

          {!loading &&
            sortedVoids.map((v) => (
              <div key={v.voidId} className={`void-log-card ${v.type}`}>
                <div className="void-log-card-header">
                  <span className={`void-type-badge ${v.type}`}>
                    {v.type === "item" ? "🍽️ Item Void" : "📋 Ticket Void"}
                  </span>
                  <span className="void-log-time">
                    {new Date(v.voidedAt).toLocaleString()}
                  </span>
                </div>

                <div className="void-log-details">
                  <div className="void-log-row">
                    <span className="void-label">Ticket:</span>
                    <span className="void-value">{v.ticketId}</span>
                  </div>

                  {v.type === "item" && v.item && (
                    <div className="void-log-row">
                      <span className="void-label">Item:</span>
                      <span className="void-value">
                        {v.item.quantity}x {v.item.name}
                      </span>
                    </div>
                  )}

                  {v.type === "ticket" && v.items && (
                    <div className="void-log-row">
                      <span className="void-label">Items:</span>
                      <span className="void-value">
                        {v.items.map((item) => `${item.quantity}x ${item.name}`).join(", ")}
                      </span>
                    </div>
                  )}

                  <div className="void-log-row">
                    <span className="void-label">Voided by:</span>
                    <span className="void-value void-by">{v.voidedBy}</span>
                  </div>

                  <div className="void-log-row">
                    <span className="void-label">Originally sent by:</span>
                    <span className="void-value void-original">{v.originalSentBy}</span>
                  </div>

                  {v.reason && (
                    <div className="void-log-row">
                      <span className="void-label">Reason:</span>
                      <span className="void-value void-reason">{v.reason}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
