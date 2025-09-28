'use client';
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Customer Pages
import TableReservationPage from "../customer/pages/TableReservationPage";
import OrderFoodPage from "../customer/pages/OrderFoodPage";
import CartPage from "../customer/pages/CartPage";
import PaymentMethod from "../customer/pages/PaymentMethod";
import PaymentSuccess from "../customer/pages/PaymentSuccess";

// Admin Pages
import DashboardPage from "../admin/pages/DashboardPage";
import OrdersPage from "../admin/pages/OrdersPage";
import EmployeesPage from "../admin/pages/EmployeesPage";
import MenusPage from "../admin/pages/MenusPage";
import LoginPage from "../admin/pages/login/Login";
import RegisterPage from "../admin/pages/login/Register";

import { useAuthStore } from "../store/authStore";

interface CartItem {
  menu_id: number;
  name: string;
  quantity: number;
  price_at_order: number;
  notes: string;
}

// Sidebar สำหรับ admin
function Sidebar() {
  return (
    <aside className="w-64 bg-gray-900 text-white p-4">
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
      <nav className="flex flex-col gap-4">
        <a href="/admin/dashboard">📊 Dashboard</a>
        <a href="/admin/orders">🛒 Orders</a>
        <a href="/admin/employees">👨‍🍳 Employees</a>
        <a href="/admin/menus">🍽️ Menus</a>
      </nav>
    </aside>
  );
}

export default function App() {
  const [initialized, setInitialized] = useState(false);
  const token = useAuthStore((state) => state.token);
  const username = useAuthStore((state) => state.username);
  const setAuth = useAuthStore((state) => state.setAuth);

  const [cart, setCart] = useState<CartItem[]>([]); // Cart state สำหรับ customer

  const isLoggedIn = !!token;
  const isCustomer = username?.endsWith("User");

  useEffect(() => {
    // โหลดค่า auth จาก localStorage
    const localToken = localStorage.getItem("jwtToken");
    const localUsername = localStorage.getItem("username");

    if (localToken) {
      setAuth(localToken, localUsername || "", "");
    }

    setInitialized(true);
  }, [setAuth]);

  if (!initialized) return <div>Loading...</div>;

  return (
    <Router>
      <div className="flex min-h-screen">
        {/* Sidebar เฉพาะ admin */}
        {!isCustomer && isLoggedIn && <Sidebar />}

        <main className="flex-1 p-6 bg-gray-100">
          <Routes>
            {/* Login/Register */}
            <Route
              path="/login"
              element={
                isLoggedIn ? (
                  <Navigate to={isCustomer ? "/" : "/admin/dashboard"} replace />
                ) : (
                  <LoginPage />
                )
              }
            />
            <Route
              path="/register"
              element={
                isLoggedIn ? (
                  <Navigate to={isCustomer ? "/" : "/admin/dashboard"} replace />
                ) : (
                  <RegisterPage />
                )
              }
            />

            {/* Customer Routes */}
            {isCustomer && isLoggedIn && (
              <>
                <Route path="/" element={<TableReservationPage />} />
                <Route path="/order/:table_number" element={<OrderFoodPage cart={cart} setCart={setCart} />} />
                <Route path="/cart/:table_number" element={<CartPage cart={cart} setCart={setCart} />} />
                <Route path="/payment/:order_id" element={<PaymentMethod />} />
                <Route path="/payment-success" element={<PaymentSuccess />} />
              </>
            )}

            {/* Admin Routes */}
            {!isCustomer && isLoggedIn && (
              <>
                <Route path="/admin/dashboard" element={<DashboardPage />} />
                <Route path="/admin/orders" element={<OrdersPage />} />
                <Route path="/admin/employees" element={<EmployeesPage />} />
                <Route path="/admin/menus" element={<MenusPage />} />
              </>
            )}

            {/* Fallback */}
            <Route
              path="*"
              element={
                <Navigate
                  to={isLoggedIn ? (isCustomer ? "/" : "/admin/dashboard") : "/login"}
                  replace
                />
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
