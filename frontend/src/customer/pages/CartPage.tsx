import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
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

    try {
      const orderData = {
        restaurant_id: 1,
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

      console.log("orderData to send:", orderData);

      const response = await axios.post(
        "http://localhost:5000/api/orders",
        orderData
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

    <div className="min-h-screen bg-gray-100 p-6 pb-32">
      {/* ปุ่มย้อนกลับ */}
      <button
        onClick={() => navigate(-1)} // กลับไปหน้าก่อนหน้า
        className="self-start mb-4 flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
      </button>

      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-4">
          ตะกร้าสินค้า (โต๊ะ {parsedTableNumber})
        </h1>

        {cart.length === 0 ? (
          <p className="text-gray-500">ตะกร้าว่างเปล่า</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {cart.map((item) => (
              <li
                key={item.menu_id}
                className="py-4 flex justify-between items-center gap-4"
              >
                <div className="flex-1">
                  <h4 className="font-semibold">{item.name}</h4>
                  <div className="flex gap-2 mt-1">
                    {/* Quantity input */}
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
                      className="w-20 px-2 py-1 border rounded"
                    />

                    {/* Notes input */}
                    <input
                      type="text"
                      value={item.notes}
                      placeholder="หมายเหตุ เช่น ไม่เผ็ด"
                      onChange={(e) =>
                        updateItem(item.menu_id, item.quantity, e.target.value)
                      }
                      className="flex-1 px-2 py-1 border rounded"
                    />
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span className="font-semibold">
                    ฿{(item.quantity * item.price_at_order).toFixed(2)}
                  </span>
                  <button
                    onClick={() => removeFromCart(item.menu_id)}
                    className="btn btn-error btn-sm"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Total + Checkout fixed */}
      <div className="fixed bottom-0 left-0 w-full bg-white p-4 border-t shadow-md flex justify-between items-center z-50">
        <span className="text-xl font-bold">
          ยอดรวม: ฿{totalAmount.toFixed(2)}
        </span>
        <button
          onClick={handleCheckout}
          className="btn btn-success text-white font-semibold"
        >
          ชำระเงิน
        </button>
      </div>
    </div>
  );
}
