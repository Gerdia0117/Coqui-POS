// ============================================
// POS SCREEN COMPONENT
// ============================================
// Main POS interface integrating all components:
// - Header with user info and controls
// - Menu panel with category navigation
// - Order cart with item management
// - Payment modal with all payment features

import { useState } from "react";
import Header from "./Header";
import MenuPanel from "./MenuPanel";
import OrderCart from "./OrderCart";
import PaymentModal from "./PaymentModal";
import SalesDashboard from "./SalesDashboard";
import AIAssistant from "./AIAssistant";
import KitchenTickets from "./KitchenTickets";
import VoidLog from "./VoidLog";

export default function POSScreen({
  userRole,
  darkMode,
  setDarkMode,
  onLogout
}) {
  // ============================================
  // STATE MANAGEMENT
  // ============================================
  const [orderItems, setOrderItems] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSalesDashboard, setShowSalesDashboard] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [showKitchenTickets, setShowKitchenTickets] = useState(false);
  const [showVoidLog, setShowVoidLog] = useState(false);
  const [currentTicketId, setCurrentTicketId] = useState(null);

  // ============================================
  // ORDER MANAGEMENT FUNCTIONS
  // ============================================
  
  // Add item to order
  const handleAddToOrder = (item) => {
    const existingItem = orderItems.find((i) => i.id === item.id);
    
    if (existingItem) {
      // If item exists, increase quantity
      setOrderItems(
        orderItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      );
    } else {
      // Add new item with quantity 1
      setOrderItems([...orderItems, { ...item, quantity: 1 }]);
    }
  };

  // Update item quantity
  const handleUpdateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(itemId);
    } else {
      setOrderItems(
        orderItems.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  // Remove item from order
  const handleRemoveItem = (itemId) => {
    setOrderItems(orderItems.filter((item) => item.id !== itemId));
  };

  // Clear entire order
  const handleClearOrder = () => {
    if (window.confirm("Clear all items from order?")) {
      setOrderItems([]);
    }
  };

  // Proceed to payment
  const handleProceedToPayment = () => {
    if (orderItems.length === 0) {
      alert("No items in order!");
      return;
    }
    setShowPaymentModal(true);
  };

  // Complete payment and reset
  const handleCompletePayment = (receipt) => {
    console.log("Payment completed:", receipt);
    // Close the kitchen ticket when payment completes
    if (currentTicketId) {
      handleCloseTicket(currentTicketId);
      setCurrentTicketId(null);
    }
  };

  // Close payment modal and clear order
  const handleClosePayment = () => {
    setShowPaymentModal(false);
    setOrderItems([]);
  };

  // Open/Close Sales Dashboard
  const handleOpenSalesDashboard = () => {
    setShowSalesDashboard(true);
  };

  const handleCloseSalesDashboard = () => {
    setShowSalesDashboard(false);
  };

  // Open/Close AI Assistant
  const handleOpenAIAssistant = () => {
    setShowAIAssistant(true);
  };

  const handleCloseAIAssistant = () => {
    setShowAIAssistant(false);
  };

  // Open/Close Kitchen Tickets
  const handleOpenTickets = () => {
    setShowKitchenTickets(true);
  };

  const handleCloseTickets = () => {
    setShowKitchenTickets(false);
  };

  // Send order to kitchen and create a ticket
  const handleSendToKitchen = async (items) => {
    if (!items || items.length === 0) {
      alert("No items in order!");
      return null;
    }
    try {
      const response = await fetch("http://localhost:5000/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items,
          sentBy: userRole
        })
      });
      if (response.ok) {
        const data = await response.json();
        setCurrentTicketId(data.ticketId);
        alert("🖨️ Order sent to kitchen!\n\n" +
          items.map(item => `${item.quantity}x ${item.name}`).join("\n"));
        setOrderItems([]);
        return data.ticketId;
      }
    } catch (err) {
      console.warn("Could not create kitchen ticket:", err.message);
    }
    return null;
  };

  // Close ticket when payment is completed
  const handleCloseTicket = async (ticketId) => {
    if (!ticketId) return;
    try {
      await fetch(`http://localhost:5000/api/tickets/${ticketId}/close`, {
        method: "PATCH"
      });
    } catch (err) {
      console.warn("Could not close ticket:", err.message);
    }
  };

  // Open/Close Void Log
  const handleOpenVoidLog = () => {
    setShowVoidLog(true);
  };

  const handleCloseVoidLog = () => {
    setShowVoidLog(false);
  };

  // Handle logo click - return to login screen for quick user switch
  const handleLogoClick = () => {
    onLogout();
  };

  // ============================================
  // CALCULATE TOTALS
  // ============================================
  const subtotal = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.115; // 11.5% PR sales tax
  const total = subtotal + tax;

  // ============================================
  // RENDER COMPONENT
  // ============================================
  return (
    <div className={`pos-page ${darkMode ? "dark" : ""}`}>
      {/* ============================================ */}
      {/* HEADER */}
      {/* ============================================ */}
      <Header
        userRole={userRole}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenSalesDashboard={handleOpenSalesDashboard}
        onOpenAIAssistant={handleOpenAIAssistant}
        onLogoClick={handleLogoClick}
        onProceedToPayment={handleProceedToPayment}
        onOpenTickets={handleOpenTickets}
        onOpenVoidLog={handleOpenVoidLog}
      />

      {/* ============================================ */}
      {/* MAIN POS CONTENT */}
      {/* ============================================ */}
      <div className="pos-content">
        <div className="pos-layout">
          {/* ============================================ */}
          {/* LEFT SIDE: MENU PANEL */}
          {/* ============================================ */}
          <div className="menu-section">
            <MenuPanel onAddToOrder={handleAddToOrder} />
          </div>

          {/* ============================================ */}
          {/* RIGHT SIDE: ORDER CART */}
          {/* ============================================ */}
          <div className="cart-section">
            <OrderCart
              orderItems={orderItems}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              onClearOrder={handleClearOrder}
              onSendToKitchen={handleSendToKitchen}
            />
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* PAYMENT MODAL */}
      {/* ============================================ */}
      {showPaymentModal && (
        <PaymentModal
          orderItems={orderItems}
          subtotal={subtotal}
          tax={tax}
          total={total}
          userRole={userRole}
          onClose={handleClosePayment}
          onCompletePayment={handleCompletePayment}
          onSendToKitchen={handleSendToKitchen}
        />
      )}

      {/* ============================================ */}
      {/* SALES DASHBOARD MODAL (Manager Only) */}
      {/* ============================================ */}
      {showSalesDashboard && (
        <SalesDashboard onClose={handleCloseSalesDashboard} />
      )}

      {/* ============================================ */}
      {/* AI ASSISTANT MODAL */}
      {/* ============================================ */}
      {showAIAssistant && (
        <AIAssistant onClose={handleCloseAIAssistant} />
      )}

      {/* ============================================ */}
      {/* KITCHEN TICKETS MODAL */}
      {/* ============================================ */}
      {showKitchenTickets && (
        <KitchenTickets
          onClose={handleCloseTickets}
          userRole={userRole}
        />
      )}
      {/* ============================================ */}
      {/* VOID LOG MODAL (Manager Only) */}
      {/* ============================================ */}
      {showVoidLog && (
        <VoidLog onClose={handleCloseVoidLog} />
      )}
    </div>
  );
}
