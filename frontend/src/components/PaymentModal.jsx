// ============================================
// PAYMENT MODAL COMPONENT
// ============================================
// Comprehensive payment interface with:
// - Cash payment option
// - Card payment option
// - Tip calculation for both methods
// - Print order button
// - Print receipt button
// - Reprint receipt button
// - Refund button (requires manager authorization)

import { useState } from "react";

export default function PaymentModal({ 
  orderItems, 
  subtotal, 
  tax, 
  total,
  userRole,
  onClose,
  onCompletePayment,
  onSendToKitchen 
}) {
  
  // ============================================
  // STATE MANAGEMENT
  // ============================================
  const [paymentMethod, setPaymentMethod] = useState(null); // 'cash' or 'card'
  const [tipPercentage, setTipPercentage] = useState(0);
  const [customTip, setCustomTip] = useState("");
  const [cashReceived, setCashReceived] = useState("");
  const [showRefundPrompt, setShowRefundPrompt] = useState(false);
  const [refundPassword, setRefundPassword] = useState("");
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [lastReceipt, setLastReceipt] = useState(null);

  // ============================================
  // TIP CALCULATIONS
  // ============================================
  const tipAmount = customTip 
    ? parseFloat(customTip) || 0
    : total * (tipPercentage / 100);
  const grandTotal = total + tipAmount;

  // Calculate change for cash payments
  const cashAmount = parseFloat(cashReceived) || 0;
  const change = cashAmount - grandTotal;

  // ============================================
  // PAYMENT HANDLERS
  // ============================================
  
  // Handle Cash Payment
  const handleCashPayment = () => {
    if (cashAmount < grandTotal) {
      alert("Insufficient cash received!");
      return;
    }
    completePayment("cash");
  };

  // Handle Card Payment
  const handleCardPayment = () => {
    // Realistic card payment simulation
    setPaymentMethod("processing");
    
    // Step 1: Connecting to terminal
    setTimeout(() => {
      setPaymentMethod("terminal-connected");
    }, 800);
    
    // Step 2: Reading card
    setTimeout(() => {
      setPaymentMethod("reading-card");
    }, 1600);
    
    // Step 3: Authorizing
    setTimeout(() => {
      setPaymentMethod("authorizing");
    }, 2400);
    
    // Step 4: Approved
    setTimeout(() => {
      setPaymentMethod("approved");
    }, 3200);
    
    // Step 5: Complete payment
    setTimeout(() => {
      completePayment("card");
    }, 4000);
  };

  // Complete Payment
  const completePayment = async (method) => {
    const receipt = {
      orderId: `ORD-${Date.now()}`,
      items: orderItems,
      subtotal,
      tax,
      tip: tipAmount,
      total: grandTotal,
      paymentMethod: method,
      cashReceived: method === "cash" ? cashAmount : null,
      change: method === "cash" ? change : null,
      timestamp: new Date().toLocaleString()
    };
    
    // ============================================
    // SEND ORDER TO BACKEND
    // ============================================
    try {
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(receipt)
      });
      
      if (response.ok) {
        console.log('✅ Order saved to backend successfully');
      } else {
        console.warn('⚠️ Failed to save order to backend');
      }
    } catch (error) {
      console.warn('⚠️ Backend not available:', error.message);
      // Continue anyway - for demo, backend is optional
    }
    
    setLastReceipt(receipt);
    setPaymentCompleted(true);
    printReceipt(receipt);
    onCompletePayment(receipt);
  };

  // ============================================
  // PRINT HANDLERS
  // ============================================
  
  // Print Order (Kitchen Order) and create kitchen ticket
  const handlePrintOrder = async () => {
    console.log("Printing kitchen order...");
    // Create a kitchen ticket with timestamps
    if (onSendToKitchen) {
      await onSendToKitchen(orderItems);
    }
    alert("Kitchen order sent to printer!\n\nOrder Items:\n" + 
      orderItems.map(item => `${item.quantity}x ${item.name}`).join("\n"));
  };

  // Print Receipt
  const printReceipt = (receipt) => {
    console.log("Printing receipt...", receipt);
    alert(`Receipt Printed!\n\nOrder #${receipt.orderId}\n${receipt.timestamp}\n\n` +
      `Subtotal: $${receipt.subtotal.toFixed(2)}\n` +
      `Tax: $${receipt.tax.toFixed(2)}\n` +
      `Tip: $${receipt.tip.toFixed(2)}\n` +
      `Total: $${receipt.total.toFixed(2)}\n\n` +
      `Payment: ${receipt.paymentMethod.toUpperCase()}\n` +
      (receipt.change ? `Change: $${receipt.change.toFixed(2)}` : ""));
  };

  // Reprint Last Receipt
  const handleReprintReceipt = () => {
    if (lastReceipt) {
      printReceipt(lastReceipt);
    } else {
      alert("No receipt available to reprint");
    }
  };

  // ============================================
  // REFUND HANDLER (MANAGER AUTHORIZATION)
  // ============================================
  const handleRefund = () => {
    if (userRole !== "Manager") {
      alert("Only managers can process refunds!");
      return;
    }
    setShowRefundPrompt(true);
  };

  const processRefund = () => {
    // Check manager password
    if (refundPassword === "admin123") {
      alert(`Refund processed!\nAmount: $${grandTotal.toFixed(2)}\nOrder ID: ${lastReceipt?.orderId || "N/A"}`);
      setShowRefundPrompt(false);
      setRefundPassword("");
      onClose();
    } else {
      alert("Incorrect manager password!");
    }
  };

  // ============================================
  // RENDER COMPONENT
  // ============================================
  return (
    <div className="payment-modal-overlay">
      <div className="payment-modal">
        {/* ============================================ */}
        {/* MODAL HEADER */}
        {/* ============================================ */}
        <div className="payment-header">
          <h2>💳 Payment</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {/* ============================================ */}
        {/* ORDER SUMMARY */}
        {/* ============================================ */}
        <div className="payment-summary">
          <h3>Order Summary</h3>
          
          {/* Order Items List */}
          <div className="order-items-list">
            {orderItems.map((item, index) => (
              <div key={index} className="order-item-row">
                <span className="item-quantity">{item.quantity}x</span>
                <span className="item-name">{item.name}</span>
                <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          
          <div className="summary-divider"></div>
          
          <div className="summary-line">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-line">
            <span>Tax (11.5%):</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="summary-line">
            <span>Tip:</span>
            <span>${tipAmount.toFixed(2)}</span>
          </div>
          <div className="summary-line total-line">
            <strong>Grand Total:</strong>
            <strong>${grandTotal.toFixed(2)}</strong>
          </div>
        </div>

        {/* ============================================ */}
        {/* TIP SELECTION */}
        {/* ============================================ */}
        {!paymentCompleted && (
          <div className="tip-section">
            <h3>Add Tip</h3>
            <div className="tip-buttons">
              {[0, 10, 15, 20].map((percent) => (
                <button
                  key={percent}
                  className={`tip-btn ${tipPercentage === percent && !customTip ? "active" : ""}`}
                  onClick={() => {
                    setTipPercentage(percent);
                    setCustomTip("");
                  }}
                >
                  {percent}%
                </button>
              ))}
            </div>
            <input
              type="number"
              placeholder="Custom tip amount ($)"
              value={customTip}
              onChange={(e) => {
                setCustomTip(e.target.value);
                setTipPercentage(0);
              }}
              className="custom-tip-input"
            />
          </div>
        )}

        {/* ============================================ */}
        {/* PAYMENT METHOD SELECTION */}
        {/* ============================================ */}
        {!paymentCompleted && !paymentMethod && (
          <div className="payment-methods">
            <h3>Select Payment Method</h3>
            <div className="payment-method-buttons">
              <button
                className="payment-method-btn cash-btn"
                onClick={() => setPaymentMethod("cash")}
              >
                💵 Cash
              </button>
              <button
                className="payment-method-btn card-btn"
                onClick={() => setPaymentMethod("card")}
              >
                💳 Card
              </button>
            </div>
          </div>
        )}

        {/* ============================================ */}
        {/* CASH PAYMENT INTERFACE */}
        {/* ============================================ */}
        {!paymentCompleted && paymentMethod === "cash" && (
          <div className="cash-payment-section">
            <h3>Cash Payment</h3>
            <input
              type="number"
              placeholder="Cash received ($)"
              value={cashReceived}
              onChange={(e) => setCashReceived(e.target.value)}
              className="cash-input"
              step="0.01"
            />
            {cashAmount > 0 && (
              <div className="change-display">
                <strong>Change:</strong> 
                <span className={change < 0 ? "insufficient" : "sufficient"}>
                  ${change.toFixed(2)}
                </span>
              </div>
            )}
            <div className="payment-actions">
              <button onClick={() => setPaymentMethod(null)}>← Back</button>
              <button 
                className="complete-payment-btn"
                onClick={handleCashPayment}
                disabled={change < 0}
              >
                Complete Cash Payment
              </button>
            </div>
          </div>
        )}

        {/* ============================================ */}
        {/* CARD PAYMENT INTERFACE */}
        {/* ============================================ */}
        {!paymentCompleted && paymentMethod === "card" && (
          <div className="card-payment-section">
            <h3>💳 Card Payment</h3>
            <div className="card-terminal-display">
              <div className="terminal-screen">
                <p className="terminal-text">💳 Card Terminal Ready</p>
                <p className="amount-display">Amount: ${grandTotal.toFixed(2)}</p>
              </div>
            </div>
            <p className="instruction-text">Insert, tap, or swipe card when ready</p>
            <div className="payment-actions">
              <button onClick={() => setPaymentMethod(null)}>← Back</button>
              <button 
                className="complete-payment-btn card-process-btn"
                onClick={handleCardPayment}
              >
                🔄 Process Card Payment
              </button>
            </div>
          </div>
        )}
        
        {/* ============================================ */}
        {/* CARD PROCESSING ANIMATION */}
        {/* ============================================ */}
        {!paymentCompleted && paymentMethod === "processing" && (
          <div className="card-payment-section">
            <div className="card-terminal-display processing">
              <div className="terminal-screen">
                <div className="processing-spinner"></div>
                <p className="terminal-text">Connecting to terminal...</p>
              </div>
            </div>
          </div>
        )}
        
        {!paymentCompleted && paymentMethod === "terminal-connected" && (
          <div className="card-payment-section">
            <div className="card-terminal-display processing">
              <div className="terminal-screen">
                <div className="processing-spinner"></div>
                <p className="terminal-text">✓ Terminal Connected</p>
                <p className="terminal-text">Reading card...</p>
              </div>
            </div>
          </div>
        )}
        
        {!paymentCompleted && paymentMethod === "reading-card" && (
          <div className="card-payment-section">
            <div className="card-terminal-display processing">
              <div className="terminal-screen">
                <div className="processing-spinner"></div>
                <p className="terminal-text">✓ Card Detected</p>
                <p className="terminal-text">Authorizing transaction...</p>
              </div>
            </div>
          </div>
        )}
        
        {!paymentCompleted && paymentMethod === "authorizing" && (
          <div className="card-payment-section">
            <div className="card-terminal-display processing">
              <div className="terminal-screen">
                <div className="processing-spinner"></div>
                <p className="terminal-text">Contacting bank...</p>
                <p className="terminal-text">Amount: ${grandTotal.toFixed(2)}</p>
              </div>
            </div>
          </div>
        )}
        
        {!paymentCompleted && paymentMethod === "approved" && (
          <div className="card-payment-section">
            <div className="card-terminal-display approved">
              <div className="terminal-screen">
                <div className="approval-checkmark">✓</div>
                <p className="terminal-text success">APPROVED</p>
                <p className="terminal-text">Processing receipt...</p>
              </div>
            </div>
          </div>
        )}

        {/* ============================================ */}
        {/* PAYMENT COMPLETED - ACTION BUTTONS */}
        {/* ============================================ */}
        {paymentCompleted && (
          <div className="payment-completed">
            <h3 className="success-message">✅ Payment Completed!</h3>
            <p>Order #{lastReceipt?.orderId}</p>
            
            {/* Action Buttons Grid */}
            <div className="action-buttons">
              <button 
                className="action-btn print-order-btn"
                onClick={handlePrintOrder}
              >
                🖨️ Print Order
              </button>
              
              <button 
                className="action-btn print-receipt-btn"
                onClick={() => printReceipt(lastReceipt)}
              >
                🧾 Print Receipt
              </button>
              
              <button 
                className="action-btn reprint-btn"
                onClick={handleReprintReceipt}
              >
                📄 Reprint Receipt
              </button>
              
              {userRole === "Manager" && (
                <button 
                  className="action-btn refund-btn"
                  onClick={handleRefund}
                >
                  💰 Refund (Manager)
                </button>
              )}
            </div>

            <button 
              className="new-order-btn"
              onClick={onClose}
            >
              Start New Order
            </button>
          </div>
        )}

        {/* ============================================ */}
        {/* REFUND AUTHORIZATION PROMPT */}
        {/* ============================================ */}
        {showRefundPrompt && (
          <div className="refund-prompt-overlay">
            <div className="refund-prompt">
              <h3>⚠️ Manager Authorization Required</h3>
              <p>Enter manager password to process refund</p>
              <input
                type="password"
                placeholder="Manager password"
                value={refundPassword}
                onChange={(e) => setRefundPassword(e.target.value)}
                className="refund-password-input"
              />
              <div className="refund-actions">
                <button onClick={() => {
                  setShowRefundPrompt(false);
                  setRefundPassword("");
                }}>
                  Cancel
                </button>
                <button 
                  className="process-refund-btn"
                  onClick={processRefund}
                >
                  Process Refund
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
