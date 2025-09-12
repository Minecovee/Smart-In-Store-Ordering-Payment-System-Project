import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TableReservationPage from "./pages/TableReservationPage";
import OrderFoodPage from "./pages/OrderFoodPage";
import AdminApp from "../admin/AdminApp";
import PaymentMethod from "./pages/PaymentMethod"; // นำเข้าคอมโพเนนต์ PaymentMethod
import PaymentSuccess from "./pages/PaymentSuccess";
import DashboardPage from "../admin/pages/DashboardPage";
import OrdersPage from "../admin/pages/OrdersPage";
import EmployeesPage from "../admin/pages/EmployeesPage";
import MenusPage from "../admin/pages/MenusPage";


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TableReservationPage />} />
        <Route path="/admin" element={<AdminApp />} />
        <Route path="/order/:table_number" element={<OrderFoodPage />} />
        <Route path="/payment/:order_id" element={<PaymentMethod />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/admin/dashboard" element={<DashboardPage />} />
        <Route path="/admin/orders" element={<OrdersPage />} />
        <Route path="/admin/employees" element={<EmployeesPage />} />
        <Route path="/admin/menus" element={<MenusPage />} />

      </Routes>
    </Router>
  );
}
