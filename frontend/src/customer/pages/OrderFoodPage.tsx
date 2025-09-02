
import { MENU_CATEGORIES, MENU_ITEMS } from "../components/Foods"; // ค่าจริง
import type { FoodItems } from "../components/Foods"; // type-only import
import { useState } from "react";
import { useCart } from "../controllers/OrderControllers";


export default function OrderFoodPage() {

  const { cart, addToCart } = useCart();

  const [page, setPage] = useState(0);
  const [category, setCategory] = useState<string>(MENU_CATEGORIES[0]);

  const itemsPerPage = 20;
  const filteredItems = MENU_ITEMS.filter((item) => item.category === category);
  const pageItems = filteredItems.slice(
    page * itemsPerPage,
    (page + 1) * itemsPerPage
  );

  return (

    <div className="min-h-screen flex flex-col ">
      {/* Header 
      <Header  /> 
      */}

      <div className="flex flex-1">
        {/* Sidebar 
        <Sidebar />
        */}

        {/* Main Content */}
        <main className="flex-1 p-4 bg-gray-100">

          {/* ประเภทอาหาร */}
          <div className="flex mb-6 p-2 gap-6 bg-gray-100 max-w-[820px] mx-auto">
          {MENU_CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`px-5 py-2 btn btn-primary ${cat === category 
                  ? "bg-sky-500 text-white shadow-md" 
                  : " hover:bg-gray-300"
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

          {/* Food Items */}
          <div className="grid grid-cols-4 gap-4 max-w-[820px] mx-auto">
            
            {pageItems.map((food) => (
              <div
                key={food.id}
                className="bg-white h-60 w-45 rounded-2xl shadow-md overflow-hidden flex flex-col cursor-pointer hover:scale-105 transition"
                //onClick={() => navigate(`/food/${food.id}`)} // นำทางไปหน้า Detail
                onClick={() => addToCart(food)}
              >
                <img
                  src={food.image}
                  alt={food.name}
                  className="h-40 w-full object-cover"
                />
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-semibold text-lg">{food.name}</h3>
                  <p className="text-gray-600 mb-4">{food.price} บาท</p>
                  
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
