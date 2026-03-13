# 🐸 Coqui POS - Puerto Rican Restaurant Point of Sale System

A full-stack Point of Sale system for restaurants featuring order management, kitchen operations, payment processing, and business analytics with role-based access control.

## ✨ Features

### 🍽️ Menu Management
- 6 categories: Beverages, Appetizers, Salads, Main Course, Sides, Desserts
- Detailed item information: allergens, proteins, ingredients, sides
- Professional menu cards with Puerto Rican cuisine
- **NEW:** Manager can add/remove menu items with password protection
- Dynamic menu updates with localStorage persistence

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

### 🔒 Manager Features (Password: `admin123`)
- **Sales Dashboard:** View daily, weekly, and monthly sales reports
- **Week-by-Week Analysis:** Select Week 1, 2, 3, or 4 of current month
- **Popular Items Analytics:** See top-selling menu items
- **Refund Processing:** Process refunds with manager authorization
- **Kitchen Tickets:** Void individual items or entire tickets
- **Void Log:** Track all voided items with accountability
- **Menu Manager:** Add/remove menu items dynamically
- **Role-based Access Control:** Manager-only features protected by password

### 🎫 Kitchen Ticket System
- Send orders to kitchen with timestamps
- Real-time timer tracking (color-coded urgency)
- Open/Closed ticket workflow
- Manager can void items or entire tickets
- Full accountability trail with timestamps

### 📊 Backend Data Storage
- Automatic order saving to JSON files
- Sales statistics tracking by day/week/month
- Kitchen ticket management
- Void log for accountability
- Order history with full details

## 🚀 Quick Start

### Prerequisites
- **Frontend:** Node.js (v18+) and npm
- **Backend:** Python 3.8+ with Flask
- **Browser:** Chrome, Firefox, or any modern browser

### Option 1: One-Click Launch (Recommended)

Double-click the **Coqui POS** icon from your applications menu. This will:
1. Start both backend and frontend servers
2. Open your browser automatically
3. Display server logs in a terminal

**Files involved:**
- Desktop launcher: `~/.local/share/applications/coqui-pos.desktop`
- Start script: `~/start-coqui-pos.sh`
- Stop script: `~/stop-coqui-pos.sh`

### Option 2: Manual Start

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate
python app.py
```
Backend runs on: **http://localhost:5000**

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend runs on: **http://localhost:5173**

**Browser:**
Navigate to `http://localhost:5173`

## 🔐 Access Control

### User Roles
**Employee:**
- Take orders and process payments
- Send orders to kitchen
- View kitchen tickets

**Manager:**
- Everything Employee can do, PLUS:
- View sales dashboard (`admin123`)
- Process refunds (`admin123`)
- Void tickets/items (`admin123`)
- Access void log
- Manage menu items (`admin123`)

### Passwords
- **All Manager Functions:** `admin123`
- Login: No password (simplified for demo)

## 📁 Project Structure

```
Coqui-POS/
├── backend/
│   ├── app.py                  # Flask API server (770 lines, 15+ endpoints)
│   ├── venv/                   # Python virtual environment
│   ├── requirements.txt        # Python dependencies
│   └── database/               # Data storage (JSON files)
│       ├── orders.json         # Order history
│       ├── sales.json          # Sales statistics
│       ├── tickets.json        # Kitchen tickets
│       └── voids.json          # Void log
│
├── frontend/
│   ├── src/
│   │   ├── components/         # React components (12 files)
│   │   │   ├── Login.jsx       # User role selection
│   │   │   ├── Header.jsx      # Navigation bar
│   │   │   ├── POSScreen.jsx   # Main container
│   │   │   ├── MenuPanel.jsx   # Menu display
│   │   │   ├── MenuItem.jsx    # Menu item card
│   │   │   ├── OrderCart.jsx   # Shopping cart
│   │   │   ├── PaymentModal.jsx # Payment processing
│   │   │   ├── SalesDashboard.jsx # Analytics (Manager)
│   │   │   ├── KitchenTickets.jsx # Kitchen operations
│   │   │   ├── VoidLog.jsx     # Void history (Manager)
│   │   │   ├── MenuManager.jsx # Menu management (NEW!)
│   │   │   └── AIAssistant.jsx # AI helper
│   │   ├── data/
│   │   │   └── menuData.js     # Menu items (6 categories)
│   │   ├── styles/
│   │   │   └── main.css        # All styling (2400+ lines)
│   │   ├── assets/
│   │   │   ├── coqui-logo-light.png
│   │   │   └── coqui-logo-dark.png
│   │   ├── App.jsx             # Root component
│   │   └── main.jsx            # React entry
│   ├── index.html              # HTML template
│   ├── package.json            # Dependencies
│   └── vite.config.js          # Vite configuration
│
├── coqui-icon.png              # Application icon
├── Coqui-EZ_start.md           # Launcher documentation
└── README.md                   # This file
```

## 🎨 Customization

### Add/Remove Menu Items
- **Via UI:** Use Menu Manager (Manager only, password: `admin123`)
- **Via Code:** Edit `frontend/src/data/menuData.js`

