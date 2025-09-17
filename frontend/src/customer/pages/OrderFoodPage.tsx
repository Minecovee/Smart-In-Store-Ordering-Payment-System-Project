import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

// Define the types for data fetched from the backend
interface MenuItem {
  id: number;
  restaurant_id: number;
  name: string;
  description: string;
  base_price: string;
  category: string;
  image_url: string;
  is_available: boolean;
}

export interface CartItem {
  menu_id: number;
  name: string;
  quantity: number;
  price_at_order: number;
  notes: string;
}

// Props interface
interface Props {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

// Categories
const categories = ["ทั้งหมด", "อาหารจานเดียว", "เส้น", "ซุป", "เครื่องดื่ม", "ของหวาน"];

export default function OrderFoodPage({ cart, setCart }: Props) {
  const { table_number } = useParams<{ table_number: string }>();
  const navigate = useNavigate();

  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [filteredMenus, setFilteredMenus] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("ทั้งหมด");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State สำหรับ animation
  const [clickedMenuIds, setClickedMenuIds] = useState<number[]>([]);

  // Fetch menus from backend
  const fetchMenus = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/menus");
      const menuData: MenuItem[] = response.data;
      setMenus(menuData);
      setFilteredMenus(menuData);
    } catch (err) {
      setError("Failed to fetch menus. Please check the backend connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  useEffect(() => {
    if (selectedCategory === "ทั้งหมด") {
      setFilteredMenus(menus);
    } else {
      setFilteredMenus(menus.filter(menu => menu.category === selectedCategory));
    }
  }, [selectedCategory, menus]);

  // Add to cart with animation
  const addToCart = (menuItem: MenuItem) => {
    const existingItem = cart.find(item => item.menu_id === menuItem.id);

    if (existingItem) {
      setCart(
        cart.map(item =>
          item.menu_id === menuItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          menu_id: menuItem.id,
          name: menuItem.name,
          quantity: 1,
          price_at_order: parseFloat(menuItem.base_price),
          notes: "",
        },
      ]);
    }

    // Animation
    setClickedMenuIds(prev => [...prev, menuItem.id]);
    setTimeout(() => {
      setClickedMenuIds(prev => prev.filter(id => id !== menuItem.id));
    }, 500);
  };

  if (loading) return <div className="p-4 text-center">Loading menus...</div>;
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* ปุ่มย้อนกลับ */}
      <button
        onClick={() => navigate(-1)} // กลับไปหน้าก่อนหน้า
        className="self-start mb-4 flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
      </button>
      {/* Cart button */}
      <button
        onClick={() => navigate(`/cart/${table_number}`)}
        className="fixed top-4 right-4 flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-600 z-50"
      >
        <span>Cart</span>
        {cart.length > 0 && (
          <span className="bg-white text-blue-500 px-2 py-1 rounded-full text-sm font-semibold">
            {cart.length}
          </span>
        )}
      </button>

      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">Order for Table #{table_number}</h1>

        {/* Category Buttons */}
        <div className="flex justify-center gap-4 mb-8 overflow-x-auto pb-2">
          {categories.map(cat => (
            <button
              key={cat}
              className={`btn ${selectedCategory === cat ? "btn-primary" : "btn-outline"}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMenus.map(menu => (
            <div
              key={menu.id}
              className={`bg-white rounded-lg shadow-md overflow-hidden flex flex-col cursor-pointer transition transform relative ${
                clickedMenuIds.includes(menu.id)
                  ? "scale-105 shadow-xl"
                  : "hover:scale-105 hover:shadow-lg"
              }`}
              onClick={() => addToCart(menu)}
            >
              <img
                src={menu.image_url || "https://via.placeholder.com/400x300"}
                alt={menu.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 flex-grow">
                <h3 className="text-xl font-semibold">{menu.name}</h3>
                <p className="text-gray-600 mt-1">{menu.description}</p>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-lg font-bold text-gray-800">
                    ฿{parseFloat(menu.base_price).toFixed(2)}
                  </span>
                </div>
              </div>

              {clickedMenuIds.includes(menu.id) && (
                <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded animate-pulse text-sm">
                  เพิ่มแล้ว!
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
