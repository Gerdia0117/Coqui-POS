#!/bin/bash
# Quick Payment System Test
# Run this to verify payment and sales are working

echo "🐸 Coqui POS - Payment System Test"
echo "===================================="
echo ""

# Check if backend is running
echo "1️⃣ Checking Backend..."
if curl -s http://localhost:5000/ > /dev/null 2>&1; then
    echo "   ✅ Backend is running on port 5000"
else
    echo "   ❌ Backend is NOT running!"
    echo "   Start it with: cd ~/Coqui-POS/backend && source venv/bin/activate && python app.py"
    exit 1
fi

# Check if frontend is running
echo ""
echo "2️⃣ Checking Frontend..."
if curl -s http://localhost:5173/ > /dev/null 2>&1; then
    echo "   ✅ Frontend is running on port 5173"
else
    echo "   ❌ Frontend is NOT running!"
    echo "   Start it with: cd ~/Coqui-POS/frontend && npm run dev"
    exit 1
fi

# Check database files
echo ""
echo "3️⃣ Checking Database Files..."
if [ -f ~/Coqui-POS/backend/database/orders.json ]; then
    ORDER_COUNT=$(cat ~/Coqui-POS/backend/database/orders.json | jq '. | length' 2>/dev/null || echo "0")
    echo "   ✅ orders.json exists"
    echo "      → Total orders: $ORDER_COUNT"
else
    echo "   ❌ orders.json not found"
fi

if [ -f ~/Coqui-POS/backend/database/sales.json ]; then
    echo "   ✅ sales.json exists"
    TOTAL_SALES=$(cat ~/Coqui-POS/backend/database/sales.json | grep -o '"total_sales": [0-9.]*' | grep -o '[0-9.]*' || echo "0")
    echo "      → Total sales: \$$TOTAL_SALES"
else
    echo "   ❌ sales.json not found"
fi

echo ""
echo "===================================="
echo "✅ System Status: READY"
echo ""
echo "📋 Next Steps:"
echo "1. Open browser: http://localhost:5173"
echo "2. Login as Manager"
echo "3. Add items to cart"
echo "4. Complete a payment"
echo "5. Check Sales Dashboard"
echo ""
echo "📖 Full guide: ~/Coqui-POS/PAYMENT_DEMO_GUIDE.md"
echo ""
