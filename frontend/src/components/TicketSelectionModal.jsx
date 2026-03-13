// ============================================
// TICKET SELECTION MODAL
// ============================================
// Professional modal for selecting which open ticket to pay for

export default function TicketSelectionModal({ tickets, onSelect, onCancel }) {
  return (
    <div className="ticket-selection-overlay">
      <div className="ticket-selection-modal">
        <div className="ticket-selection-header">
          <h2>🎫 Select Ticket to Pay</h2>
          <button className="close-btn" onClick={onCancel}>✕</button>
        </div>

        <div className="ticket-selection-content">
          <p className="ticket-selection-subtitle">
            Multiple open tickets found. Select one to process payment:
          </p>

          <div className="ticket-selection-grid">
            {tickets.map((ticket, index) => (
              <div
                key={ticket.ticketId}
                className="ticket-selection-card"
                onClick={() => onSelect(ticket)}
              >
                <div className="ticket-selection-card-header">
                  <span className="ticket-selection-number">#{index + 1}</span>
                  <span className="ticket-selection-id">{ticket.ticketId}</span>
                </div>

                <div className="ticket-selection-items">
                  <strong>{ticket.items.length} items:</strong>
                  <ul>
                    {ticket.items.slice(0, 3).map((item, idx) => (
                      <li key={idx}>
                        {item.quantity}x {item.name}
                      </li>
                    ))}
                    {ticket.items.length > 3 && (
                      <li className="more-items">
                        +{ticket.items.length - 3} more...
                      </li>
                    )}
                  </ul>
                </div>

                <div className="ticket-selection-footer">
                  <span className="ticket-selection-time">
                    Sent: {new Date(ticket.createdAt).toLocaleTimeString()}
                  </span>
                  <button className="ticket-selection-btn">
                    Select →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="ticket-selection-actions">
          <button className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
