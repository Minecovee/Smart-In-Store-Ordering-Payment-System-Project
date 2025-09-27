// frontend/src/admin/AdminApp.tsx
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import OrdersPage from "./pages/OrdersPage";
import EmployeesPage from "./pages/EmployeesPage";
import MenusPage from "./pages/MenusPage";
import LoginPage from "./pages/login/Login";
import RegisterPage from "./pages/login/Register";
import { useAuthStore } from "../store/authStore";

function Sidebar() {
  return (
    <aside className="w-64 bg-gray-900 text-white p-4">
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
      <nav className="flex flex-col gap-4">
        <Link to="/admin/dashboard" className="hover:text-yellow-400">📊 Dashboard</Link>
        <Link to="/admin/orders" className="hover:text-yellow-400">🛒 Orders</Link>
        <Link to="/admin/employees" className="hover:text-yellow-400">👨‍🍳 Employees</Link>
        <Link to="/admin/menus" className="hover:text-yellow-400">🍽️ Menus</Link>
      </nav>
    </aside>
  );
}

export default function AdminApp() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const token = useAuthStore((state) => state.token);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // โหลดค่า auth จาก localStorage
    const localToken = localStorage.getItem("jwtToken");
    const localUsername = localStorage.getItem("username");
    const localRole = localStorage.getItem("role");

    if (localToken && localRole === "admin") {
      setAuth(localToken, localUsername || "", localRole);
    }

    setInitialized(true);
  }, [setAuth]);

  if (!initialized) {
    return <div>Loading...</div>;
  }

  const isLoggedIn = !!token;

  return (
    <Router>
      <div className="flex min-h-screen">
        {isLoggedIn && <Sidebar />}

        <main className="flex-1 p-6 bg-gray-100">
          <Routes>
            {/* Login */}
            <Route
              path="/login"
              element={isLoggedIn ? <Navigate to="/admin/dashboard" /> : <LoginPage />}
            />

            {/* Register */}
            <Route
              path="/register"
              element={isLoggedIn ? <Navigate to="/admin/dashboard" /> : <RegisterPage />}
            />

            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={isLoggedIn ? <DashboardPage /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/admin/orders"
              element={isLoggedIn ? <OrdersPage /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/admin/employees"
              element={isLoggedIn ? <EmployeesPage /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/admin/menus"
              element={isLoggedIn ? <MenusPage /> : <Navigate to="/login" replace />}
            />

            {/* Fallback */}
            <Route
              path="*"
              element={<Navigate to={isLoggedIn ? "/admin/dashboard" : "/login"} replace />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
