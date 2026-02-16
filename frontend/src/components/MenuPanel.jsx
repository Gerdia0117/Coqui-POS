// ============================================
// MENU PANEL COMPONENT
// ============================================
// Main menu display with category navigation
// Shows menu items filtered by selected category

import { useState } from "react";
import { menuData, categories } from "../data/menuData";
import MenuItem from "./MenuItem";

export default function MenuPanel({ onAddToOrder }) {
  // ============================================
  // STATE MANAGEMENT
  // ============================================
  const [selectedCategory, setSelectedCategory] = useState("beverages");

  // ============================================
  // GET ITEMS FOR SELECTED CATEGORY
  // ============================================
  const currentItems = menuData[selectedCategory] || [];

  // ============================================
  // RENDER COMPONENT
  // ============================================
  return (
    <div className="menu-panel">
      {/* ============================================ */}
      {/* CATEGORY NAVIGATION BUTTONS */}
      {/* ============================================ */}
      <div className="category-navigation">
        <h2>Menu Categories</h2>
        <div className="category-buttons">
          {categories.map((category) => (
            <button
              key={category.key}
              className={`category-btn ${
                selectedCategory === category.key ? "active" : ""
              }`}
              onClick={() => setSelectedCategory(category.key)}
            >
              <span className="category-icon">{category.icon}</span>
              <span className="category-label">{category.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ============================================ */}
      {/* MENU ITEMS GRID */}
      {/* ============================================ */}
      <div className="menu-items-container">
        <h3 className="current-category-title">
          {categories.find((c) => c.key === selectedCategory)?.label}
        </h3>
        
        <div className="menu-items-grid">
          {currentItems.length > 0 ? (
            currentItems.map((item) => (
              <MenuItem
                key={item.id}
                item={item}
                onAddToOrder={onAddToOrder}
              />
            ))
          ) : (
            <p className="no-items">No items available in this category</p>
          )}
        </div>
      </div>
    </div>
  );
}
