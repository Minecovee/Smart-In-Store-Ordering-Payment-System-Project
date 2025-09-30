'use client';
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import { useAuthStore } from "../../store/authStore";
import {
  Card,
  Title,
  Text,
  Flex,
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Badge,
  Metric,
} from "@tremor/react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

interface TopItem {
  name: string;
  total_quantity: number;
  total_amount: number;
}

interface CategorySales {
  category: string;
  total_amount: number;
}

const COLORS = ["#FF6384", "#36A2EB", "#FFCE56", "#8A2BE2", "#00C49F"];

export default function DashboardPage() {
  const [totalSales, setTotalSales] = useState<number>(0);
  const [topItems, setTopItems] = useState<TopItem[]>([]);
  const [categorySales, setCategorySales] = useState<CategorySales[]>([]);

  const navigate = useNavigate(); 
  const logout = useAuthStore((state) => state.logout);

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        navigate("/login");
        return;
      }

      const res = await axios.get(`http://localhost:5000/api/admin/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}` // ✅ ส่ง token ให้ backend
        }
      });

      setTotalSales(res.data.total_sales);
      setTopItems(res.data.top_items);
      setCategorySales(res.data.category_sales);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        // token invalid หรือ expired
        handleLogout();
      }
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("username");
    localStorage.removeItem("role");

    logout(); 
    navigate("/login");
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header + Logout */}
      <Flex justifyContent="between" alignItems="center" className="mb-4">
        <Title className="text-2xl font-bold">📊 Dashboard</Title>
        <button
          onClick={handleLogout}
          className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </Flex>

      {/* ยอดขายรวม */}
      <Card className="bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg">
        <Flex justifyContent="between" alignItems="center">
          <div>
            <Title className="text-white">ยอดขายรวม</Title>
            <Metric className="text-4xl font-bold mt-2">
              {totalSales.toLocaleString()} บาท
            </Metric>
          </div>
        </Flex>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 5 สินค้าขายดี */}
        <Card className="shadow-md">
          <Title>Top 5 สินค้าขายดี</Title>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>ชื่อสินค้า</TableHeaderCell>
                <TableHeaderCell>จำนวนขาย</TableHeaderCell>
                <TableHeaderCell>ยอดขายรวม</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {topItems.map((item, i) => (
                <TableRow
                  key={item.name}
                  className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <TableCell>
                    <Flex alignItems="center" className="gap-2">
                      <Badge color="emerald">{i + 1}</Badge>
                      <Text>{item.name}</Text>
                    </Flex>
                  </TableCell>
                  <TableCell>{item.total_quantity}</TableCell>
                  <TableCell>{item.total_amount.toLocaleString()} บาท</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        {/* กราฟรายได้ตามประเภทเมนู */}
        <Card className="shadow-md">
          <Title>รายได้ตามประเภทเมนู</Title>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={categorySales}
                dataKey="total_amount"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {categorySales.map((entry, index) => (
                  <Cell key={entry.category} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `${value.toLocaleString()} บาท`} />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
