import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TableReservationPage from "./pages/TableReservationPage";
import OrderFoodPage from "./pages/OrderFoodPage";
import AdminApp from "../admin/AdminApp";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TableReservationPage />} />
        <Route path="/admin" element={<AdminApp />} />
        <Route path="/order-food" element={<OrderFoodPage />} />
      </Routes>
    </Router>
  );
}
