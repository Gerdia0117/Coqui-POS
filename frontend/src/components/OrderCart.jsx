// ============================================
// ORDER CART COMPONENT
// ============================================
// Displays current order items with:
// - Item list with quantities
// - Price calculations (subtotal, tax, total)
// - Quantity adjustment buttons
// - Remove item functionality
// - Clear all button

export default function OrderCart({ 
  orderItems, 
  onUpdateQuantity, 
  onRemoveItem, 
  onClearOrder,
  onProceedToPayment 
}) {
  
  // ============================================
  // CALCULATE ORDER TOTALS
  // ============================================
  const subtotal = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.115; // 11.5% Puerto Rico sales tax
  const total = subtotal + tax;

  // ============================================
  // RENDER COMPONENT
  // ============================================
  return (
    <div className="order-cart">
      {/* ============================================ */}
      {/* CART HEADER */}
      {/* ============================================ */}
      <div className="cart-header">
        <h2>Current Order</h2>
        {orderItems.length > 0 && (
          <button 
            className="clear-order-btn"
            onClick={onClearOrder}
          >
            Clear All
          </button>
        )}
      </div>

      {/* ============================================ */}
      {/* ORDER ITEMS LIST */}
      {/* ============================================ */}
      <div className="cart-items">
        {orderItems.length === 0 ? (
          <p className="empty-cart">No items in order</p>
        ) : (
          orderItems.map((item) => (
            <div key={item.id} className="cart-item">
              {/* Item Info */}
              <div className="cart-item-info">
                <h4>{item.name}</h4>
                <p className="cart-item-price">${item.price.toFixed(2)} each</p>
              </div>

              {/* Quantity Controls */}
              <div className="cart-item-controls">
                <div className="quantity-controls">
                  <button
                    className="qty-btn"
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span className="quantity">{item.quantity}</span>
                  <button
                    className="qty-btn"
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>

                {/* Item Total */}
                <div className="cart-item-total">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>

                {/* Remove Button */}
                <button
                  className="remove-item-btn"
                  onClick={() => onRemoveItem(item.id)}
                  title="Remove item"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ============================================ */}
      {/* ORDER SUMMARY / TOTALS */}
      {/* ============================================ */}
      {orderItems.length > 0 && (
        <div className="cart-summary">
          <div className="summary-row">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Tax (11.5%):</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="summary-row total-row">
            <strong>Total:</strong>
            <strong>${total.toFixed(2)}</strong>
          </div>

          {/* ============================================ */}
          {/* PROCEED TO PAYMENT BUTTON */}
          {/* ============================================ */}
          <button
            className="proceed-payment-btn"
            onClick={onProceedToPayment}
          >
            Proceed to Payment →
          </button>
        </div>
      )}
    </div>
  );
}
