# ============================================
# COQUI POS - BACKEND API
# ============================================
# Flask backend to manage:
# - Orders and order history
# - Menu items
# - Sales data
# - User authentication

from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import json
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# ============================================
# DATA STORAGE (Simple JSON files for demo)
# ============================================
# In production, use a real database like PostgreSQL

DATA_DIR = os.path.join(os.path.dirname(__file__), 'database')
ORDERS_FILE = os.path.join(DATA_DIR, 'orders.json')
SALES_FILE = os.path.join(DATA_DIR, 'sales.json')

# Ensure data directory exists
if not os.path.exists(DATA_DIR):
    os.makedirs(DATA_DIR)

# Initialize files if they don't exist
if not os.path.exists(ORDERS_FILE):
    with open(ORDERS_FILE, 'w') as f:
        json.dump([], f)

if not os.path.exists(SALES_FILE):
    with open(SALES_FILE, 'w') as f:
        json.dump({'total_sales': 0, 'total_orders': 0, 'sales_by_date': {}}, f)

# ============================================
# HELPER FUNCTIONS
# ============================================

def load_orders():
    """Load orders from JSON file"""
    try:
        with open(ORDERS_FILE, 'r') as f:
            return json.load(f)
    except:
        return []

def save_orders(orders):
    """Save orders to JSON file"""
    with open(ORDERS_FILE, 'w') as f:
        json.dump(orders, f, indent=2)

def load_sales():
    """Load sales data from JSON file"""
    try:
        with open(SALES_FILE, 'r') as f:
            return json.load(f)
    except:
        return {'total_sales': 0, 'total_orders': 0, 'sales_by_date': {}}

def save_sales(sales):
    """Save sales data to JSON file"""
    with open(SALES_FILE, 'w') as f:
        json.dump(sales, f, indent=2)

# ============================================
# API ROUTES
# ============================================

@app.route('/')
def home():
    """API Home - Health Check"""
    return jsonify({
        'status': 'online',
        'message': 'Coqui POS API is running',
        'version': '1.0.0'
    })

# ============================================
# ORDER MANAGEMENT ROUTES
# ============================================

@app.route('/api/orders', methods=['POST'])
def create_order():
    """
    Create a new order
    Expected data: {
        orderId, items, subtotal, tax, tip, total,
        paymentMethod, timestamp, userRole
    }
    """
    try:
        order_data = request.json
        
        # Load existing orders
        orders = load_orders()
        
        # Add order to list
        orders.append(order_data)
        
        # Save updated orders
        save_orders(orders)
        
        # Update sales statistics
        sales = load_sales()
        sales['total_sales'] += order_data.get('total', 0)
        sales['total_orders'] += 1
        
        # Track sales by date
        date = datetime.now().strftime('%Y-%m-%d')
        if date not in sales['sales_by_date']:
            sales['sales_by_date'][date] = {'revenue': 0, 'orders': 0}
        
        sales['sales_by_date'][date]['revenue'] += order_data.get('total', 0)
        sales['sales_by_date'][date]['orders'] += 1
        
        save_sales(sales)
        
        return jsonify({
            'status': 'success',
            'message': 'Order created successfully',
            'orderId': order_data.get('orderId')
        }), 201
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@app.route('/api/orders', methods=['GET'])
def get_orders():
    """
    Get all orders
    Optional query params:
    - date: filter by date (YYYY-MM-DD)
    - limit: number of orders to return
    """
    try:
        orders = load_orders()
        
        # Filter by date if provided
        date_filter = request.args.get('date')
        if date_filter:
            orders = [o for o in orders if date_filter in o.get('timestamp', '')]
        
        # Limit results if specified
        limit = request.args.get('limit', type=int)
        if limit:
            orders = orders[-limit:]  # Get most recent orders
        
        return jsonify({
            'status': 'success',
            'count': len(orders),
            'orders': orders
        })
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@app.route('/api/orders/<order_id>', methods=['GET'])
def get_order(order_id):
    """Get a specific order by ID"""
    try:
        orders = load_orders()
        order = next((o for o in orders if o.get('orderId') == order_id), None)
        
        if order:
            return jsonify({
                'status': 'success',
                'order': order
            })
        else:
            return jsonify({
                'status': 'error',
                'message': 'Order not found'
            }), 404
            
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