### Change Styling
Edit `frontend/src/styles/main.css` (2400+ lines, well-organized)

### Modify Tax Rate
`frontend/src/components/POSScreen.jsx` line 197 (currently 11.5% PR tax)

### Change Manager Password
All manager functions use: `admin123`
- Menu Manager: `MenuManager.jsx` line 10
- Sales Dashboard: `SalesDashboard.jsx` line 30
- Refunds: `PaymentModal.jsx` line 164
- Voids: Backend `app.py` lines 635, 689

## 🌐 API Endpoints

**Orders:**
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get all orders
- `POST /api/orders/:id/refund` - Process refund (requires `admin123`)

**Sales & Analytics:**
- `GET /api/sales/stats` - Overall sales statistics
- `GET /api/sales/day?day=15` - Daily sales for specific day
- `GET /api/sales/week?week=2` - Weekly sales (week 1-4 of month)
- `GET /api/sales/month?month=2` - Monthly sales with weekly breakdown
- `GET /api/analytics/popular-items` - Top 10 menu items

**Kitchen Tickets:**
- `POST /api/tickets` - Create kitchen ticket
- `GET /api/tickets` - Get all tickets (filter by status)
- `GET /api/tickets/:id` - Get specific ticket
- `PATCH /api/tickets/:id/close` - Close ticket (payment completed)
- `PATCH /api/tickets/:id/void-item` - Void single item (requires `admin123`)
- `PATCH /api/tickets/:id/void` - Void entire ticket (requires `admin123`)

**Void Management:**
- `GET /api/voids` - Get void log (Manager only)

## 💡 Presentation Tips

### Before Demo:
1. Click **Coqui POS** icon to launch
2. Wait for browser to open (auto-loads)
3. Test a quick order flow
4. Have `admin123` password ready

### Demo Flow:

**1. Login & Roles** (30 sec)
- Show Employee vs Manager options
- Explain role-based access

**2. Taking Orders** (2 min)
- Browse menu categories
- Add items (show allergen info)
- Adjust quantities
- Show tax calculation (11.5% PR)

**3. Payment** (1 min)
- Add tip (10%, 15%, 20%, custom)
- Show cash payment with change
- Generate receipt
- Send order to kitchen

**4. Kitchen System** (1 min)
- Open Kitchen Tickets
- Show real-time timer
- Explain color coding (green/yellow/red)
- Demo void item (password: `admin123`)

**5. Manager Features** (2 min)
- Sales Dashboard (password required)
  - Show daily/weekly/monthly views
  - Popular items analytics
- Void Log accountability
- Menu Manager (add/remove items)

### Key Talking Points:
- Full-stack architecture (React + Flask)
- Role-based security
- Real-time kitchen operations
- Business analytics for decision-making
- Puerto Rican cuisine focus
- Production-ready architecture (JSON → database swap)

## 🔧 Technology Stack

**Frontend:**
- React 19 (UI framework)
- Vite (build tool - faster than Create React App)
- Vanilla CSS (2400+ lines, no frameworks)
- localStorage (menu customization)

**Backend:**
- Flask (Python web framework)
- Flask-CORS (frontend-backend communication)
- JSON files (data persistence)
- RESTful API (15+ endpoints)

**Architecture:**
- Frontend: `http://localhost:5173` (Vite dev server)
- Backend: `http://localhost:5000` (Flask server)
- Communication: `fetch()` API with CORS enabled
- Data Flow: React → Flask → JSON files

## 📈 Project Stats

- **Lines of Code:** ~4,000+ (frontend + backend)
- **Components:** 12 React components
- **API Endpoints:** 15+ RESTful routes
- **CSS:** 2,400+ lines of custom styling
- **Features:** 8 major feature sets
- **Roles:** 2 (Employee, Manager)
- **Development Time:** February 2026

## 📝 Future Enhancements

**Infrastructure:**
- PostgreSQL/MySQL database
- User authentication with JWT
- Docker containerization

**Features:**
- Payment gateway (Stripe/Square)
- Thermal printer integration
- Table/reservation management
- Inventory tracking with alerts
- Employee time clock
- Mobile responsive design
- Multi-location support

**Analytics:**
- Advanced reporting dashboard
- Sales forecasting
- Employee performance metrics

## 👨‍💻 Development

**Built by:** Gerald D. Carrasquillo  
**School:** Holberton School  
**Purpose:** Capstone Project / Demo Day Presentation  
**Date:** February 2026

### Key Learning Outcomes:
- Full-stack web development
- RESTful API design
- Role-based access control
- State management in React
- Business logic implementation
- Data persistence strategies

## 📄 License

MIT License - Free to use for educational and personal projects

## 🐛 Known Issues

- Menu changes persist in localStorage only (not in source code)
- No actual printer integration (simulated)
- Simple authentication (no password hashing)
- JSON storage (demo only, use database for production)

## 📞 Support

For questions or issues:
1. Check `Coqui-EZ_start.md` for launcher documentation
2. Review this README
3. Contact: Gerald.froz@outlook.com

---

**🐸 Built with pride for Demo Day!**
