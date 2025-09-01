// pages/OrderFoodPage.tsx
import { useState } from "react";

const MENU_CATEGORIES = ["อาหารจานเดียว", "เส้น", "ซุป", "เครื่องดื่ม"];

const MENU_ITEMS = [
  { id: 1, name: "มันเชื่อม", price: 60, image: "src/menus/มันเชื่อม.jpg", category: "เครื่องดื่ม" },
  { id: 2, name: "น้ำฝรั่ง", price: 70, image: "src/menus/น้ำฝรั่ง.jpg", category: "เครื่องดื่ม" },
  { id: 3, name: "ชามะนาว", price: 120, image: "src/menus/ชามะนาว.jpg", category: "เครื่องดื่ม" },
  { id: 4, name: "ต้มยำปลา", price: 40, image: "src/menus/ต้มยำปลา.webp", category: "ซุป" },
  { id: 5, name: "เส้นหมี่น้ำตก", price: 60, image: "src/menus/เส้นหมี่น้ำตก.webp", category: "เส้น" },
  { id: 6, name: "เส้นเล็กต้มยำ", price: 70, image: "src/menus/เส้นเล็กต้มยำ.jpg", category: "เส้น" },
  { id: 7, name: "ข้าวหน้าเป็ด", price: 120, image: "src/menus/ข้าวหน้าเป็ด.jpg", category: "อาหารจานเดียว" },
  { id: 8, name: "ข้าวไข่ข้น", price: 40, image: "src/menus/ข้าวไข่ข้น.jpg", category: "อาหารจานเดียว" },
  { id: 9, name: "ข้าวผัดต้มยำ", price: 60, image: "src/menus/ข้าวผัดต้มยำ.webp", category: "อาหารจานเดียว" },
  { id: 10, name: "ยำวุ้นเส้น", price: 70, image: "src/menus/ยำวุ้นเส้น.webp", category: "อาหารจานเดียว" },
  { id: 11, name: "ขนมถ้วย", price: 120, image: "src/menus/ขนมถ้วย.webp", category: "เครื่องดื่ม" },
  { id: 12, name: "ฟักทองแกงบวช", price: 40, image: "src/menus/ฟักทองแกงบวช.jpg", category: "เครื่องดื่ม" },
  { id: 13, name: "ข้าวผัด", price: 60, image: "src/menus/ข้าวผัด.jpg", category: "อาหารจานเดียว" },
  { id: 14, name: "แกงส้ม", price: 70, image: "src/menus/แกงส้ม.jpg", category: "ซุป" },
  { id: 15, name: "ผัดไทยกุ้งสด", price: 120, image: "src/menus/ผัดไทยกุ้งสด.jpg", category: "เส้น" },
  { id: 16, name: "บัวลอย", price: 40, image: "src/menus/บัวลอย.jpg", category: "เครื่องดื่ม" },
  { id: 17, name: "น้ำส้มคั้น", price: 60, image: "src/menus/น้ำส้มคั้น.jpg", category: "เครื่องดื่ม" },
  { id: 18, name: "น้ำมะพร้าว", price: 70, image: "src/menus/น้ำมะพร้าว.jpg", category: "เครื่องดื่ม" },
  { id: 19, name: "น้ำกระเจี๊ยบ", price: 120, image: "src/menus/น้ำกระเจี๊ยบ.jpg", category: "เครื่องดื่ม" },
  { id: 20, name: "ข้าวมันไก่", price: 40, image: "src/menus/ข้าวมันไก่.jpg", category: "อาหารจานเดียว" },
  { id: 21, name: "ต้มข่าไก่", price: 60, image: "src/menus/ต้มข่าไก่.jpg", category: "ซุป" },
  { id: 22, name: "แกงจืดเต้าหู้หมูสับ", price: 70, image: "src/menus/แกงจืดเต้าหู้หมูสับ.jpg", category: "ซุป" },
  { id: 23, name: "แกงป่า", price: 120, image: "src/menus/แกงป่า.jpg", category: "ซุป" },
  { id: 24, name: "ส้มตำ", price: 40, image: "src/menus/ส้มตำ.jpg", category: "อาหารจานเดียว" },
  { id: 25, name: "น้ำแตงโมปั่น", price: 60, image: "src/menus/น้ำแตงโมปั่น.jpg", category: "เครื่องดื่ม" },
  { id: 26, name: "น้ำแครอท", price: 70, image: "src/menus/น้ำแครอท.jpg", category: "เครื่องดื่ม" },
  { id: 27, name: "น้ำเสาวรส", price: 120, image: "src/menus/น้ำเสาวรส.jpg", category: "เครื่องดื่ม" },
  { id: 28, name: "ลอดช่อง", price: 40, image: "src/menus/ลอดช่อง.jpg", category: "เครื่องดื่ม" },
  { id: 29, name: "ไอศครีมกะทิ", price: 60, image: "src/menus/ไอศครีมกะทิ.jpg", category: "เครื่องดื่ม" },
  { id: 30, name: "เฉาก๊วย", price: 70, image: "src/menus/เฉาก๊วย.jpg", category: "เครื่องดื่ม" },
  { id: 31, name: "ชานมเย็น", price: 120, image: "src/menus/ชานมเย็น.jpg", category: "เครื่องดื่ม" },
  { id: 32, name: "กาแฟเย็น", price: 40, image: "src/menus/กาแฟเย็น.jpg", category: "เครื่องดื่ม" },
  { id: 33, name: "โอเลี้ยง", price: 60, image: "src/menus/โอเลี้ยง.jpg", category: "เครื่องดื่ม" },
  { id: 34, name: "ชาดำเย็น", price: 70, image: "src/menus/ชาดำเย็น.jpg", category: "เครื่องดื่ม" },
  { id: 35, name: "ข้าวผัดกุ้ง", price: 120, image: "src/menus/ข้าวผัดกุ้ง.jpg", category: "อาหารจานเดียว" },
  { id: 36, name: "ข้าวผัดปู", price: 40, image: "src/menus/ข้าวผัดปู.jpg", category: "อาหารจานเดียว" },
  { id: 37, name: "ก๋วยเตี๋ยวเรือ", price: 60, image: "src/menus/ก๋วยเตี๋ยวเรือ.jpg", category: "เส้น" },
  { id: 38, name: "ราดหน้าหมู", price: 70, image: "src/menus/ราดหน้าหมู.jpg", category: "เส้น" },
  { id: 39, name: "เย็นตาโฟ", price: 120, image: "src/menus/เย็นตาโฟ.jpg", category: "เส้น" },
  { id: 40, name: "ผัดซีอิ๊ว", price: 40, image: "src/menus/ผัดซีอิ๊ว.jpg", category: "เส้น" },
  { id: 41, name: "ข้าวต้มหมู", price: 60, image: "src/menus/ข้าวต้มหมู.jpg", category: "อาหารจานเดียว" },
  { id: 42, name: "ข้าวหมูกรอบ", price: 70, image: "src/menus/ข้าวหมูกรอบ.jpg", category: "อาหารจานเดียว" },
  { id: 43, name: "ข้าวหมูแดง", price: 120, image: "src/menus/ข้าวหมูแดง.jpg", category: "อาหารจานเดียว" },
  { id: 44, name: "โจ๊กหมู", price: 40, image: "src/menus/โจ๊กหมู.jpg", category: "อาหารจานเดียว" },
  { id: 45, name: "เกาเหลาหมู", price: 60, image: "src/menus/เกาเหลาหมู.jpg", category: "ซุป" },
  { id: 46, name: "ข้าวขาหมู", price: 70, image: "src/menus/ข้าวขาหมู.jpg", category: "อาหารจานเดียว" },
  { id: 47, name: "สุกี้แห้ง", price: 120, image: "src/menus/สุกี้แห้ง.jpg", category: "เส้น" },
  { id: 48, name: "สุกี้น้ำ", price: 40, image: "src/menus/สุกี้น้ำ.jpg", category: "เส้น" },
  { id: 49, name: "ผัดกะเพรา", price: 60, image: "src/menus/ผัดกะเพรา.jpg", category: "อาหารจานเดียว" },
  { id: 50, name: "ผัดผงกะหรี่", price: 70, image: "src/menus/ผัดผงกะหรี่.jpg", category: "อาหารจานเดียว" },
  { id: 51, name: "แกงเขียวหวาน", price: 120, image: "src/menus/แกงเขียวหวาน.jpg", category: "ซุป" },
  { id: 52, name: "มัสมั่นไก่", price: 40, image: "src/menus/มัสมั่นไก่.jpg", category: "ซุป" },
  { id: 53, name: "แกงเผ็ดเป็ดย่าง", price: 60, image: "src/menus/แกงเผ็ดเป็ดย่าง.jpg", category: "ซุป" },
  { id: 54, name: "ข้าวเหนียวมะม่วง", price: 70, image: "src/menus/ข้าวเหนียวมะม่วง.jpg", category: "เครื่องดื่ม" },
  { id: 55, name: "ทับทิมกรอบ", price: 120, image: "src/menus/ทับทิมกรอบ.jpg", category: "เครื่องดื่ม" },
  { id: 56, name: "กล้วยบวชชี", price: 40, image: "src/menus/กล้วยบวชชี.jpg", category: "เครื่องดื่ม" },
  { id: 57, name: "ลอดช่องสิงคโปร์", price: 60, image: "src/menus/ลอดช่องสิงคโปร์.jpg", category: "เครื่องดื่ม" },
  { id: 58, name: "แตงไทยน้ำกะทิ", price: 70, image: "src/menus/แตงไทยน้ำกะทิ.jpg", category: "เครื่องดื่ม" },
  { id: 59, name: "น้ำใบเตย", price: 120, image: "src/menus/น้ำใบเตย.jpg", category: "เครื่องดื่ม" },
  { id: 60, name: "น้ำเก๊กฮวย", price: 40, image: "src/menus/น้ำเก๊กฮวย.jpg", category: "เครื่องดื่ม" },
];



interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
}

export default function OrderFoodPage() {
  const [category, setCategory] = useState<string>(MENU_CATEGORIES[0]);
  const [page, setPage] = useState(0);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discountCode, setDiscountCode] = useState("");

  const itemsPerPage = 16;
  const filteredItems = MENU_ITEMS.filter((item) => item.category === category);
  const pageItems = filteredItems.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

  const addToCart = (item: typeof MENU_ITEMS[0]) => {
    setCart((prev) => {
      const exist = prev.find((c) => c.id === item.id);
      if (exist) {
        return prev.map((c) =>
          c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
        );
      } else {
        return [...prev, { id: item.id, name: item.name, price: item.price, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((c) => c.id !== id));
  };

  const updateItemNotes = (index: number, notes: string) => {
    setCart((prev) =>
      prev.map((c, i) => (i === index ? { ...c, notes } : c))
    );
  };

  const total = cart.reduce((sum, c) => sum + c.price * c.quantity, 0);

  return (
    <div className="flex min-h-screen p-6 gap-6 bg-gray-100">
      {/* ฝั่งซ้าย: เมนูอาหาร */}
      <div className="w-2/3 bg-white rounded-2xl shadow-lg p-6 flex flex-col">
        {/* เลือกประเภท */}
        <div className="flex gap-3 mb-6">
          {MENU_CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition ${
                cat === category
                  ? "bg-sky-500 text-white shadow-md"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
              onClick={() => {
                setCategory(cat);
                setPage(0);
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* รายการอาหาร */}
        <div className="grid grid-cols-4 gap-5 flex-1 overflow-auto">
          {pageItems.map((item) => (
            <div
              key={item.id}
              className="bg-white border rounded-xl p-3 flex flex-col items-center shadow-sm hover:shadow-md transition"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 object-cover rounded-lg mb-3"
              />
              <span className="text-sm font-semibold text-gray-800">{item.name}</span>
              <span className="text-sm text-gray-500 mb-3">{item.price} บาท</span>
              <button
                className="bg-sky-500 text-white px-4 py-1.5 rounded-lg hover:bg-sky-600 transition shadow-sm"
                onClick={() => addToCart(item)}
              >
                เพิ่ม
              </button>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-6 gap-2">
          {Array.from({ length: Math.ceil(filteredItems.length / itemsPerPage) }).map((_, i) => (
            <button
              key={i}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                i === page ? "bg-sky-500 text-white shadow" : "bg-gray-200 hover:bg-gray-300"
              }`}
              onClick={() => setPage(i)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* ฝั่งขวา: ตะกร้าสินค้า */}
      <div className="w-1/3 bg-white rounded-2xl shadow-lg p-6 flex flex-col">
        <h2 className="text-center text-xl font-bold mb-4 text-gray-700">🛒 ตะกร้าสินค้า</h2>
        <div className="flex-1 overflow-auto space-y-4">
          {cart.length === 0 && <p className="text-gray-500 text-center">ยังไม่มีสินค้า</p>}
          {cart.map((item, idx) => (
            <div key={item.id} className="flex flex-col border rounded-xl p-3 shadow-sm bg-gray-50">
              {/* ชื่อสินค้า */}
              <span className="w-full text-center font-semibold text-sm text-gray-700 mb-2">
                {item.name}
              </span>

              <div className="flex items-start gap-3">
                {/* จำนวนสินค้า */}
                <span className="w-12 text-center font-semibold bg-white rounded-lg border px-2 py-1 shadow-sm">
                  {item.quantity}
                </span>

                {/* กล่องกรอกรายละเอียด */}
                <textarea
                  placeholder="กรอกรายละเอียดเพิ่มเติม"
                  className="flex-1 border rounded-lg p-2 text-sm resize-none focus:ring-2 focus:ring-sky-400"
                  value={item.notes || ""}
                  onChange={(e) => updateItemNotes(idx, e.target.value)}
                />

                {/* ราคากับปุ่มลบ */}
                <div className="flex flex-col items-end ml-2">
                  <span className="text-sm font-semibold text-gray-700">{item.price} บาท</span>
                  <button
                    className="text-red-500 text-sm font-bold hover:underline mt-1"
                    onClick={() => removeFromCart(item.id)}
                  >
                    ลบ
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* โค้ดส่วนลด และยอดรวม */}
        <div className="mt-6 border-t pt-4">
          <input
            type="text"
            placeholder="ใส่โค้ดส่วนลด"
            className="w-full border rounded-lg p-2 mb-3 text-sm focus:ring-2 focus:ring-sky-400"
            value={discountCode}
            onChange={(e) => setDiscountCode(e.target.value)}
          />
          <div className="flex justify-between font-bold text-gray-700 mb-3">
            <span>รวมทั้งหมด:</span>
            <span>{total} บาท</span>
          </div>
          <button className="w-full bg-sky-500 text-white py-2.5 rounded-xl font-semibold shadow hover:bg-sky-600 transition">
            สั่งซื้อ
          </button>
        </div>
      </div>
    </div>
  );
}
