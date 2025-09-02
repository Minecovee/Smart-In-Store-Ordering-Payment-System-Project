
export interface FoodItems{
    id: number;
    name: string;
    price: number;
    image: string;
    category: string;
}

export const MENU_CATEGORIES: string[] = ["อาหารจานเดียว", "เส้น", "ซุป", "เครื่องดื่ม"];

export const MENU_ITEMS: FoodItems[] = [
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