# ============================================
# SALES STATISTICS ROUTES
# ============================================

@app.route('/api/sales/stats', methods=['GET'])
def get_sales_stats():
    """Get overall sales statistics"""
    try:
        sales = load_sales()
        return jsonify({
            'status': 'success',
            'stats': sales
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@app.route('/api/sales/today', methods=['GET'])
def get_today_sales():
    """Get today's sales summary"""
    try:
        sales = load_sales()
        today = datetime.now().strftime('%Y-%m-%d')
        today_sales = sales['sales_by_date'].get(today, {'revenue': 0, 'orders': 0})
        
        return jsonify({
            'status': 'success',
            'date': today,
            'revenue': today_sales['revenue'],
            'orders': today_sales['orders']
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

# ============================================
# REFUND ROUTE
# ============================================

@app.route('/api/orders/<order_id>/refund', methods=['POST'])
def refund_order(order_id):
    """Process a refund for an order (requires manager authorization)"""
    try:
        data = request.json
        manager_password = data.get('managerPassword')
        
        # Verify manager password
        if manager_password != 'admin123':
            return jsonify({
                'status': 'error',
                'message': 'Invalid manager password'
            }), 403
        
        # Load orders and find the one to refund
        orders = load_orders()
        order = next((o for o in orders if o.get('orderId') == order_id), None)
        
        if not order:
            return jsonify({
                'status': 'error',
                'message': 'Order not found'
            }), 404
        
        # Mark as refunded
        order['refunded'] = True
        order['refundedAt'] = datetime.now().isoformat()
        order['refundedBy'] = data.get('userRole', 'Manager')
        
        # Save updated orders
        save_orders(orders)
        
        # Update sales statistics
        sales = load_sales()
        sales['total_sales'] -= order.get('total', 0)
        sales['total_orders'] -= 1
        
        # Update date-specific sales
        date = order.get('timestamp', '').split(',')[0]  # Extract date from timestamp
        if date in sales['sales_by_date']:
            sales['sales_by_date'][date]['revenue'] -= order.get('total', 0)
            sales['sales_by_date'][date]['orders'] -= 1
        
        save_sales(sales)
        
        return jsonify({
            'status': 'success',
            'message': 'Order refunded successfully',
            'orderId': order_id,
            'refundAmount': order.get('total', 0)
        })
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

# ============================================
# MENU ITEM ANALYTICS
# ============================================

@app.route('/api/analytics/popular-items', methods=['GET'])
def get_popular_items():
    """Get most popular menu items"""
    try:
        orders = load_orders()
        item_counts = {}
        
        # Count how many times each item was ordered
        for order in orders:
            for item in order.get('items', []):
                item_name = item.get('name')
                quantity = item.get('quantity', 1)
                
                if item_name in item_counts:
                    item_counts[item_name] += quantity
                else:
                    item_counts[item_name] = quantity
        
        # Sort by popularity
        popular = sorted(item_counts.items(), key=lambda x: x[1], reverse=True)
        
        return jsonify({
            'status': 'success',
            'popularItems': [
                {'name': name, 'timesOrdered': count}
                for name, count in popular[:10]  # Top 10
            ]
        })
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

# ============================================
# RUN SERVER
# ============================================

if __name__ == '__main__':
    print('🐸 Coqui POS Backend Starting...')
    print('📊 API available at: http://localhost:5000')
    print('✅ Ready to accept orders!')
    app.run(debug=True, host='0.0.0.0', port=5000)