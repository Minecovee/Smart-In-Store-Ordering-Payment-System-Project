import { useCart } from "../controllers/OrderControllers";

export default function Header() {
    const { cart } = useCart();

    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    
    
    return (
    <header className="flex items-center justify-between bg-blue-400 text-white p-4 shadow-md border-b-2 border-gray-300">
      {/* Title */}
      <h1 className="text-xl font-bold">Customer Header</h1>
      
      {/* Search Box*/}
      <div className="flex items-center bg-white rounded-full px-4 py-2 w-200 shadow-sm">
        <input
            type="text"
            placeholder="ค้นหาเมนู"
            className="flex-1 bg-transparent text-black placeholder-gray-400 outline-none"
        
        />
        <button className="text-blue-500 font-semibold hover:text-blue-700">🔍</button>
      </div>

      {/* Cart*/}
      <div className="bg-white text-red-600 px-3 py-1 rounded-full shadow">
          🛒 {totalItems}
        </div>


    </header>
  );
}