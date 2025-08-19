import sys
import os
import mysql.connector
from flask import Flask, request, jsonify
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
CORS(app, resources={r"/api/*": {"origins": [
    "http://localhost:3000"
]}})

# --- Database Connection Function ---
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
            password=os.getenv("DB_PASSWORD", ""),
            database=os.getenv("DB_NAME", "food_shopdb"), # Make sure this is your database name
            port=int(os.getenv("DB_PORT", 3306)),
            charset='utf8mb4'
        )
        return conn
    except mysql.connector.Error as err:
        print(f"Database connection error: {err}")
        raise

# --- API Endpoint: Get All Menus (with optional restaurant_id filter) ---
@app.route('/api/menus', methods=['GET'])
def get_all_menus():
    """
    Fetches menu items from the 'menus' table.
    Can filter by 'restaurant_id' if provided as a query parameter.
    """
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        restaurant_id = request.args.get('restaurant_id')
        
        sql_query = "SELECT id, restaurant_id, name, description, base_price, category, image_url, is_available, created_at, updated_at FROM menus"
        params = []

        if restaurant_id:
            sql_query += " WHERE restaurant_id = %s"
            params.append(restaurant_id)
        
        cursor.execute(sql_query, params)
        menus = cursor.fetchall()
        
        formatted_menus = []
        for menu_item in menus:
            item = menu_item.copy()
            if 'base_price' in item and item['base_price'] is not None:
                item['base_price'] = str(item['base_price'])
            if 'created_at' in item and item['created_at'] is not None:
                item['created_at'] = item['created_at'].isoformat()
            if 'updated_at' in item and item['updated_at'] is not None:
                item['updated_at'] = item['updated_at'].isoformat()
            formatted_menus.append(item)

        return jsonify(formatted_menus), 200
    except Exception as e:
        print(f"Error in /api/menus: {e}")
        return jsonify({"error": "Failed to fetch menus", "detail": str(e)}), 500
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

        # Updated: Column names adjusted to match your 'orders' table schema
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
        print(f"Error in /api/orders: {e}")
        return jsonify({"error": "Failed to fetch orders", "detail": str(e)}), 500
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
    qr_code_url = data.get('qr_code_url', None) # Optional QR Code URL
    items = data.get('items', []) # List of items for this order

    # Basic validation for required fields
    if not restaurant_id or table_number is None or total_amount is None or not status or not payment_status:
        return jsonify({"error": "Missing required order data for main order"}), 400
    if not isinstance(items, list):
        return jsonify({"error": "Items must be a list"}), 400
    
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        conn.autocommit = False # Start a transaction
        cursor = conn.cursor()

        current_time = datetime.now()
        
        # 1. Insert into the 'orders' table
        # ✅ UPDATED: Removed 'created_at' from the field list and parameters
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
            current_time,      # order_time (now serves as creation timestamp)
            qr_code_url,
            current_time       # updated_at
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
    except ValueError as ve: # Catch validation errors for items
        if conn:
            conn.rollback()
        print(f"Order item validation error: {ve}")
        return jsonify({"error": "Failed to create order due to item data validation", "detail": str(ve)}), 400
    except Exception as e:
        if conn:
            conn.rollback() # Rollback the transaction if any error occurs
        print(f"Error in /api/orders (POST): {e}")
        return jsonify({"error": "Failed to create order", "detail": str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()
            conn.autocommit = True # Reset autocommit for good practice


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

        sql_query = "SELECT id, full_name, position, phone_number, salary, hire_date,created_at, updated_at, restaurant_id FROM employees"
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
        print(f"Error in /api/employees: {e}")
        return jsonify({"error": "Failed to fetch employees", "detail": str(e)}), 500
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
    app.run(debug=True, port=5000, host='0.0.0.0')

