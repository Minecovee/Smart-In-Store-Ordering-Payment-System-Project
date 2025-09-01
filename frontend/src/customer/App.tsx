import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TableReservationPage from "./pages/TableReservationPage";
import OrderFoodPage from "./pages/OrderFoodPage";
import AdminApp from "../admin/AdminApp";
import PaymentMethod from "./pages/PaymentMethod"; // นำเข้าคอมโพเนนต์ PaymentMethod

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TableReservationPage />} />
        <Route path="/admin" element={<AdminApp />} />
        <Route path="/order/:table_number" element={<OrderFoodPage />} />
        <Route path="/payment/:order_id" element={<PaymentMethod />} />
      </Routes>
    </Router>
  );
}
