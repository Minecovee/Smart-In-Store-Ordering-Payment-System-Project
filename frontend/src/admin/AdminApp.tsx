import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import OrdersPage from "./pages/OrdersPage";
import EmployeesPage from "./pages/EmployeesPage";
import MenusPage from "./pages/MenusPage";

export default function AdminApp() {
  return (
    <Router>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-900 text-white p-4">
          <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
          <nav className="flex flex-col gap-4">
            <Link to="/admin/dashboard" className="hover:text-yellow-400">📊 Dashboard</Link>
            <Link to="/admin/orders" className="hover:text-yellow-400">🛒 Orders</Link>
            <Link to="/admin/employees" className="hover:text-yellow-400">👨‍🍳 Employees</Link>
            <Link to="/admin/menus" className="hover:text-yellow-400">🍽️ Menus</Link>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 bg-gray-100">
          <Routes>
            <Route path="/admin/dashboard" element={<DashboardPage />} />
            <Route path="/admin/orders" element={<OrdersPage />} />
            <Route path="/admin/employees" element={<EmployeesPage />} />
            <Route path="/admin/menus" element={<MenusPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
