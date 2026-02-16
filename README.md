# 🐸 Coqui POS - Puerto Rico's Smart Restaurant System

A modern, feature-rich Point of Sale system built for Demo Day presentation.

## ✨ Features

### 🍽️ Menu Management
- 5 category navigation (Beverages, Appetizers, Salads, Main Course, Desserts)
- Detailed item information: allergens, proteins, ingredients, sides
- Professional menu cards with images and descriptions
- Easy to customize and expand

### 🛒 Order Management
- Add items to cart with quantity controls
- Real-time price calculations (subtotal, tax, total)
- Remove items or clear entire order
- Puerto Rico sales tax (11.5%) automatically calculated

### 💳 Payment System
- **Cash Payment:** Automatic change calculation
- **Card Payment:** Simulated card processing
- **Tip Options:** 0%, 10%, 15%, 20%, or custom amount
- Tips supported for both payment methods

### 🖨️ Order Management
- Print Order (kitchen ticket)
- Print Receipt (customer copy)
- Reprint Receipt functionality
- All actions accessible after payment

### 🔒 Manager Features
- Refund processing (requires manager password)
- Manager authorization system
- Role-based access control

### 📊 Backend Data Storage
- Automatic order saving to backend
- Sales statistics tracking
- Order history
- Popular items analytics

## 🚀 Quick Start

### Prerequisites
- **Frontend:** Node.js (v18+) and npm
- **Backend:** Python 3.8+

### 1️⃣ Start the Backend

```bash
# Navigate to backend
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Run the Flask server
python3 app.py
```

Backend will run on: **http://localhost:5000**

### 2️⃣ Start the Frontend

```bash
# Navigate to frontend (in a new terminal)
cd frontend

# Install dependencies (first time only)
npm install

# Run the development server
npm run dev
```

Frontend will run on: **http://localhost:5173**

## 🔐 Login Credentials

**Employee Account:**
- Role: Employee
- Password: `employee123`

**Manager Account:**
- Role: Manager  
- Password: `admin123`
- Has access to refund functionality

## 📁 Project Structure

```
Coqui-POS/
├── frontend/
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── Login.jsx       # Login screen
│   │   │   ├── Header.jsx      # Top navigation
│   │   │   ├── MenuItem.jsx    # Menu item cards
│   │   │   ├── MenuPanel.jsx   # Category navigation & items
│   │   │   ├── OrderCart.jsx   # Order summary & cart
│   │   │   ├── PaymentModal.jsx # Payment processing
│   │   │   └── POSScreen.jsx   # Main POS interface
│   │   ├── data/
│   │   │   └── menuData.js     # Menu items database
│   │   ├── styles/
│   │   │   └── main.css        # All styling
│   │   ├── assets/             # Logo images
│   │   ├── App.jsx             # App entry point
│   │   └── main.jsx            # React initialization
│   └── package.json
│
├── backend/
│   ├── app.py                  # Flask API server
│   ├── requirements.txt        # Python dependencies
│   └── database/               # JSON data storage
│       ├── orders.json         # All orders
│       └── sales.json          # Sales statistics
│
└── README.md
```

## 🎨 Customization Guide

### Add Menu Items
Edit `frontend/src/data/menuData.js` - each category is clearly commented

### Change Styling
Edit `frontend/src/styles/main.css` - sections are organized with comments

### Modify Tax Rate
Edit `frontend/src/components/POSScreen.jsx` line 102 (currently 11.5%)

### Change Passwords
- Login: `frontend/src/components/Login.jsx` lines 10-13
- Refund: `frontend/src/components/PaymentModal.jsx` line 137

## 🌐 API Endpoints

The backend provides these endpoints:

- `POST /api/orders` - Create new order
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get specific order
- `GET /api/sales/stats` - Get sales statistics
- `GET /api/sales/today` - Get today's sales
- `POST /api/orders/:id/refund` - Process refund
- `GET /api/analytics/popular-items` - Get popular menu items

## 💡 Demo Day Tips

1. **Before Presenting:**
   - Start both backend and frontend
   - Test a complete order flow
   - Have sample menu item ready to add
   - Clear any test orders if needed

2. **During Demo:**
   - Show login (employee vs manager)
   - Browse different categories
   - Add multiple items to cart
   - Demonstrate quantity adjustments
   - Show tip calculation
   - Complete a payment (cash with change calculation)
   - Show all print buttons
   - Demo refund (as manager)

3. **Talking Points:**
   - Puerto Rican menu focus
   - Allergen & dietary information
   - Manager authorization system
   - Real-time calculations
   - Organized data storage

## 🔧 Technical Stack

**Frontend:**
- React 18
- Vite (build tool)
- Modern CSS (no frameworks)

**Backend:**
- Python Flask
- JSON file storage (demo)
- RESTful API design

## 📝 Future Enhancements

- Real database (PostgreSQL/MySQL)
- Actual payment gateway integration
- Printer integration
- Table management
- Inventory tracking
- Employee time tracking
- Advanced reporting dashboard
- Mobile responsive design

## 👨‍💻 Development

Built for Holberton School Demo Day

## 📄 License

MIT License - Feel free to use for your own projects!

---

**Note:** Backend is optional for demo. Frontend will work without it, but orders won't be saved.