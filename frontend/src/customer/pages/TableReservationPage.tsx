import { formatDateTime } from "../../utils/formatDateTime";
import TableCard from "../components/TableCard";
import { useEffect, useMemo, useState } from "react";
import { useTableController } from "../controllers/TableControllers";
import { useNavigate } from "react-router-dom";

interface Props {
  userType?: string;
}

export default function TableReservationPage({ userType = "ลูกค้า" }: Props) {
  const [now, setNow] = useState(new Date());
  const { tables, toggleTable } = useTableController(20);
  const [selectedTable, setSelectedTable] = useState<number | null>(null); // โต๊ะที่เลือกตอนนี้
  const [snackbar, setSnackbar] = useState<string | null>(null);
  const navigate = useNavigate(); // Get the navigate function

  const timeLabel = useMemo(() => formatDateTime(now), [now]);

  useEffect(() => {
    const tick = setInterval(() => setNow(new Date()), 60 * 1000);
    return () => clearInterval(tick);
  }, []);

  // --- Handle table click ---
  const handleTableSelect = (tableId: number) => {
    if (selectedTable === tableId) {
      // ยกเลิกการเลือกโต๊ะเดิม
      setSelectedTable(null);
      toggleTable(tableId); // toggle สถานะโต๊ะ
    } else if (selectedTable === null) {
      // ถ้ายังไม่มีโต๊ะถูกเลือก ให้เลือกโต๊ะนี้
      setSelectedTable(tableId);
      toggleTable(tableId);
    } else {
      // ถ้ามีโต๊ะถูกเลือกแล้ว แต่กดโต๊ะอื่น ให้ทำอะไรไม่ได้
      setSnackbar("คุณสามารถเลือกโต๊ะได้ครั้งละ 1 โต๊ะเท่านั้น");
      setTimeout(() => setSnackbar(null), 3000);
    }
  };

  // --- Handle confirm booking ---
  const handleConfirm = () => {
    if (selectedTable !== null) {
      navigate(`/order/${selectedTable}`);
      setSnackbar(`จองโต๊ะ ${selectedTable} เรียบร้อยแล้ว 🎉`);
      setTimeout(() => setSnackbar(null), 5000);
      
    } else {
      setSnackbar("กรุณาเลือกโต๊ะก่อนกดยืนยัน");
      setTimeout(() => setSnackbar(null), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Top bar */}
      <div className="relative w-full rounded-2xl border border-sky-200 bg-sky-50 px-6 py-4 shadow-sm">
        <div className="absolute top-4 right-4">
          <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 shadow-sm">
            <span className="text-sm text-slate-500">ประเภทผู้ใช้</span>
            <span className="rounded-xl bg-slate-100 px-2 py-1 text-sm font-semibold text-slate-700">
              {userType}
            </span>
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
          ร้านนายสมชาย
        </h1>
        <div className="mt-2 text-sm text-slate-700">
          เวลา: <span className="font-medium">{timeLabel}</span>
        </div>
      </div>

      {/* ตารางโต๊ะ */}
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {tables.map((table) => (
          <TableCard
            key={table.id}
            table={table}
            onToggle={() => handleTableSelect(table.id)}
            isSelected={selectedTable === table.id} // ส่งสถานะเลือกไป TableCard
          />
        ))}
      </div>

      {/* ปุ่มยืนยัน fixed ขวาล่าง */}
      <button
        onClick={handleConfirm}
        className="fixed bottom-4 right-4 rounded-full bg-green-500 px-6 py-3 text-white font-semibold shadow-lg hover:bg-green-600"
      >
        ยืนยันการจอง
      </button>

      {/* Snackbar */}
      {snackbar && (
        <div className="fixed bottom-20 right-4 rounded bg-green-500 px-4 py-2 text-white shadow-lg">
          {snackbar}
        </div>
      )}
    </div>
  );
}
