import { useState } from "react";
import { useAuthStore } from "../../../store/authStore";
import { loginApi } from "../../services/AuthService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      toast.warning("กรุณากรอก username และ password");
      return;
    }

    const result = await loginApi(username, password);
    if (result) {
      if (result.role !== "admin") {
        toast.error("คุณไม่มีสิทธิ์เข้าหน้านี้");
        return;
      }

      // ✅ เก็บข้อมูลลง localStorage
      localStorage.setItem("jwtToken", result.token);
      localStorage.setItem("username", result.username);
      localStorage.setItem("role", result.role);

      // ✅ sync state
      setAuth(result.token, result.username, result.role);

      toast.success("Login สำเร็จ");
      navigate("/admin/dashboard");
    } else {
      toast.error("Login ล้มเหลว กรุณาตรวจสอบ username/password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <ToastContainer />
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
        <input
          type="text"
          placeholder="Username"
          className="border p-2 rounded w-full mb-4"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-2 rounded w-full mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleLogin}
          className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600 transition-colors"
        >
          Login
        </button>
      </div>
    </div>
  );
}
