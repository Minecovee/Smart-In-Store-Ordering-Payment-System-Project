import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuthStore } from "../../../store/authStore"; // สมมติคุณมี Zustand store สำหรับ auth

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      alert("กรุณากรอก username และ password");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        username,
        password,
      });

      if (response.status === 200) {
        const { token, role } = response.data;
        setAuth(token, username, role);

        if (role === "admin") {
          navigate("/admin/dashboard");
        } else {
          alert("คุณไม่มีสิทธิ์เข้าหน้านี้");
        }
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">🔑 Admin Login</h2>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Username"
            className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded transition-colors disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-sm text-gray-500 mt-4 text-center">
          ยังไม่มีบัญชี?{" "}
          <span
            className="text-green-500 cursor-pointer hover:underline"
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}
