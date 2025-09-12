'use client';
import { useState, useEffect } from "react";
import axios from "axios";
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
  TableCell
} from "@tremor/react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

// Define the shape of the data for type safety
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

  const fetchDashboard = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/admin/dashboard`);
      setTotalSales(res.data.total_sales);
      setTopItems(res.data.top_items);
      setCategorySales(res.data.category_sales);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <div className="p-4 space-y-4">
      <Card className="mb-4">
        <Title>ยอดขายรวม</Title>
        <Text className="text-2xl">{totalSales.toLocaleString()} บาท</Text>
      </Card>

      <Card className="mb-4">
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
            {topItems.map((item) => (
              <TableRow key={item.name}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.total_quantity}</TableCell>
                <TableCell>{item.total_amount.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Card>
        <Title>รายได้ตามประเภทเมนู</Title>
        <ResponsiveContainer width="100%" height={300}>
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
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}