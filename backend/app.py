import sys
import os
import mysql.connector
from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
from datetime import datetime

# Add the directory of app.py to Python's search path.
sys.path.append(os.path.dirname(__file__))

# Load environment variables from the .env file.
load_dotenv()

# Initialize the Flask application.
app = Flask(__name__)

# Configure CORS (Cross-Origin Resource Sharing) for the Flask app.
# Allows frontend from http://localhost:3000 to access these API endpoints.
CORS(app, resources={r"/api/*": {"origins": [
    "http://localhost:5173"
]}})

def get_db_connection():
    """
    Establishes and returns a new database connection using mysql.connector.
    Database credentials (host, user, password, database name, port) are loaded
    from environment variables defined in the .env file.
    """
    try:
        conn = mysql.connector.connect(
            host=os.getenv("DB_HOST", "localhost"),
            user=os.getenv("DB_USER", "root"),
            password=os.getenv("DB_PASSWORD", "12345678"),
            database=os.getenv("DB_NAME", "food_shopdb"),
            port=int(os.getenv("DB_PORT", 3306)),
            charset='utf8mb4'
        )
        return conn
    except mysql.connector.Error as err:
        print(f"Database connection error: {err}")
        # To help with debugging, you can also print the variables being used
        # print(f"Host: {os.getenv('DB_HOST')}, User: {os.getenv('DB_USER')}, DB: {os.getenv('DB_NAME')}")
        raise

