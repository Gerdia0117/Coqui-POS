// ============================================
// MENU MANAGER COMPONENT
// ============================================
// Manager interface for adding and removing menu items
// Includes password protection and localStorage persistence

import { useState, useEffect } from "react";
import { menuData as initialMenuData, categories } from "../data/menuData";

const MANAGER_PASSWORD = "admin123"; // Password for menu management access

export default function MenuManager({ isOpen, onClose }) {
  // ============================================
  // STATE MANAGEMENT
  // ============================================
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [menuData, setMenuData] = useState(initialMenuData);
  const [selectedCategory, setSelectedCategory] = useState("beverages");
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Form state for adding new items
  const [newItem, setNewItem] = useState({
    name: "",
    price: "",
    category: "beverages",
    description: "",
    image: "/images/placeholder.jpg",
    allergens: "",
    proteins: "",
    ingredients: "",
    sides: ""
  });

  // ============================================
  // LOAD MENU FROM LOCALSTORAGE ON MOUNT
  // ============================================
  useEffect(() => {
    const savedMenu = localStorage.getItem("customMenuData");
    if (savedMenu) {
      try {
        setMenuData(JSON.parse(savedMenu));
      } catch (e) {
        console.error("Error loading saved menu:", e);
      }
    }
  }, []);

  // ============================================
  // PASSWORD VERIFICATION
  // ============================================
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordInput === MANAGER_PASSWORD) {
      setIsAuthenticated(true);
      setPasswordError("");
      setPasswordInput("");
    } else {
      setPasswordError("Incorrect password");
      setPasswordInput("");
    }
  };

  // ============================================
  // MENU ITEM MANAGEMENT
  // ============================================
  
  // Remove menu item
  const handleRemoveItem = (category, itemId) => {
    if (!window.confirm("Are you sure you want to remove this item from the menu?")) {
      return;
    }
    
    const updatedMenuData = {
      ...menuData,
      [category]: menuData[category].filter(item => item.id !== itemId)
    };
    
    setMenuData(updatedMenuData);
    localStorage.setItem("customMenuData", JSON.stringify(updatedMenuData));
  };

  // Add new menu item
  const handleAddItem = (e) => {
    e.preventDefault();
    
    // Validation
    if (!newItem.name || !newItem.price || !newItem.description) {
      alert("Please fill in all required fields (name, price, description)");
      return;
    }

    // Generate unique ID
    const categoryPrefix = newItem.category.substring(0, 3);
    const existingIds = menuData[newItem.category].map(item => item.id);
    let counter = 1;
    let newId = `${categoryPrefix}-${counter}`;
    while (existingIds.includes(newId)) {
      counter++;
      newId = `${categoryPrefix}-${counter}`;
    }

    // Create new item object
    const itemToAdd = {
      id: newId,
      name: newItem.name,
      price: parseFloat(newItem.price),
      category: newItem.category,
      image: newItem.image || "/images/placeholder.jpg",
      description: newItem.description,
      allergens: newItem.allergens ? newItem.allergens.split(",").map(a => a.trim()) : [],
      proteins: newItem.proteins ? newItem.proteins.split(",").map(p => p.trim()) : [],
      ingredients: newItem.ingredients ? newItem.ingredients.split(",").map(i => i.trim()) : [],
      sides: newItem.sides ? newItem.sides.split(",").map(s => s.trim()) : []
    };

    // Add to menu
    const updatedMenuData = {
      ...menuData,
      [newItem.category]: [...menuData[newItem.category], itemToAdd]
    };

    setMenuData(updatedMenuData);
    localStorage.setItem("customMenuData", JSON.stringify(updatedMenuData));
    
    // Reset form
    setNewItem({
      name: "",
      price: "",
      category: "beverages",
      description: "",
      image: "/images/placeholder.jpg",
      allergens: "",
      proteins: "",
      ingredients: "",
      sides: ""
    });
    setShowAddForm(false);
    alert("Item added successfully!");
  };

  // Reset menu to original
  const handleResetMenu = () => {
    if (!window.confirm("Reset menu to original? This will remove all custom changes.")) {
      return;
    }
    setMenuData(initialMenuData);
    localStorage.removeItem("customMenuData");
    alert("Menu reset to original");
  };

  // ============================================
  // CLOSE HANDLER
  // ============================================
  const handleClose = () => {
    setIsAuthenticated(false);
    setPasswordInput("");
    setPasswordError("");
    setShowAddForm(false);
    onClose();
  };

  // ============================================
  // RENDER
  // ============================================
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content menu-manager-modal" onClick={(e) => e.stopPropagation()}>
        {!isAuthenticated ? (
          // Password Protection Screen
          <div className="menu-manager-auth">
            <h2>🔐 Menu Manager Access</h2>
            <p>Enter manager password to continue</p>
            <form onSubmit={handlePasswordSubmit}>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter password"
                className="password-input"
                autoFocus
              />
              {passwordError && <p className="error-message">{passwordError}</p>}
              <div className="auth-buttons">
                <button type="submit" className="auth-btn">
                  Unlock
                </button>
                <button type="button" onClick={handleClose} className="auth-btn cancel">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          // Menu Management Interface
          <div className="menu-manager-interface">
            <div className="menu-manager-header">
              <h2>🍽️ Menu Manager</h2>
              <button onClick={handleClose} className="close-btn">✕</button>
            </div>

            <div className="menu-manager-actions">
              <button onClick={() => setShowAddForm(!showAddForm)} className="action-btn add">
                {showAddForm ? "Cancel" : "+ Add New Item"}
              </button>
              <button onClick={handleResetMenu} className="action-btn reset">
                🔄 Reset to Original Menu
              </button>
            </div>

            {/* Add Item Form */}
            {showAddForm && (
              <div className="add-item-form">
                <h3>Add New Menu Item</h3>
                <form onSubmit={handleAddItem}>
                  <div className="form-row">
                    <input
                      type="text"
                      placeholder="Item Name *"
                      value={newItem.name}
                      onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                      required
                    />
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Price *"
                      value={newItem.price}
                      onChange={(e) => setNewItem({...newItem, price: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-row">
                    <select
                      value={newItem.category}
                      onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                    >
                      {categories.map(cat => (
                        <option key={cat.key} value={cat.key}>{cat.label}</option>
                      ))}
                    </select>
                  </div>
                  <textarea
                    placeholder="Description *"
                    value={newItem.description}
                    onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Allergens (comma-separated)"
                    value={newItem.allergens}
                    onChange={(e) => setNewItem({...newItem, allergens: e.target.value})}
                  />
                  <input
                    type="text"
                    placeholder="Proteins (comma-separated)"
                    value={newItem.proteins}
                    onChange={(e) => setNewItem({...newItem, proteins: e.target.value})}
                  />
                  <input
                    type="text"
                    placeholder="Ingredients (comma-separated)"
                    value={newItem.ingredients}
                    onChange={(e) => setNewItem({...newItem, ingredients: e.target.value})}
                  />
                  <input
                    type="text"
                    placeholder="Sides (comma-separated)"
                    value={newItem.sides}
                    onChange={(e) => setNewItem({...newItem, sides: e.target.value})}
                  />
                  <button type="submit" className="submit-btn">Add Item</button>
                </form>
              </div>
            )}

            {/* Category Tabs */}
            <div className="category-tabs">
              {categories.map(cat => (
                <button
                  key={cat.key}
                  className={`category-tab ${selectedCategory === cat.key ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat.key)}
                >
                  {cat.icon} {cat.label}
                </button>
              ))}
            </div>

            {/* Menu Items List */}
            <div className="menu-items-list">
              {menuData[selectedCategory]?.map(item => (
                <div key={item.id} className="menu-item-row">
                  <div className="item-info">
                    <span className="item-name">{item.name}</span>
                    <span className="item-price">${item.price.toFixed(2)}</span>
                    <span className="item-id">{item.id}</span>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(selectedCategory, item.id)}
                    className="remove-btn"
                  >
                    🗑️ Remove
                  </button>
                </div>
              ))}
              {menuData[selectedCategory]?.length === 0 && (
                <p className="no-items">No items in this category</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
