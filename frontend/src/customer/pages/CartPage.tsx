import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useAuthStore } from "../../store/authStore";
import type { CartItem } from "./OrderFoodPage";

interface Props {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

export default function CartPage({ cart, setCart }: Props) {
  const navigate = useNavigate();
  const { table_number } = useParams<{ table_number: string }>();
  const parsedTableNumber = Number(table_number);

  const updateItem = (menu_id: number, quantity: number, notes: string) => {
    setCart(
      cart.map((item) =>
        item.menu_id === menu_id ? { ...item, quantity, notes } : item
      )
    );
  };

  const removeFromCart = (menu_id: number) => {
    setCart(cart.filter((item) => item.menu_id !== menu_id));
  };

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.quantity * item.price_at_order,
    0
  );

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert("ตะกร้าว่าง! กรุณาเลือกอาหารก่อนชำระเงิน");
      return;
    }

    const token = useAuthStore.getState().token;
    if (!token) {
      alert("กรุณา login ก่อนสั่งอาหาร");
      return;
    }

    try {
      const orderData = {
        table_number: parsedTableNumber,
        total_amount: Number(totalAmount.toFixed(2)),
        status: "pending",
        payment_status: "unpaid",
        items: cart.map((item) => ({
          menu_id: item.menu_id,
          quantity: item.quantity,
          price_at_order: item.price_at_order,
          notes: item.notes || "",
        })),
      };

      const response = await axios.post(
        "http://localhost:5000/api/orders",
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data?.order_id) {
        alert("ออเดอร์ถูกสร้างแล้ว");
        navigate(`/payment/${response.data.order_id}`);
      } else {
        alert("สร้างออเดอร์ไม่สำเร็จ กรุณาลองอีกครั้ง");
      }
    } catch (err: any) {
      console.error("Checkout error:", err.response?.data || err);
      alert("สร้างออเดอร์ไม่สำเร็จ กรุณาลองอีกครั้ง");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 pb-32">
      {/* ปุ่มย้อนกลับ */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 px-4 py-2 mb-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
          />
        </svg>
        กลับ
      </button>

      <div className="max-w-3xl mx-auto bg-white p-4 sm:p-6 rounded-xl shadow-lg">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
          ตะกร้าสินค้า (โต๊ะ {parsedTableNumber})
        </h1>

        {cart.length === 0 ? (
          <p className="text-gray-500 text-center py-12 text-lg">
            ตะกร้าว่างเปล่า
          </p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {cart.map((item) => (
              <li
                key={item.menu_id}
                className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
              >
                {/* รูป + ชื่อ + หมายเหตุ */}
                <div className="flex-1 flex gap-4 w-full sm:w-auto">
                  <img
                    src={item.image_url || "https://via.placeholder.com/80"}
                    alt={item.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 flex flex-col gap-2">
                    <h4 className="font-semibold text-base sm:text-lg text-gray-800">
                      {item.name}
                    </h4>
                    <input
                      type="text"
                      value={item.notes}
                      placeholder="หมายเหตุ เช่น ไม่เผ็ด"
                      onChange={(e) =>
                        updateItem(item.menu_id, item.quantity, e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm sm:text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 hover:bg-gray-50 transition-colors"
                    />
                  </div>
                </div>

                {/* ปุ่มเพิ่ม/ลดจำนวน */}
                <div className="flex items-center gap-1 mt-2 sm:mt-0">
                  <button
                    onClick={() =>
                      updateItem(
                        item.menu_id,
                        Math.max(item.quantity - 1, 1),
                        item.notes
                      )
                    }
                    className="px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 active:scale-95 transition-transform text-lg font-bold"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(
                        item.menu_id,
                        parseInt(e.target.value) || 1,
                        item.notes
                      )
                    }
                    className="w-12 text-center px-1 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
                  />
                  <button
                    onClick={() =>
                      updateItem(item.menu_id, item.quantity + 1, item.notes)
                    }
                    className="px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 active:scale-95 transition-transform text-lg font-bold"
                  >
                    +
                  </button>
                </div>

                {/* ราคาต่อรายการ + ปุ่มลบ */}
                <div className="flex flex-col sm:items-end gap-2 mt-2 sm:mt-0 min-w-[100px] text-right">
                  <span className="font-bold text-blue-600 text-base sm:text-lg truncate">
                    ฿{(item.quantity * item.price_at_order).toFixed(2)}
                  </span>
                  <button
                    onClick={() => removeFromCart(item.menu_id)}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition text-sm sm:text-base"
                  >
                    ลบ
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-white p-4 border-t border-gray-400 shadow-xl flex flex-col sm:flex-row justify-between items-center gap-3 z-50">
        <span className="text-lg sm:text-xl font-bold text-gray-800">
          ยอดรวม:{" "}
          <span className="text-blue-600">฿{totalAmount.toFixed(2)}</span>
        </span>
        <button
          onClick={handleCheckout}
          className="w-full sm:w-auto px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-600 active:scale-95 transition-transform"
        >
          ชำระเงิน
        </button>
      </div>
    </div>
  );
}