# --- API Endpoint: Get All Menus (with optional restaurant_id and category filters) ---
@app.route('/api/menus', methods=['GET'])
def get_all_menus():
    """
    Fetches menu items from the 'menus' table.
    Can filter by 'restaurant_id' and 'category' if provided as query parameters.
    """
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True) # Return results as dictionaries

        restaurant_id = request.args.get('restaurant_id')
        category = request.args.get('category') # Get the category query parameter

        sql_query = "SELECT id, restaurant_id, name, description, base_price, category, image_url, is_available, created_at, updated_at FROM menus"
        conditions = []
        params = []

        if restaurant_id:
            conditions.append("restaurant_id = %s")
            params.append(restaurant_id)

        # NEW: Add category filtering
        if category and category != 'All': # 'All' is a common frontend convention to show all categories
            conditions.append("category = %s")
            params.append(category)

        # Append WHERE clause if there are any conditions
        if conditions:
            sql_query += " WHERE " + " AND ".join(conditions)

        cursor.execute(sql_query, params)
        menus = cursor.fetchall()

        # Format fetched data for JSON response
        formatted_menus = []
        for menu_item in menus:
            item = menu_item.copy()
            # Convert Decimal to string for JSON serialization
            if 'base_price' in item and item['base_price'] is not None:
                item['base_price'] = str(item['base_price'])
            # Format datetime objects to ISO 8601 strings
            if 'created_at' in item and item['created_at'] is not None:
                item['created_at'] = item['created_at'].isoformat()
            if 'updated_at' in item and item['updated_at'] is not None:
                item['updated_at'] = item['updated_at'].isoformat()
            formatted_menus.append(item)

        return jsonify(formatted_menus), 200
    except Exception as e:
        print(f"Error in /api/menus (GET all): {e}")
        return jsonify({"error": "Failed to fetch menus", "detail": str(e)}), 500
    finally:
        # Ensure database resources are closed
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# --- NEWLY ADDED: API Endpoint: Get Single Menu by ID ---
@app.route('/api/menus/<int:menu_id>', methods=['GET'])
def get_menu_by_id(menu_id):
    """
    Fetches a single menu item by its ID.
    Returns a JSON object of the menu item or a 404 if not found.
    """
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True) # Return results as dictionaries

        sql_query = "SELECT id, restaurant_id, name, description, base_price, category, image_url, is_available, created_at, updated_at FROM menus WHERE id = %s"
        cursor.execute(sql_query, (menu_id,))
        menu_item = cursor.fetchone() # Fetch single row

        if not menu_item:
            return jsonify({"message": "Menu not found"}), 404

        # Format fetched data for JSON response
        item = menu_item.copy()
        if 'base_price' in item and item['base_price'] is not None:
            item['base_price'] = str(item['base_price'])
        if 'created_at' in item and item['created_at'] is not None:
            item['created_at'] = item['created_at'].isoformat()
        if 'updated_at' in item and item['updated_at'] is not None:
            item['updated_at'] = item['updated_at'].isoformat()

        return jsonify(item), 200
    except Exception as e:
        print(f"Error in /api/menus/{menu_id} (GET single): {e}")
        return jsonify({"error": "Failed to fetch menu by ID", "detail": str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


# --- NEW: API Endpoint: Create Menu ---
@app.route('/api/menus', methods=['POST'])
def create_menu():
    """
    Creates a new menu item in the 'menus' table.
    Expects JSON with 'restaurant_id', 'name', 'description', 'base_price', 'category', 'image_url', 'is_available'.
    """
    data = request.get_json()
    restaurant_id = data.get('restaurant_id')
    name = data.get('name')
    description = data.get('description')
    base_price = data.get('base_price')
    category = data.get('category')
    image_url = data.get('image_url')
    is_available = data.get('is_available', True) # Default to True if not provided

    if not restaurant_id or not name or base_price is None or not category:
        return jsonify({"error": "Missing required menu data"}), 400

    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        current_time = datetime.now()

        sql = """
        INSERT INTO menus (restaurant_id, name, description, base_price, category, image_url, is_available, created_at, updated_at)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        params = (
            restaurant_id, name, description, base_price, category, image_url, is_available,
            current_time, current_time
        )
        cursor.execute(sql, params)
        conn.commit()
        new_menu_id = cursor.lastrowid
        return jsonify({"message": "Menu created successfully", "id": new_menu_id}), 201
    except Exception as e:
        if conn:
            conn.rollback() # Rollback transaction in case of error
        print(f"Error in /api/menus (POST): {e}")
        return jsonify({"error": "Failed to create menu", "detail": str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# --- NEW: API Endpoint: Update Menu ---
@app.route('/api/menus/<int:menu_id>', methods=['PUT', 'PATCH'])
def update_menu(menu_id):
    """
    Updates an existing menu item in the 'menus' table.
    Expects JSON with fields to update.
    """
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided for update"}), 400

    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Build dynamic update query
        set_clauses = []
        params = []
        current_time = datetime.now()

        for key, value in data.items():
            if key in ['name', 'description', 'category', 'image_url']:
                set_clauses.append(f"{key} = %s")
                params.append(value)
            elif key == 'base_price':
                set_clauses.append(f"{key} = %s")
                params.append(float(value)) # Ensure price is float/decimal
            elif key == 'is_available':
                set_clauses.append(f"{key} = %s")
                params.append(bool(value))
            # restaurant_id might be immutable or handled separately if allowed to change

        set_clauses.append("updated_at = %s") # Always update updated_at
        params.append(current_time)

        if not set_clauses:
            return jsonify({"message": "No valid fields provided for update"}), 200

        sql = f"UPDATE menus SET {', '.join(set_clauses)} WHERE id = %s"
        params.append(menu_id) # Add menu_id for WHERE clause

        cursor.execute(sql, params)
        conn.commit()

        if cursor.rowcount == 0:
            return jsonify({"message": "Menu not found or no changes made"}), 404
        return jsonify({"message": "Menu updated successfully"}), 200
    except Exception as e:
        if conn:
            conn.rollback() # Rollback transaction in case of error
        print(f"Error in /api/menus/{menu_id} (PUT/PATCH): {e}")
        return jsonify({"error": "Failed to update menu", "detail": str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# --- NEW: API Endpoint: Delete Menu ---
@app.route('/api/menus/<int:menu_id>', methods=['DELETE'])
def delete_menu(menu_id):
    """
    Deletes a menu item from the 'menus' table.
    """
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        sql = "DELETE FROM menus WHERE id = %s"
        cursor.execute(sql, (menu_id,))
        conn.commit()

        if cursor.rowcount == 0:
            return jsonify({"message": "Menu not found"}), 404
        return jsonify({"message": "Menu deleted successfully"}), 200
    except Exception as e:
        if conn:
            conn.rollback() # Rollback transaction in case of error
        print(f"Error in /api/menus/{menu_id} (DELETE): {e}")
        return jsonify({"error": "Failed to delete menu", "detail": str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# --- API Endpoint: Get All Orders (with optional restaurant_id filter) ---
@app.route('/api/orders', methods=['GET'])
def get_all_orders():
    """
    Fetches orders from the 'orders' table.
    Can filter by 'restaurant_id' if provided as a query parameter.
    """
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        restaurant_id = request.args.get('restaurant_id')

        sql_query = "SELECT id, restaurant_id, table_number, total_amount, status, payment_status, order_time, updated_at, qr_code_url FROM orders"
        params = []

        if restaurant_id:
            sql_query += " WHERE restaurant_id = %s"
            params.append(restaurant_id)

        cursor.execute(sql_query, params)
        orders = cursor.fetchall()

        formatted_orders = []
        for order_item in orders:
            item = order_item.copy()
            if 'total_amount' in item and item['total_amount'] is not None:
                item['total_amount'] = str(item['total_amount'])
            if 'order_time' in item and item['order_time'] is not None:
                item['order_time'] = item['order_time'].isoformat()
            if 'updated_at' in item and item['updated_at'] is not None:
                item['updated_at'] = item['updated_at'].isoformat()
            formatted_orders.append(item)
        return jsonify(formatted_orders), 200
    except Exception as e:
        print(f"Error in /api/orders (GET all): {e}")
        return jsonify({"error": "Failed to fetch orders", "detail": str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# --- NEW: API Endpoint: Get Order by ID ---
@app.route('/api/orders/<int:order_id>', methods=['GET'])
def get_order_by_id(order_id):
    """
    Fetches a single order by its ID, including its associated order_items.
    """
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        # Fetch main order details
        sql_order = "SELECT id, restaurant_id, table_number, total_amount, status, payment_status, order_time, updated_at, qr_code_url FROM orders WHERE id = %s"
        cursor.execute(sql_order, (order_id,))
        order = cursor.fetchone()

        if not order:
            return jsonify({"message": "Order not found"}), 404

        # Fetch associated order items
        sql_items = "SELECT id, menu_id, quantity, price_at_order, notes, created_at, updated_at FROM order_items WHERE order_id = %s"
        cursor.execute(sql_items, (order_id,))
        items = cursor.fetchall()

        # Format datetime/decimal for JSON
        if 'total_amount' in order and order['total_amount'] is not None:
            order['total_amount'] = str(order['total_amount'])
        if 'order_time' in order and order['order_time'] is not None:
            order['order_time'] = order['order_time'].isoformat()
        if 'updated_at' in order and order['updated_at'] is not None:
            order['updated_at'] = order['updated_at'].isoformat()

        formatted_items = []
        for item in items:
            item_copy = item.copy()
            if 'price_at_order' in item_copy and item_copy['price_at_order'] is not None:
                item_copy['price_at_order'] = str(item_copy['price_at_order'])
            if 'created_at' in item_copy and item_copy['created_at'] is not None:
                item_copy['created_at'] = item_copy['created_at'].isoformat()
            if 'updated_at' in item_copy and item_copy['updated_at'] is not None:
                item_copy['updated_at'] = item_copy['updated_at'].isoformat()
            formatted_items.append(item_copy)

        order['items'] = formatted_items # Attach items to the order object

        return jsonify(order), 200
    except Exception as e:
        print(f"Error in /api/orders/{order_id} (GET): {e}")
        return jsonify({"error": "Failed to fetch order", "detail": str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# --- API Endpoint: Create a New Order (now handles order_items) ---
@app.route('/api/orders', methods=['POST'])
def create_order():
    """
    Receives new order data and its items from the frontend.
    Inserts the main order into 'orders' table and each item into 'order_items' table.
    Expects JSON with:
    'restaurant_id', 'table_number', 'total_amount', 'status', 'payment_status',
    'items': [{ 'menu_id', 'quantity', 'price_at_order', 'notes' }]
    """
    data = request.get_json()
    restaurant_id = data.get('restaurant_id')
    table_number = data.get('table_number')
    total_amount = data.get('total_amount')
    status = data.get('status')
    payment_status = data.get('payment_status')
    qr_code_url = data.get('qr_code_url', None)
    items = data.get('items', [])

    if not restaurant_id or table_number is None or total_amount is None or not status or not payment_status:
        return jsonify({"error": "Missing required order data for main order"}), 400
    if not isinstance(items, list):
        return jsonify({"error": "Items must be a list"}), 400

    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        conn.autocommit = False # Start a transaction for atomicity
        cursor = conn.cursor()

        current_time = datetime.now()

        # 1. Insert into the 'orders' table
        sql_order = """
        INSERT INTO orders (restaurant_id, table_number, total_amount, status, payment_status, order_time, qr_code_url, updated_at)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """
        params_order = (
            restaurant_id,
            table_number,
            total_amount,
            status,
            payment_status,
            current_time,       # order_time (now serves as creation timestamp)
            qr_code_url,
            current_time        # updated_at
        )

        cursor.execute(sql_order, params_order)
        new_order_id = cursor.lastrowid # Get the ID of the newly created order

        # 2. Insert into the 'order_items' table for each item
        if items:
            sql_order_item = """
            INSERT INTO order_items (order_id, menu_id, quantity, price_at_order, notes, created_at, updated_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            """
            for item in items:
                menu_id = item.get('menu_id')
                quantity = item.get('quantity')
                price_at_order = item.get('price_at_order')
                notes = item.get('notes', None)

                if menu_id is None or quantity is None or price_at_order is None:
                    raise ValueError(f"Missing required data for an order item: {item}")

                params_order_item = (
                    new_order_id, # Link to the newly created order
                    menu_id,
                    quantity,
                    price_at_order,
                    notes,
                    current_time, # created_at for order_item
                    current_time  # updated_at for order_item
                )
                cursor.execute(sql_order_item, params_order_item)

        conn.commit() # Commit the entire transaction
        return jsonify({"message": "Order and items created successfully", "order_id": new_order_id}), 201
    except ValueError as ve:
        if conn:
            conn.rollback() # Rollback in case of validation error
        print(f"Order item validation error: {ve}")
        return jsonify({"error": "Failed to create order due to item data validation", "detail": str(ve)}), 400
    except Exception as e:
        if conn:
            conn.rollback() # Rollback in case of any other error
        print(f"Error in /api/orders (POST): {e}")
        return jsonify({"error": "Failed to create order", "detail": str(e)}), 500
    finally:
        # Ensure resources are closed and autocommit is reset
        if cursor:
            cursor.close()
        if conn:
            conn.close()
            # conn.autocommit = True # Not needed if connection is closed after use

# --- NEW: API Endpoint: Update Order ---
@app.route('/api/orders/<int:order_id>', methods=['PUT', 'PATCH'])
def update_order(order_id):
    """
    Updates an existing order in the 'orders' table.
    Expects JSON with fields to update (e.g., 'status', 'payment_status', 'total_amount', 'table_number').
    """
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided for update"}), 400

    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        set_clauses = []
        params = []
        current_time = datetime.now()

        for key, value in data.items():
            if key in ['status', 'payment_status']:
                set_clauses.append(f"{key} = %s")
                params.append(value)
            elif key == 'total_amount':
                set_clauses.append(f"{key} = %s")
                params.append(float(value)) # Convert to float for DB
            elif key == 'table_number':
                set_clauses.append(f"{key} = %s")
                params.append(int(value)) # Convert to int for DB
            elif key == 'qr_code_url': # Allow updating QR code URL
                set_clauses.append(f"{key} = %s")
                params.append(value)
            # order_time and restaurant_id are typically not updated via this endpoint

        set_clauses.append("updated_at = %s") # Always update updated_at
        params.append(current_time)

        if not set_clauses:
            return jsonify({"message": "No valid fields provided for update"}), 200

        sql = f"UPDATE orders SET {', '.join(set_clauses)} WHERE id = %s"
        params.append(order_id)

        cursor.execute(sql, params)
        conn.commit()

        if cursor.rowcount == 0:
            return jsonify({"message": "Order not found or no changes made"}), 404
        return jsonify({"message": "Order updated successfully"}), 200
    except Exception as e:
        if conn:
            conn.rollback()
        print(f"Error in /api/orders/{order_id} (PUT/PATCH): {e}")
        return jsonify({"error": "Failed to update order", "detail": str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# --- NEW: API Endpoint: Delete Order ---
@app.route('/api/orders/<int:order_id>', methods=['DELETE'])
def delete_order(order_id):
    """
    Deletes an order from the 'orders' table and cascades to 'order_items'
    if the foreign key constraint is set up with ON DELETE CASCADE.
    """
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        sql = "DELETE FROM orders WHERE id = %s"
        cursor.execute(sql, (order_id,))
        conn.commit()

        if cursor.rowcount == 0:
            return jsonify({"message": "Order not found"}), 404
        return jsonify({"message": "Order deleted successfully"}), 200
    except Exception as e:
        if conn:
            conn.rollback()
        print(f"Error in /api/orders/{order_id} (DELETE): {e}")
        return jsonify({"error": "Failed to delete order", "detail": str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# --- NEW: API Endpoint: Get Order Items by Order ID ---
@app.route('/api/orders/<int:order_id>/items', methods=['GET'])
def get_order_items_by_order_id(order_id):
    """
    Fetches all items associated with a specific order ID from the 'order_items' table.
    """
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        sql_query = "SELECT id, order_id, menu_id, quantity, price_at_order, notes, created_at, updated_at FROM order_items WHERE order_id = %s"
        cursor.execute(sql_query, (order_id,))
        items = cursor.fetchall()

        formatted_items = []
        for item in items:
            item_copy = item.copy()
            if 'price_at_order' in item_copy and item_copy['price_at_order'] is not None:
                item_copy['price_at_order'] = str(item_copy['price_at_order'])
            if 'created_at' in item_copy and item_copy['created_at'] is not None:
                item_copy['created_at'] = item_copy['created_at'].isoformat()
            if 'updated_at' in item_copy and item_copy['updated_at'] is not None:
                item_copy['updated_at'] = item_copy['updated_at'].isoformat()
            formatted_items.append(item_copy)

        if not formatted_items:
            # Return 200 with empty list if no items, rather than 404, as the order might exist.
            return jsonify({"message": "No items found for this order", "items": []}), 200

        return jsonify(formatted_items), 200
    except Exception as e:
        print(f"Error in /api/orders/{order_id}/items: {e}")
        return jsonify({"error": "Failed to fetch order items", "detail": str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


# --- API Endpoint: Get All Employees (with optional restaurant_id filter) ---
@app.route('/api/employees', methods=['GET'])
def get_all_employees():
    """
    Fetches employees from the 'employees' table.
    Can filter by 'restaurant_id' if provided as a query parameter.
    """
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        restaurant_id = request.args.get('restaurant_id')

        # Updated: Removed 'email' from SELECT query
        sql_query = "SELECT id, full_name, position, phone_number, salary, hire_date, created_at, updated_at, restaurant_id FROM employees"
        params = []

        if restaurant_id:
            sql_query += " WHERE restaurant_id = %s"
            params.append(restaurant_id)

        cursor.execute(sql_query, params)
        employees = cursor.fetchall()

        formatted_employees = []
        for employee_item in employees:
            item = employee_item.copy()
            if 'salary' in item and item['salary'] is not None:
                item['salary'] = str(item['salary'])
            if 'hire_date' in item and item['hire_date'] is not None:
                item['hire_date'] = item['hire_date'].isoformat()
            if 'created_at' in item and item['created_at'] is not None:
                item['created_at'] = item['created_at'].isoformat()
            if 'updated_at' in item and item['updated_at'] is not None:
                item['updated_at'] = item['updated_at'].isoformat()
            formatted_employees.append(item)

        return jsonify(formatted_employees), 200
    except Exception as e:
        print(f"Error in /api/employees (GET all): {e}")
        return jsonify({"error": "Failed to fetch employees", "detail": str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# --- NEW: API Endpoint: Create Employee ---
@app.route('/api/employees', methods=['POST'])
def create_employee():
    """
    Creates a new employee in the 'employees' table.
    Expects JSON with 'restaurant_id', 'full_name', 'position', 'phone_number', 'salary', 'hire_date'.
    'email' is removed as per user request.
    """
    data = request.get_json()
    restaurant_id = data.get('restaurant_id')
    full_name = data.get('full_name')
    position = data.get('position')
    phone_number = data.get('phone_number')
    salary = data.get('salary')
    hire_date_str = data.get('hire_date')

    if not restaurant_id or not full_name or not position or salary is None or not hire_date_str:
        return jsonify({"error": "Missing required employee data: restaurant_id, full_name, position, salary, hire_date"}), 400

    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        current_time = datetime.now()
        hire_date = datetime.strptime(hire_date_str, '%Y-%m-%d').date()

        sql = """
        INSERT INTO employees (restaurant_id, full_name, position, phone_number, salary, hire_date, created_at, updated_at)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """
        params = (
            restaurant_id, full_name, position, phone_number, salary, hire_date,
            current_time, current_time
        )
        cursor.execute(sql, params)
        conn.commit()
        new_employee_id = cursor.lastrowid
        return jsonify({"message": "Employee created successfully", "id": new_employee_id}), 201
    except Exception as e:
        if conn:
            conn.rollback()
        print(f"Error in /api/employees (POST): {e}")
        return jsonify({"error": "Failed to create employee", "detail": str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# --- NEW: API Endpoint: Update Employee ---
@app.route('/api/employees/<int:employee_id>', methods=['PUT', 'PATCH'])
def update_employee(employee_id):
    """
    Updates an existing employee in the 'employees' table.
    Expects JSON with fields to update.
    'email' is removed from updatable fields as per user request.
    """
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided for update"}), 400

    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        set_clauses = []
        params = []
        current_time = datetime.now()

        for key, value in data.items():
            if key in ['full_name', 'position', 'phone_number']:
                set_clauses.append(f"{key} = %s")
                params.append(value)
            elif key == 'salary':
                set_clauses.append(f"{key} = %s")
                params.append(float(value))
            elif key == 'hire_date':
                set_clauses.append(f"{key} = %s")
                params.append(datetime.strptime(value, '%Y-%m-%d').date())

        set_clauses.append("updated_at = %s") # Always update updated_at
        params.append(current_time)

        if not set_clauses:
            return jsonify({"message": "No valid fields provided for update"}), 200

        sql = f"UPDATE employees SET {', '.join(set_clauses)} WHERE id = %s"
        params.append(employee_id)

        cursor.execute(sql, params)
        conn.commit()

        if cursor.rowcount == 0:
            return jsonify({"message": "Employee not found or no changes made"}), 404
        return jsonify({"message": "Employee updated successfully"}), 200
    except Exception as e:
        if conn:
            conn.rollback()
        print(f"Error in /api/employees/{employee_id} (PUT/PATCH): {e}")
        return jsonify({"error": "Failed to update employee", "detail": str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# --- NEW: API Endpoint: Delete Employee ---
@app.route('/api/employees/<int:employee_id>', methods=['DELETE'])
def delete_employee(employee_id):
    """
    Deletes an employee from the 'employees' table.
    """
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        sql = "DELETE FROM employees WHERE id = %s"
        cursor.execute(sql, (employee_id,))
        conn.commit()

        if cursor.rowcount == 0:
            return jsonify({"message": "Employee not found"}), 404
        return jsonify({"message": "Employee deleted successfully"}), 200
    except Exception as e:
        if conn:
            conn.rollback()
        print(f"Error in /api/employees/{employee_id} (DELETE): {e}")
        return jsonify({"error": "Failed to delete employee", "detail": str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# --- API Endpoint: Simple Test ---
@app.route('/api/test', methods=['GET'])
def test_api():
    """
    A simple test endpoint to confirm that the Flask API is running and accessible.
    Returns a basic JSON message.
    """
    return jsonify({"message": "API is working!", "data": "Hello from Flask backend!"}), 200



# --- Main Entry Point for Running the Flask App ---
if __name__ == '__main__':
    # When running this script directly (e.g., `python app.py`),
    # the Flask development server will start.
    # `debug=True` enables debug mode, which provides detailed error messages
    # and automatically reloads the server on code changes.
    # `port=5000` sets the listening port for the Flask application.
    # `host='0.0.0.0'` makes the server accessible from any IP address,
    # including your frontend running on localhost.
    app.run(debug=True, port=5000, host='0.0.0.0') 
