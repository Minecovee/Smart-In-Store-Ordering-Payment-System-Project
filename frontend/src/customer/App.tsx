import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CustomerIndex from "./pages/CustomerIndex";
import TableReservationPage from "./pages/TableReservationPage";
import OrderFoodPage from "./pages/OrderFoodPage";
import AdminApp from "../admin/AdminApp";
import PaymentMethod from "./pages/PaymentMethod";
import PaymentSuccess from "./pages/PaymentSuccess";

import { CartProvider } from "./controllers/OrderControllers";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

export default function App() {
  return (
    <CartProvider>
      <Router>
        <div className="flex flex-col h-screen">
          {/* Header ด้านบน */}
          <Header />

          {/* ส่วนล่าง: Sidebar + Content */}
          <div className="flex flex-1">
            <Sidebar /> {/* ความกว้าง Sidebar */}
            <main className="flex-1 overflow-auto p-4">
              <Routes>
                <Route path="/" element={<CustomerIndex />} />
                <Route path="/table-reservation" element={<TableReservationPage />} />
                <Route path="/admin" element={<AdminApp />} />
                <Route path="/order-food" element={<OrderFoodPage />} />
                <Route path="/payment-method" element={<PaymentMethod />} />
                <Route path="/payment-success" element={<PaymentSuccess />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </CartProvider>
  );
}
