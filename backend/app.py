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
                    'id': item.get('id'),  # Save ID so we can look up price later
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
        
        # Use Coquito's intelligent fallback response system
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
    if user_role == 'Employee' and any(word in message_lower for word in ['password', 'admin', 'void log', 'analytics']):
        return "🐸 That's a manager-only feature! Ask your manager for access. I can help you with: taking orders, processing payments, customer service, and kitchen operations."
    
    # Rude customer scenarios
    if any(word in message_lower for word in ['rude', 'angry', 'yelling', 'upset', 'mean']):
        return "🐸 If a customer is rude: 1) Stay calm and professional - don't take it personally. 2) Listen actively and empathize. 3) Apologize sincerely even if it's not your fault. 4) Offer a solution (remake, discount, manager). 5) If they escalate, get your manager immediately. Never argue back!"
    
    # Mistakes
    if any(word in message_lower for word in ['mistake', 'error', 'wrong order', 'messed up']):
        return "🐸 When you make a mistake: 1) Admit it immediately to the customer and manager. 2) Apologize sincerely. 3) Fix it fast - remake the order or offer a discount. 4) Learn from it. Never blame others or make excuses. Everyone makes mistakes - how you handle them matters!"
    
    # Discounts for friends
    if 'discount' in message_lower and ('friend' in message_lower or 'family' in message_lower):
        return "🐸 NO! Unauthorized discounts = theft. You can be fired for giving friends/family free or discounted food without manager approval. If they visit, they pay full price or you pay for their meal yourself. No exceptions!"
    
    # Split bill
    if 'split' in message_lower and 'bill' in message_lower:
        return "🐸 To split a bill: Process as separate orders from the start, OR ring up the full order and note who ordered what, then process multiple payments. Each customer pays their portion. Make sure the totals add up!"
    
    # Phone etiquette  
    if 'phone' in message_lower or 'call' in message_lower or 'answer' in message_lower:
        return "🐸 Phone etiquette: Answer 'Thank you for calling Coqui! How can I help you?' Smile when you speak (they hear it!). Take orders carefully and repeat back. Give accurate wait times. End with 'We'll have that ready soon. See you then!'"
    
    # Cash handling
    if 'cash' in message_lower or 'change' in message_lower or 'money' in message_lower:
        return "🐸 Cash handling: Count change out loud to the customer. Never leave the register unattended. Report shortages/overages to manager immediately. No personal cash in the register. Your till must balance at end of shift."
    
    # Attendance/late
    if any(word in message_lower for word in ['late', 'sick', 'absent', 'call out', 'time off']):
        return "🐸 Attendance: Arrive 10 minutes early. If running late, call immediately. If sick, call at least 2 hours before your shift. Request time off 2 weeks in advance. No-call/no-show = grounds for termination. Always communicate!"
    
    # Break policy
    if 'break' in message_lower:
        return "🐸 Break policy: 30-minute break for 6+ hour shifts. Clock out for breaks. Eat in designated area, not at register. Return on time - set a phone alarm! No smoking in uniform where customers can see."
    
    # Payment
    if 'payment' in message_lower or 'pay' in message_lower:
        return "🐸 To process a payment: Click the 💳 Payment button (top right), add tip FIRST, then select Cash or Card. For cash: enter amount received, we calculate change. For card: click process and watch the 4-second terminal animation. Print receipt when done!"
    
    # Kitchen/tickets
    if 'kitchen' in message_lower or 'ticket' in message_lower:
        return "🐸 Kitchen orders: Click '🖨️ Send to Kitchen' from the order cart FIRST, then process payment. View all tickets with the 🎫 Tickets button. Color codes: Green (<10min), Yellow (10-20min), Red (>20min)."
    
    # Customer service
    if 'customer' in message_lower or 'service' in message_lower:
        return "🐸 Great customer service: Greet warmly, explain Puerto Rican dishes, suggest pairings (tostones with mofongo!), always offer beverages and desserts. Upselling increases your tips! Smile, be patient, thank them sincerely."
    
    # Allergies and ingredients
    if any(word in message_lower for word in ['allerg', 'gluten', 'dairy', 'nut', 'shellfish', 'ingredient']):
        return "🐸 Common allergens in our menu:\n• GLUTEN: Empanadillas, Alcapurrias (fried dough)\n• DAIRY: Flan, Tres Leches, Tembleque (coconut milk)\n• SHELLFISH: None (unless customer orders seafood)\n• NUTS: Generally none\n• SOY: Check with kitchen for specific dishes\n\nALWAYS warn kitchen about allergies! Click menu items to see full ingredient lists. When in doubt, ask the manager."
    
    # Specific menu items
    if 'mofongo' in message_lower:
        return "🐸 Mofongo: Mashed fried plantains with garlic, olive oil, and pork cracklings. Served with choice of protein (chicken, shrimp, pernil). Gluten-free! Tell customers: 'It's like garlicky mashed potatoes but made with plantains - very traditional!'"
    
    if 'tostones' in message_lower or 'tostone' in message_lower:
        return "🐸 Tostones: Twice-fried green plantains, crispy outside and soft inside. Served with garlic dipping sauce (mayo-ketchup). Gluten-free, vegetarian. Perfect appetizer or side! Tell customers: 'Think of them as Puerto Rican french fries!'"
    
    if 'pernil' in message_lower:
        return "🐸 Pernil: Slow-roasted pork shoulder marinated 24+ hours in garlic, oregano, and citrus. Super tender and flavorful. Gluten-free. Our most popular main dish! Pairs perfectly with rice & beans."
    
    if 'alcapurria' in message_lower:
        return "🐸 Alcapurrias: Fritters made from yucca/plantain dough stuffed with seasoned ground beef. Fried golden and crispy. Contains GLUTEN. Tell customers: 'It's like a Puerto Rican empanada but fried in a torpedo shape!'"
    
    if 'flan' in message_lower:
        return "🐸 Flan de Coco: Creamy coconut custard with caramel sauce. Made with eggs, coconut milk, condensed milk. Contains DAIRY and EGGS. Gluten-free. Tell customers: 'It's like crème brûlée but with coconut flavor - silky smooth!'"
    
    if 'tembleque' in message_lower:
        return "🐸 Tembleque: Coconut pudding made with coconut milk, cornstarch, and cinnamon. Dairy-free, gluten-free, vegan! Jiggly texture (that's why it's called 'tembleque' - means 'wobbly'). Light and refreshing dessert!"
    
    if 'tres leches' in message_lower or 'tres' in message_lower:
        return "🐸 Tres Leches: Ultra-moist sponge cake soaked in three types of milk (evaporated, condensed, heavy cream). Topped with whipped cream. Contains DAIRY, EGGS, GLUTEN. Very sweet! Tell customers: 'It's the moistest cake you'll ever have!'"
    
    if 'arroz con pollo' in message_lower or 'rice and chicken' in message_lower:
        return "🐸 Arroz con Pollo: Yellow rice cooked with chicken, peppers, peas, and spices. One-pot comfort food. Gluten-free. Kid-friendly! Tell customers: 'It's like a Puerto Rican paella - hearty and flavorful!'"
    
    if 'piña colada' in message_lower or 'pina colada' in message_lower:
        return "🐸 Piña Colada: Blended coconut cream, pineapple juice, and rum (optional - ask if they want virgin). Puerto Rico's national drink! Contains DAIRY (coconut cream). Refreshing and tropical!"
    
    # General menu
    if 'menu' in message_lower or 'food' in message_lower or 'dish' in message_lower:
        return "🐸 Our Puerto Rican menu:\n• Beverages: Piña Colada, Mojito, Café con Leche\n• Appetizers: Tostones, Alcapurrias, Empanadillas\n• Mains: Mofongo, Pernil, Arroz con Pollo\n• Sides: Rice & Beans, Maduros, Yuca\n• Desserts: Flan de Coco, Tembleque, Tres Leches\n\nAsk me about specific dishes for ingredients and allergens!"
    
    # Manager features (for managers)
    if user_role == 'Manager' and any(word in message_lower for word in ['manager', 'sales', 'void', 'analytics']):
        return "🐸 Manager features (password: admin123): 📊 Sales Dashboard for analytics, 🚫 Void Log for accountability, 🍽️ Menu Manager to add/remove items. All require password for security."
    
    # Conversational responses
    if any(word in message_lower for word in ['hello', 'hi', 'hey', 'hola', 'good morning', 'good afternoon', 'good evening']):
        import datetime
        hour = datetime.datetime.now().hour
        if hour < 12:
            greeting = "¡Buenos días!"
        elif hour < 18:
            greeting = "¡Buenas tardes!"
        else:
            greeting = "¡Buenas noches!"
        return f"🐸 {greeting} I'm Coquito! How can I help you today? Ask me about POS operations, customer service, work ethics, or menu items!"
    
    # Date and time
    if any(word in message_lower for word in ['date', 'today', 'day', 'time']):
        import datetime
        now = datetime.datetime.now()
        if 'time' in message_lower:
            return f"🐸 Right now it's {now.strftime('%I:%M %p')} on {now.strftime('%A, %B %d, %Y')}. What else can I help you with?"
        else:
            return f"🐸 Today is {now.strftime('%A, %B %d, %Y')}. Need help with anything else?"
    
    # Thank you
    if any(word in message_lower for word in ['thank', 'thanks', 'gracias']):
        return "🐸 ¡De nada! Happy to help! Let me know if you need anything else. ¡Buen provecho!"
    
    # How are you
    if any(phrase in message_lower for phrase in ['how are you', 'how r u', 'como estas']):
        return "🐸 I'm doing great, thanks for asking! Ready to help you succeed at Coqui POS. What would you like to know?"
    
    # Help/general
    if 'help' in message_lower and len(message_lower.split()) <= 3:
        return "🐸 I can help with: taking orders, payments, dealing with rude customers, work ethics, customer service, menu items, and more! What specific topic interests you?"
    
    # Default
    else:
        return "🐸 I can help with: taking orders, payments, rude customers, mistakes, discounts, phone calls, cash handling, breaks, customer service, and work ethics. What specific topic interests you?"

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