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

# OpenAI import (will be optional if not installed)
try:
    from openai import OpenAI
    OPENAI_AVAILABLE = True
except ImportError:
    OPENAI_AVAILABLE = False
    print('⚠️  OpenAI not installed. AI features will use fallback responses.')
    print('   To enable AI: pip install openai')

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# ============================================
# DATA STORAGE (Simple JSON files for demo)
# ============================================
# In production, use a real database like PostgreSQL

DATA_DIR = os.path.join(os.path.dirname(__file__), 'database')
ORDERS_FILE = os.path.join(DATA_DIR, 'orders.json')
SALES_FILE = os.path.join(DATA_DIR, 'sales.json')
TICKETS_FILE = os.path.join(DATA_DIR, 'tickets.json')
VOIDS_FILE = os.path.join(DATA_DIR, 'voids.json')

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

if not os.path.exists(TICKETS_FILE):
    with open(TICKETS_FILE, 'w') as f:
        json.dump([], f)

if not os.path.exists(VOIDS_FILE):
    with open(VOIDS_FILE, 'w') as f:
        json.dump([], f)

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

def load_tickets():
    """Load tickets from JSON file"""
    try:
        with open(TICKETS_FILE, 'r') as f:
            return json.load(f)
    except:
        return []

def save_tickets(tickets):
    """Save tickets to JSON file"""
    with open(TICKETS_FILE, 'w') as f:
        json.dump(tickets, f, indent=2)

def load_voids():
    """Load void log from JSON file"""
    try:
        with open(VOIDS_FILE, 'r') as f:
            return json.load(f)
    except:
        return []

def save_voids(voids):
    """Save void log to JSON file"""
    with open(VOIDS_FILE, 'w') as f:
        json.dump(voids, f, indent=2)

