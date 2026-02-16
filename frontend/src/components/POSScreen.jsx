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
    // In a real app, you would save this to database
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

  // Handle logo click - return to home
  const handleLogoClick = () => {
    // Close any open modals
    setShowPaymentModal(false);
    setShowSalesDashboard(false);
    // Optionally clear the current order (uncomment if desired)
    // setOrderItems([]);
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
        onLogout={onLogout}
        onOpenSalesDashboard={handleOpenSalesDashboard}
        onLogoClick={handleLogoClick}
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
              onProceedToPayment={handleProceedToPayment}
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
        />
      )}

      {/* ============================================ */}
      {/* SALES DASHBOARD MODAL (Manager Only) */}
      {/* ============================================ */}
      {showSalesDashboard && (
        <SalesDashboard onClose={handleCloseSalesDashboard} />
      )}
    </div>
  );
}
