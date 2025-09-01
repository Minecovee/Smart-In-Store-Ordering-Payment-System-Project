import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

// Define the types for data fetched from the backend
interface MenuItem {
  id: number;
  restaurant_id: number;
  name: string;
  description: string;
  base_price: string; // Use string to handle Decimal type from Python
  category: string;
  image_url: string;
  is_available: boolean;
}

interface CartItem {
  menu_id: number;
  name: string;
  quantity: number;
  price_at_order: number;
  notes: string;
}

// Define the categories. "All" is a custom one for the frontend UI.
const categories = ["ทั้งหมด", "อาหารจานเดียว", "เส้น", "ซุป", "เครื่องดื่ม", "ของหวาน", "ตะกร้า"];

export default function OrderFoodPage() {
  const { table_number } = useParams<{ table_number: string }>();
  const navigate = useNavigate();

  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [filteredMenus, setFilteredMenus] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("ทั้งหมด");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // NEW: State to hold quantity and notes for each item input
  const [inputStates, setInputStates] = useState<Record<number, { quantity: number; notes: string }>>({});

  // Function to fetch menu data from the backend
  const fetchMenus = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/menus");
      const menuData: MenuItem[] = response.data;
      setMenus(menuData);
      setFilteredMenus(menuData);
      // Initialize input states
      const initialInputStates: Record<number, { quantity: number; notes: string }> = {};
      menuData.forEach(menu => {
        initialInputStates[menu.id] = { quantity: 1, notes: '' };
      });
      setInputStates(initialInputStates);
    } catch (err) {
      setError("Failed to fetch menus. Please check the backend connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  // Filter menus whenever the selected category changes
  useEffect(() => {
    if (selectedCategory === "ทั้งหมด") {
      setFilteredMenus(menus);
    } else {
      setFilteredMenus(menus.filter(menu => menu.category === selectedCategory));
    }
  }, [selectedCategory, menus]);

  // Function to add or update an item in the cart
  const addToCart = (menuItem: MenuItem, quantity: number, notes: string) => {
    const existingItem = cart.find(item => item.menu_id === menuItem.id);
    if (existingItem) {
      setCart(
        cart.map(item =>
          item.menu_id === menuItem.id
            ? { ...item, quantity: item.quantity + quantity, notes: notes }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          menu_id: menuItem.id,
          name: menuItem.name,
          quantity: quantity,
          price_at_order: parseFloat(menuItem.base_price),
          notes: notes,
        },
      ]);
    }
  };

  // Function to remove an item from the cart
  const removeFromCart = (menuId: number) => {
    setCart(cart.filter(item => item.menu_id !== menuId));
  };
  
  // Calculate the total amount of the order
  const totalAmount = cart.reduce((sum, item) => {
    return sum + item.quantity * item.price_at_order;
  }, 0);

  // Function to handle the checkout process
  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert("กรุณาเลือกเมนูอาหารก่อนชำระเงิน");
      return;
    }

    try {
      const orderData = {
        restaurant_id: 1, // Assuming a fixed restaurant_id for now
        table_number: parseInt(table_number as string),
        total_amount: totalAmount,
        status: "pending",
        payment_status: "unpaid",
        items: cart.map(item => ({
          menu_id: item.menu_id,
          quantity: item.quantity,
          price_at_order: item.price_at_order,
          notes: item.notes,
        })),
      };

      const response = await axios.post("http://localhost:5000/api/orders", orderData);
      console.log("Order created successfully:", response.data);
      alert("ออเดอร์ถูกสร้างแล้ว");

      // Navigate to the payment page with the new order ID
      navigate(`/payment/${response.data.order_id}`);
    } catch (err) {
      alert("Failed to create order. Please try again.");
      console.error("Order creation failed:", err);
    }
  };

  // UI rendering logic
  if (loading) {
    return <div className="p-4 text-center">Loading menus...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }
  
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">Order for Table #{table_number}</h1>
        
        {/* Category Filter Buttons */}
        <div className="flex justify-center gap-4 mb-8 overflow-x-auto pb-2">
          {categories.map(category => (
            <button
              key={category}
              className={`btn ${selectedCategory === category ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
        
        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMenus.map(menu => (
            <div key={menu.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
              <img src={menu.image_url || 'https://via.placeholder.com/400x300'} alt={menu.name} className="w-full h-48 object-cover" />
              <div className="p-4 flex-grow">
                <h3 className="text-xl font-semibold">{menu.name}</h3>
                <p className="text-gray-600 mt-1">{menu.description}</p>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-lg font-bold text-gray-800">฿{parseFloat(menu.base_price).toFixed(2)}</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={inputStates[menu.id]?.quantity || 1} // Use state value
                      min="1"
                      className="w-16 px-2 py-1 border rounded"
                      onChange={(e) => {
                          const newQuantity = parseInt(e.target.value) || 1;
                          setInputStates(prev => ({
                              ...prev,
                              [menu.id]: { ...prev[menu.id], quantity: newQuantity }
                          }));
                      }}
                    />
                    <button
                        className="btn btn-primary"
                        onClick={() => {
                            const { quantity, notes } = inputStates[menu.id] || { quantity: 1, notes: '' };
                            addToCart(menu, quantity, notes);
                        }}
                    >
                        Add
                    </button>
                  </div>
                </div>
                <input
                    type="text"
                    value={inputStates[menu.id]?.notes || ''} // Use state value
                    placeholder="e.g., ไม่เผ็ด"
                    className="notes-input w-full mt-2 p-2 border rounded text-sm"
                    onChange={(e) => {
                        const newNotes = e.target.value;
                        setInputStates(prev => ({
                            ...prev,
                            [menu.id]: { ...prev[menu.id], notes: newNotes }
                        }));
                    }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Shopping Cart Section */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">ตะกร้าสินค้า</h2>
          {cart.length === 0 ? (
            <p className="text-gray-500">ตะกร้าว่างเปล่า</p>
          ) : (
            <div>
              <ul className="divide-y divide-gray-200">
                {cart.map((item, index) => (
                  <li key={index} className="py-4 flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold">{item.name}</h4>
                      <p className="text-sm text-gray-500">จำนวน: {item.quantity}</p>
                      {item.notes && <p className="text-sm text-gray-500">หมายเหตุ: {item.notes}</p>}
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-semibold">฿{(item.quantity * item.price_at_order).toFixed(2)}</span>
                      <button onClick={() => removeFromCart(item.menu_id)} className="btn btn-error btn-sm">
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex justify-between items-center border-t pt-4">
                <span className="text-xl font-bold">ยอดรวม: ฿{totalAmount.toFixed(2)}</span>
                <button 
                  onClick={handleCheckout} 
                  className="btn btn-success text-white font-semibold"
                >
                  ชำระเงิน
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}