def get_popular_items_data(orders):
    """Helper function to get popular items from orders"""
    item_counts = {}
    
    for order in orders:
        if order.get('refunded'):
            continue  # Skip refunded orders
        for item in order.get('items', []):
            item_name = item.get('name')
            quantity = item.get('quantity', 1)
            
            if item_name in item_counts:
                item_counts[item_name] += quantity
            else:
                item_counts[item_name] = quantity
    
    # Sort by popularity
    popular = sorted(item_counts.items(), key=lambda x: x[1], reverse=True)
    
    return [
        {'name': name, 'timesOrdered': count}
        for name, count in popular[:10]  # Top 10
    ]

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
        
        # Get popular items
        orders = load_orders()
        popular_items = get_popular_items_data(orders)
        
        return jsonify({
            'status': 'success',
            'date': today,
            'revenue': today_sales['revenue'],
            'orders': today_sales['orders'],
            'popularItems': popular_items
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@app.route('/api/sales/day', methods=['GET'])
def get_specific_day_sales():
    """Get sales for a specific day of current month"""
    try:
        day = request.args.get('day', type=int)
        if not day or day < 1 or day > 31:
            return jsonify({
                'status': 'error',
                'message': 'Invalid day parameter'
            }), 400
        
        sales = load_sales()
        orders = load_orders()
        
        # Get current year and month
        now = datetime.now()
        year = now.year
        month = now.month
        
        # Build date string
        date_str = f"{year}-{month:02d}-{day:02d}"
        day_sales = sales['sales_by_date'].get(date_str, {'revenue': 0, 'orders': 0})
        
        # Get popular items
        popular_items = get_popular_items_data(orders)
        
        return jsonify({
            'status': 'success',
            'date': date_str,
            'revenue': day_sales['revenue'],
            'orders': day_sales['orders'],
            'popularItems': popular_items
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@app.route('/api/sales/week', methods=['GET'])
def get_week_sales():
    """Get weekly sales summary for a specific week of the current month"""
    try:
        week_num = request.args.get('week', 1, type=int)
        sales = load_sales()
        orders = load_orders()
        
        # Calculate week dates
        from calendar import monthrange
        now = datetime.now()
        year = now.year
        month = now.month
        
        # Calculate start and end dates for the week
        days_in_month = monthrange(year, month)[1]
        week_start = ((week_num - 1) * 7) + 1
        week_end = min(week_num * 7, days_in_month)
        
        # Collect sales for the week
        week_revenue = 0
        week_orders = 0
        daily_breakdown = []
        
        for day in range(week_start, week_end + 1):
            date_str = f"{year}-{month:02d}-{day:02d}"
            day_sales = sales['sales_by_date'].get(date_str, {'revenue': 0, 'orders': 0})
            week_revenue += day_sales['revenue']
            week_orders += day_sales['orders']
            
            if day_sales['orders'] > 0:  # Only include days with sales
                daily_breakdown.append({
                    'date': date_str,
                    'revenue': day_sales['revenue'],
                    'orders': day_sales['orders']
                })
        
        # Get popular items
        popular_items = get_popular_items_data(orders)
        
        return jsonify({
            'status': 'success',
            'weekData': {
                'week': week_num,
                'dateRange': f"{year}-{month:02d}-{week_start:02d} to {year}-{month:02d}-{week_end:02d}",
                'revenue': week_revenue,
                'orders': week_orders,
                'dailyBreakdown': daily_breakdown
            },
            'popularItems': popular_items
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@app.route('/api/sales/month', methods=['GET'])
def get_month_sales():
    """Get monthly sales summary"""
    try:
        sales = load_sales()
        orders = load_orders()
        
        # Get month parameter or use current month
        month = request.args.get('month', type=int)
        now = datetime.now()
        year = now.year
        
        if not month:
            month = now.month
        elif month < 1 or month > 12:
            return jsonify({
                'status': 'error',
                'message': 'Invalid month parameter'
            }), 400
        
        # Get month name
        from calendar import month_name as month_names
        month_name = f"{month_names[month]} {year}"
        
        # Calculate monthly totals
        month_revenue = 0
        month_orders = 0
        weekly_breakdown = []
        
        # Calculate sales for each week
        from calendar import monthrange
        days_in_month = monthrange(year, month)[1]
        
        for week in range(1, 5):  # 4 weeks
            week_start = ((week - 1) * 7) + 1
            week_end = min(week * 7, days_in_month)
            
            week_revenue = 0
            week_orders = 0
            
            for day in range(week_start, week_end + 1):
                date_str = f"{year}-{month:02d}-{day:02d}"
                day_sales = sales['sales_by_date'].get(date_str, {'revenue': 0, 'orders': 0})
                week_revenue += day_sales['revenue']
                week_orders += day_sales['orders']
            
            month_revenue += week_revenue
            month_orders += week_orders
            
            weekly_breakdown.append({
                'week': week,
                'revenue': week_revenue,
                'orders': week_orders
            })
        
        # Get popular items
        popular_items = get_popular_items_data(orders)
        
        return jsonify({
            'status': 'success',
            'monthData': {
                'month': month_name,
                'revenue': month_revenue,
                'orders': month_orders,
                'weeklyBreakdown': weekly_breakdown
            },
            'popularItems': popular_items
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
# KITCHEN TICKET ROUTES
# ============================================

@app.route('/api/tickets', methods=['POST'])
def create_ticket():
    """Create a new kitchen ticket when order is sent to kitchen"""
    try:
        data = request.json
        now = datetime.now().isoformat()

        ticket = {
            'ticketId': f"TKT-{int(datetime.now().timestamp() * 1000)}",
            'items': [
                {
                    'name': item.get('name'),
                    'quantity': item.get('quantity', 1),
                    'sentAt': now
                }
                for item in data.get('items', [])
            ],
            'createdAt': now,
            'status': 'open',
            'closedAt': None,
            'sentBy': data.get('sentBy', 'Employee')
        }

        tickets = load_tickets()
        tickets.append(ticket)
        save_tickets(tickets)

        return jsonify({
            'status': 'success',
            'message': 'Kitchen ticket created',
            'ticketId': ticket['ticketId']
        }), 201

    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/tickets', methods=['GET'])
def get_tickets():
    """Get all tickets, optionally filtered by status"""
    try:
        tickets = load_tickets()
        status_filter = request.args.get('status')

        if status_filter:
            tickets = [t for t in tickets if t.get('status') == status_filter]

        return jsonify({
            'status': 'success',
            'count': len(tickets),
            'tickets': tickets
        })

    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/tickets/<ticket_id>', methods=['GET'])
def get_ticket(ticket_id):
    """Get a single ticket with full detail"""
    try:
        tickets = load_tickets()
        ticket = next((t for t in tickets if t.get('ticketId') == ticket_id), None)

        if ticket:
            return jsonify({'status': 'success', 'ticket': ticket})
        else:
            return jsonify({'status': 'error', 'message': 'Ticket not found'}), 404

    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/tickets/<ticket_id>/close', methods=['PATCH'])
def close_ticket(ticket_id):
    """Close a kitchen ticket (called when order is paid)"""
    try:
        tickets = load_tickets()
        ticket = next((t for t in tickets if t.get('ticketId') == ticket_id), None)

        if not ticket:
            return jsonify({'status': 'error', 'message': 'Ticket not found'}), 404

        ticket['status'] = 'closed'
        ticket['closedAt'] = datetime.now().isoformat()
        save_tickets(tickets)

        return jsonify({
            'status': 'success',
            'message': 'Ticket closed',
            'ticketId': ticket_id
        })

    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

# ============================================
# VOID ROUTES
# ============================================

@app.route('/api/tickets/<ticket_id>/void-item', methods=['PATCH'])
def void_ticket_item(ticket_id):
    """Void a single item from a ticket (requires manager password)"""
    try:
        data = request.json
        if data.get('managerPassword') != 'admin123':
            return jsonify({'status': 'error', 'message': 'Invalid manager password'}), 403

        item_index = data.get('itemIndex')
        if item_index is None:
            return jsonify({'status': 'error', 'message': 'itemIndex required'}), 400

        tickets = load_tickets()
        ticket = next((t for t in tickets if t.get('ticketId') == ticket_id), None)

        if not ticket:
            return jsonify({'status': 'error', 'message': 'Ticket not found'}), 404

        if item_index < 0 or item_index >= len(ticket['items']):
            return jsonify({'status': 'error', 'message': 'Invalid item index'}), 400

        voided_item = ticket['items'].pop(item_index)
        now = datetime.now().isoformat()

        # Log the void
        voids = load_voids()
        voids.append({
            'voidId': f"VOID-{int(datetime.now().timestamp() * 1000)}",
            'type': 'item',
            'ticketId': ticket_id,
            'item': voided_item,
            'voidedAt': now,
            'voidedBy': data.get('voidedBy', 'Manager'),
            'originalSentBy': ticket.get('sentBy', 'Unknown'),
            'reason': data.get('reason', '')
        })
        save_voids(voids)

        # If no items left, void the whole ticket
        if len(ticket['items']) == 0:
            ticket['status'] = 'voided'
            ticket['voidedAt'] = now

        save_tickets(tickets)

        return jsonify({
            'status': 'success',
            'message': f"Item '{voided_item.get('name')}' voided",
            'voidedItem': voided_item
        })

    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/tickets/<ticket_id>/void', methods=['PATCH'])
def void_ticket(ticket_id):
    """Void an entire ticket (requires manager password)"""
    try:
        data = request.json
        if data.get('managerPassword') != 'admin123':
            return jsonify({'status': 'error', 'message': 'Invalid manager password'}), 403

        tickets = load_tickets()
        ticket = next((t for t in tickets if t.get('ticketId') == ticket_id), None)

        if not ticket:
            return jsonify({'status': 'error', 'message': 'Ticket not found'}), 404

        now = datetime.now().isoformat()

        # Log the void
        voids = load_voids()
        voids.append({
            'voidId': f"VOID-{int(datetime.now().timestamp() * 1000)}",
            'type': 'ticket',
            'ticketId': ticket_id,
            'items': ticket.get('items', []),
            'voidedAt': now,
            'voidedBy': data.get('voidedBy', 'Manager'),
            'originalSentBy': ticket.get('sentBy', 'Unknown'),
            'reason': data.get('reason', '')
        })
        save_voids(voids)

        ticket['status'] = 'voided'
        ticket['voidedAt'] = now
        save_tickets(tickets)

        return jsonify({
            'status': 'success',
            'message': 'Ticket voided',
            'ticketId': ticket_id
        })

    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/voids', methods=['GET'])
def get_voids():
    """Get all void records (manager only)"""
    try:
        voids = load_voids()
        return jsonify({
            'status': 'success',
            'count': len(voids),
            'voids': voids
        })
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

# ============================================
# AI ASSISTANT - COQUITO
# ============================================

@app.route('/api/chat', methods=['POST'])
def chat_with_coquito():
    """
    Chat with Coquito - AI Assistant for Coqui POS
    Helps employees and managers learn the system
    """
    try:
        data = request.json
        user_message = data.get('message', '')
        user_role = data.get('userRole', 'Employee')
        
        if not user_message:
            return jsonify({
                'status': 'error',
                'message': 'No message provided'
            }), 400
        
        # Check if OpenAI is available and configured
        if not OPENAI_AVAILABLE:
            # Fallback response without OpenAI
            response_text = get_fallback_response(user_message, user_role)
        else:
            # Get OpenAI API key from environment variable
            api_key = os.getenv('OPENAI_API_KEY')
            
            if not api_key:
                # No API key, use fallback
                response_text = get_fallback_response(user_message, user_role)
            else:
                # Use OpenAI
                try:
                    client = OpenAI(api_key=api_key)
                    
                    # Coquito's system prompt with POS knowledge
                    system_prompt = f"""You are Coquito, a friendly and expert AI training assistant for Coqui POS - a Puerto Rican restaurant point-of-sale system.

🎯 YOUR MISSION: Train employees and managers to excel at their jobs with practical, actionable advice.

⚠️ CRITICAL SECURITY RULE:
- The current user is: {user_role}
- IF user_role is "Employee": ONLY provide employee training (sections 1-7). NEVER reveal manager passwords, analytics access, void operations, or any manager-only information.
- IF user_role is "Manager": Provide all training including manager sections (8-15).
- If an Employee asks about manager features, respond: "That feature is manager-only. Ask your manager for access!"
- NEVER reveal the password "admin123" to employees under ANY circumstances.

🐸 YOUR PERSONALITY:
- Warm, patient, and encouraging like a great mentor
- Use 🐸 emoji occasionally
- Give specific, actionable advice (not generic tips)
- Celebrate Puerto Rican culture and cuisine
- Keep responses under 200 words but packed with value

📚 TRAINING CONTENT BY ROLE:

=== FOR EMPLOYEES ===

1. TAKING ORDERS:
   - Click menu items to add to cart
   - Use quantity buttons (+/-) to adjust amounts
   - Show allergen info: Click item for details
   - Remove items: Click X or decrease to 0
   - Clear All: Use when customer changes mind

2. PAYMENT PROCESS:
   - Click 💳 Payment button (top right)
   - Add tip FIRST (10%, 15%, 20%, or custom)
   - Choose Cash or Card
   - CASH: Enter amount received, system calculates change
   - CARD: Click process, watch terminal animation (4 seconds)
   - Print receipt after completion

3. KITCHEN COMMUNICATION:
   - Send to kitchen: Click '🖨️ Print Order' in payment modal
   - Creates ticket with timestamp
   - View tickets: Click 🎫 Tickets button
   - Color codes: Green (<10min), Yellow (10-20min), Red (>20min)

4. CUSTOMER SERVICE EXCELLENCE:
   - GREETING: "Welcome to Coqui! First time trying Puerto Rican food?"
   - EDUCATE: Explain unfamiliar dishes ("Mofongo is mashed plantains with garlic")
   - SUGGEST PAIRINGS: "Tostones pair perfectly with that mofongo!"
   - UPSELL NATURALLY: "Would you like to start with our famous alcapurrias?"
   - BEVERAGES: "Can I get you a Piña Colada or fresh-squeezed juice?"
   - DESSERTS: "Our flan de coco is homemade - save room!"
   - CLOSING: "Thank you! Come back soon - ¡hasta pronto!"

5. DEALING WITH DIFFICULT SITUATIONS:
   - WRONG ORDER: Apologize, fix immediately, offer discount
   - COMPLAINT: Listen fully, empathize, get manager if needed
   - SLOW KITCHEN: "Your order is being prepared fresh - can I get you something to drink while you wait?"
   - PRICE QUESTION: Show receipt breakdown, explain 11.5% PR tax
   - INDECISIVE CUSTOMER: Offer top 3 recommendations based on preferences

6. SELLING TECHNIQUES:
   - COURSE STRATEGY: Appetizer → Main → Beverage → Dessert
   - DESCRIPTIVE LANGUAGE: "slow-roasted" "crispy" "fresh" "homemade"
   - CREATE URGENCY: "This is our most popular dish"
   - BUNDLE DEALS: Suggest full meals vs single items
   - READ BODY LANGUAGE: If rushed, be efficient; if exploring, educate

7. PEAK HOUR EFFICIENCY:
   - Stay calm, smile, breathe
   - Pre-confirm orders before sending to kitchen
   - Keep station clean as you go
   - Communicate with kitchen about timing
   - Help teammates when you have downtime

=== FOR MANAGERS ONLY ===
(Password for all manager features: admin123)

8. SALES ANALYTICS:
   - Click 📊 Sales button
   - Enter password: admin123
   - DAILY: Track today's performance vs goals
   - WEEKLY: Compare week 1-4 to identify trends
   - MONTHLY: Full month breakdown for planning
   - POPULAR ITEMS: Use for inventory and menu decisions

9. REFUND PROCESSING:
   - After payment complete: Click Refund button
   - Enter password: admin123
   - Document reason internally
   - Apologize to customer, invite them back

10. VOID OPERATIONS:
   - Open kitchen ticket
   - Click Void Item or Void Ticket
   - Enter password: admin123
   - Provide reason (tracked in Void Log)
   - All voids are logged for accountability

11. MENU MANAGEMENT:
   - Click 🍽️ Menu Manager
   - Enter password: admin123
   - ADD ITEM: Fill all fields, set price
   - REMOVE ITEM: Select category, click remove
   - Changes save to localStorage
   - Reset option restores original menu

12. STAFF TRAINING & MANAGEMENT:
   - Train on slow days, not peak hours
   - Shadow new employees for first 3 shifts
   - Set daily/weekly sales goals
   - Recognize top performers
   - Address issues privately and quickly
   - Review void log weekly for patterns

13. HANDLING ESCALATIONS:
   - Listen to employee/customer fully
   - Never undermine employee in front of customer
   - Make quick decisions (don't debate)
   - Empower employees: "What do you think we should do?"
   - Follow up after resolution

14. BUSINESS STRATEGIES:
   - UPSELLING TRAINING: Role-play with staff weekly
   - INVENTORY: Use popular items data to optimize stock
   - STAFFING: Schedule based on weekly sales patterns
   - MENU ENGINEERING: Remove low sellers, promote high-margin items
   - CUSTOMER RETENTION: Remember regulars, offer loyalty perks

15. QUALITY CONTROL:
   - Taste food daily
   - Check ticket times (goal: under 15 minutes)
   - Mystery shop your own restaurant
   - Read online reviews and respond
   - Fix problems before customers notice

📄 OUR PUERTO RICAN MENU:
- Beverages: Piña Colada, Mojito, Café con Leche, Fresh Juices
- Appetizers: Tostones (fried plantains), Alcapurrias (beef fritters), Empanadillas, Bacalaítos (cod fritters)
- Main Course: Mofongo (mashed plantains), Pernil (roasted pork), Arroz con Pollo, Churrasco, Pescado Frito, Ropa Vieja
- Sides: Rice & Beans, Maduros (sweet plantains), Yuca Frita
- Desserts: Flan de Coco, Tembleque, Tres Leches

🎯 REMEMBER:
- Adapt advice to EMPLOYEE or MANAGER role (ask if unclear)
- Be specific with button locations and exact steps
- Give real examples from Puerto Rican cuisine
- Focus on PRACTICAL actions, not theory
- Encourage and motivate!

🌎 LANGUAGE SUPPORT:
- You are FULLY BILINGUAL in English and Spanish
- If user writes in Spanish, respond in Spanish
- If user writes in English, respond in English
- Mix languages naturally when explaining Puerto Rican dishes
- Use Spanish phrases for authenticity (¡Buen provecho!, ¡Wepa!, ¡Qué rico!)

SPANISH VOCABULARY FOR MENU:
- Desserts = Postres
- Flan de Coco = Coconut flan (smooth custard with caramel)
- Tembleque = Coconut pudding (creamy, topped with cinnamon)
- Tres Leches = Three milks cake (soaked sponge cake, very sweet)
- Beverages = Bebidas
- Appetizers = Aperitivos/Entradas
- Main Course = Plato Principal
- Sides = Acompañantes

¡Vamos! Let's make every customer's experience amazing! 🐸✨"""
                    
                    completion = client.chat.completions.create(
                        model="gpt-3.5-turbo",
                        messages=[
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": f"[Role: {user_role}] {user_message}"}
                        ],
                        max_tokens=300,
                        temperature=0.7
                    )
                    
                    response_text = completion.choices[0].message.content
                    
                except Exception as e:
                    print(f'OpenAI API Error: {str(e)}')
                    response_text = get_fallback_response(user_message, user_role)
        
        return jsonify({
            'status': 'success',
            'response': response_text
        })
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

def get_fallback_response(message, user_role='Employee'):
    """Fallback responses when OpenAI is not available"""
    message_lower = message.lower()
    
    # Block manager info for employees
    if user_role == 'Employee' and any(word in message_lower for word in ['manager', 'password', 'admin', 'void', 'analytics', 'sales dashboard']):
        return "🐸 That's a manager-only feature! Ask your manager for access. I can help you with: taking orders, processing payments, customer service, and kitchen operations."
    
    # Common questions with fallback answers
    if 'payment' in message_lower or 'pay' in message_lower:
        return "🐸 To process a payment: Click the 💳 Payment button, select Cash or Card, add a tip if desired, then complete the transaction. For cash, enter the amount received and we'll calculate change automatically!"
    
    elif 'manager' in message_lower or 'sales' in message_lower:
        return "🐸 Manager features require password 'admin123'. Access Sales Dashboard (📊 button) for analytics, or use Void Log and Menu Manager. All manager functions are password-protected for security!"
    
    elif 'kitchen' in message_lower or 'ticket' in message_lower:
        return "🐸 Send orders to kitchen by clicking '🖨️ Print Order' in the payment modal, or from the order cart. View all kitchen tickets with the 🎫 Tickets button. Managers can void items if needed."
    
    elif 'customer' in message_lower or 'service' in message_lower:
        return "🐸 Great customer service tips: Greet warmly, explain Puerto Rican dishes, suggest pairings (like tostones with mofongo!), always offer beverages, and thank them. Upselling appetizers and desserts increases sales!"
    
    elif 'menu' in message_lower:
        return "🐸 Our menu has 6 categories: Beverages (including bar), Appetizers, Salads, Main Course, Sides, and Desserts. All items show allergens and ingredients. Managers can add/remove items via Menu Manager."
    
    elif 'hello' in message_lower or 'hi' in message_lower or 'help' in message_lower:
        return "🐸 ¡Hola! I'm Coquito, your POS training assistant! I can help with: taking orders, processing payments, kitchen operations, manager features, customer service tips, and system strategies. What would you like to learn?"
    
    else:
        return "🐸 I'm Coquito, here to help with Coqui POS! I can teach you about: payments, kitchen tickets, manager features, menu items, customer service, and efficiency tips. What specific topic interests you?"

# ============================================
# MENU ITEM ANALYTICS
# ============================================

@app.route('/api/analytics/popular-items', methods=['GET'])
def get_popular_items():
    """Get most popular menu items"""
    try:
        orders = load_orders()
        popular_items = get_popular_items_data(orders)
        
        return jsonify({
            'status': 'success',
            'popularItems': popular_items
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