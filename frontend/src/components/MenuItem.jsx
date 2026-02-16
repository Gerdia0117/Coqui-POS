// ============================================
// MENU ITEM COMPONENT
// ============================================
// Displays individual menu items with:
// - Image, name, price, description
// - Allergen warnings
// - Protein information
// - Ingredients list
// - Available sides
// - Add to order button

import { allergenInfo } from "../data/menuData";

export default function MenuItem({ item, onAddToOrder }) {
  
  // ============================================
  // RENDER COMPONENT
  // ============================================
  return (
    <div className="menu-item-card">
      {/* ============================================ */}
      {/* ITEM IMAGE SECTION */}
      {/* ============================================ */}
      <div className="item-image">
        <img 
          src={item.image} 
          alt={item.name}
          onError={(e) => {
            // Fallback image if item image doesn't exist
            e.target.src = "https://via.placeholder.com/200x150?text=No+Image";
          }}
        />
      </div>

      {/* ============================================ */}
      {/* ITEM DETAILS SECTION */}
      {/* ============================================ */}
      <div className="item-details">
        {/* Item Name and Price */}
        <div className="item-header">
          <h3>{item.name}</h3>
          <span className="item-price">${item.price.toFixed(2)}</span>
        </div>

        {/* Item Description */}
        <p className="item-description">{item.description}</p>

        {/* ============================================ */}
        {/* ALLERGEN WARNINGS SECTION */}
        {/* ============================================ */}
        {item.allergens && item.allergens.length > 0 && (
          <div className="allergen-section">
            <strong>⚠️ Allergens:</strong>
            <div className="allergen-tags">
              {item.allergens.map((allergen) => (
                <span key={allergen} className="allergen-tag">
                  {allergenInfo[allergen]?.icon} {allergenInfo[allergen]?.name || allergen}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ============================================ */}
        {/* PROTEIN INFORMATION SECTION */}
        {/* ============================================ */}
        {item.proteins && item.proteins.length > 0 && (
          <div className="protein-section">
            <strong>🥩 Proteins:</strong>
            <div className="protein-tags">
              {item.proteins.map((protein) => (
                <span key={protein} className="protein-tag">
                  {protein.charAt(0).toUpperCase() + protein.slice(1)}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ============================================ */}
        {/* INGREDIENTS LIST SECTION */}
        {/* ============================================ */}
        {item.ingredients && item.ingredients.length > 0 && (
          <div className="ingredients-section">
            <strong>📝 Ingredients:</strong>
            <ul className="ingredients-list">
              {item.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
          </div>
        )}

        {/* ============================================ */}
        {/* SIDES/ACCOMPANIMENTS SECTION */}
        {/* ============================================ */}
        {item.sides && item.sides.length > 0 && (
          <div className="sides-section">
            <strong>🍽️ Includes:</strong>
            <ul className="sides-list">
              {item.sides.map((side, index) => (
                <li key={index}>{side}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* ============================================ */}
      {/* ADD TO ORDER BUTTON */}
      {/* ============================================ */}
      <button 
        className="add-to-order-btn"
        onClick={() => onAddToOrder(item)}
      >
        Add to Order +
      </button>
    </div>
  );
}
