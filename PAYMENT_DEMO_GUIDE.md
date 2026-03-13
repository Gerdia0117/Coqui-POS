# 💳 Payment & Sales Demo Guide

## 🎯 Goal
Show your teacher that payments are recorded and visible in Sales Dashboard.

---

## ✅ Step-by-Step Demo Setup

### 1️⃣ Start Your System (BOTH servers must be running!)

**Option A: One-Click (Recommended)**
```bash
# Click Coqui POS icon from applications menu
# OR run:
bash ~/start-coqui-pos.sh
```

**Option B: Manual**

**Terminal 1 - Backend (MUST BE RUNNING!):**
```bash
cd /home/holberton/Coqui-POS/backend
source venv/bin/activate
python app.py
```
You should see:
```
🐸 Coqui POS Backend Starting...
📊 API available at: http://localhost:5000
✅ Ready to accept orders!
 * Running on http://0.0.0.0:5000
```

**Terminal 2 - Frontend:**
```bash
cd /home/holberton/Coqui-POS/frontend
npm run dev
```
You should see:
```
VITE v7.x.x  ready in xxx ms
➜  Local:   http://localhost:5173/
```

---

### 2️⃣ Complete a Test Payment

1. **Open Browser:** `http://localhost:5173`

2. **Login as Manager** (to access Sales Dashboard later)

3. **Add items to cart:**
   - Click on any menu items
   - Add 2-3 different items

4. **Go to Payment:**
   - Click "💳 Payment" button (top right)

5. **Add Tip:** (Optional)
   - Click 15% or 20%

6. **Select Card Payment:**
   - Click "💳 Card" button
   - Click "🔄 Process Card Payment"
   - **Watch the realistic payment animation:**
     - "Connecting to terminal..."
     - "Terminal Connected"
     - "Reading card..."
     - "Card Detected"
     - "Authorizing transaction..."
     - "Contacting bank..."
     - "APPROVED" ✓

7. **Payment Complete!**
   - You'll see: "✅ Payment Completed!"
   - Order ID displayed

8. **Check Backend Terminal:**
   - You should see: `✅ Order saved to backend successfully`
   - If you see this, payment was recorded!

---

### 3️⃣ View Sales in Dashboard

1. **Click "📊 Sales" button** (top right, Manager only)

2. **Enter password:** `admin123`

3. **View Sales:**
   - **Daily Tab:** See today's sales
   - **Weekly Tab:** Choose week 1-4
   - **Monthly Tab:** See full month breakdown

4. **You should see:**
   - Total Revenue (your payment amount)
   - Number of Orders (1 or more)
   - Popular Items (what you ordered)

---

## 🐛 Troubleshooting

### Problem: Sales Dashboard shows $0.00

**Cause:** Backend wasn't running when you made payment

**Fix:**
1. Make sure BOTH servers are running
2. Make a NEW test payment
3. Check Sales Dashboard again

### Problem: "Backend not available" warning

**Check backend terminal:**
```bash
# Is it running?
# Should show: Running on http://0.0.0.0:5000
```

**Restart backend:**
```bash
cd /home/holberton/Coqui-POS/backend
source venv/bin/activate
python app.py
```

### Problem: Can't see new sales after payment

**Solution:** Click "Refresh" or switch between Daily/Weekly/Monthly tabs

---

## 📊 Where Sales Are Stored

**Files:**
```
/home/holberton/Coqui-POS/backend/database/
├── orders.json     ← All completed orders
├── sales.json      ← Sales statistics
├── tickets.json    ← Kitchen tickets
└── voids.json      ← Voided items
```

**View manually:**
```bash
# See all orders
cat ~/Coqui-POS/backend/database/orders.json

# See sales stats
cat ~/Coqui-POS/backend/database/sales.json
```

---

## 🎬 Perfect Demo Flow for Teacher

### Before Demo:
✅ Start both servers  
✅ Open browser to POS  
✅ Have password `admin123` ready  
✅ Backend terminal visible (to show API logs)

### During Demo:

**Part 1: Make Payment (2 min)**
1. "I'll demonstrate a complete payment transaction"
2. Add items: "Let me add some Puerto Rican dishes"
3. Show cart: "Here's the order with automatic tax calculation"
4. Payment modal: "Customer wants to pay by card"
5. **Card payment:** "Watch the realistic payment simulation"
   - Point out each step as it happens
   - "This mimics a real card terminal flow"
6. Completed: "Payment successful!"

**Part 2: Show Sales Recording (1 min)**
7. Point to backend terminal:
   - "Notice the API logged this order"
   - Show: `POST /api/orders - 201`
8. "This order is now in our database"

**Part 3: Sales Analytics (2 min)**
9. Click "📊 Sales" button
10. Enter password: "Manager-only access for security"
11. Show Daily tab: "Here's today's sales - the payment we just made"
12. Show Weekly tab: "We can analyze by week"
13. Show Monthly tab: "Full month breakdown"
14. Show Popular Items: "Business intelligence for inventory planning"

### Talking Points:
- "Real restaurants need payment records for tax purposes"
- "Sales analytics help managers make business decisions"
- "All transactions are logged with timestamps"
- "Role-based security protects financial data"
- "This connects to our Flask backend via REST API"

---

## 💡 Making It More Impressive

### Add Multiple Test Orders
```
Order 1: Breakfast items ($25)
Order 2: Lunch items ($45)  
Order 3: Dinner + drinks ($65)
```

Then show:
- Total daily revenue increases
- Multiple orders counted
- Different items in popular list

### Show Time Range
- Make orders on different days (change system date temporarily)
- Or explain: "In production, we'd see weekly/monthly trends"

---

## 🚨 CRITICAL CHECKLIST

Before showing to teacher:

- [ ] Backend is running (port 5000)
- [ ] Frontend is running (port 5173)
- [ ] You can login as Manager
- [ ] Password `admin123` works
- [ ] Made at least ONE test payment successfully
- [ ] Sales Dashboard shows that payment
- [ ] You know how to access each tab (Daily/Weekly/Monthly)

---

## 🔗 How It All Connects

```
User Makes Payment
      ↓
PaymentModal.jsx sends order to backend
      ↓
POST http://localhost:5000/api/orders
      ↓
Backend (app.py) receives order
      ↓
Saves to orders.json + updates sales.json
      ↓
Sales Dashboard reads from backend
      ↓
GET http://localhost:5000/api/sales/day
      ↓
Shows sales data to Manager
```

**Files Involved:**
- `frontend/src/components/PaymentModal.jsx` (lines 91-107)
- `backend/app.py` (lines 148-194)
- `backend/database/orders.json`
- `backend/database/sales.json`

---

**Ready to demo! 🐸💳**
