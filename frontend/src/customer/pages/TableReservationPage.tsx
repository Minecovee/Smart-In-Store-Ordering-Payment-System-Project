import { formatDateTime } from "../../utils/formatDateTime";
import TableCard from "../../components/TableCard";
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
  const navigate = useNavigate();

  const timeLabel = useMemo(() => formatDateTime(now), [now]);

  useEffect(() => {
    const tick = setInterval(() => setNow(new Date()), 60 * 1000);
    return () => clearInterval(tick);
  }, []);

  // --- Handle table click ---
  const handleTableSelect = (tableId: number, isOccupied: boolean) => {
    if (isOccupied) return; // โต๊ะไม่ว่าง → กดไม่ได้

    if (selectedTable === tableId) {
      // ยกเลิกโต๊ะเดิม
      setSelectedTable(null);
      toggleTable(tableId, false);
    } else if (selectedTable === null) {
      // เลือกโต๊ะใหม่
      setSelectedTable(tableId);
      toggleTable(tableId, true);
    } else {
      // ถ้ามีโต๊ะเลือกแล้ว แต่กดโต๊ะอื่น
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
    <div className="flex flex-col h-screen bg-gray-50 p-4 md:p-6">
      {/* Top bar */}
      <div className="relative rounded-2xl border border-gray-200 bg-gray-100 px-4 sm:px-6 py-4 shadow-sm flex-shrink-0">
        <div className="absolute top-4 right-4">
          <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
            <span className="text-xs sm:text-sm text-slate-500">ประเภทผู้ใช้</span>
            <span className="rounded-xl bg-slate-100 px-2 py-1 text-xs sm:text-sm font-semibold text-slate-700">
              {userType}
            </span>
          </div>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800">ร้านนายสมชาย</h1>
        <div className="mt-2 text-xs sm:text-sm md:text-base text-slate-700">
          เวลา: <span className="font-medium">{timeLabel}</span>
        </div>
      </div>

      {/* ตารางโต๊ะ scrollable */}
      <div className="flex-1 overflow-y-auto mt-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 pb-4 auto-rows-fr">
          {tables.map((table) => (
            <TableCard
              key={table.id}
              table={table}
              onToggle={() => handleTableSelect(table.id, table.status !== "free")}
              isSelected={selectedTable === table.id}
            />
          ))}
        </div>
      </div>

      {/* ปุ่มยืนยัน */}
      <div className="flex-shrink-0 flex justify-end mt-4">
        <button
          onClick={handleConfirm}
          className="rounded-full bg-green-700 px-6 py-3 text-white font-semibold shadow-lg hover:bg-green-600 transition"
        >
          ยืนยันการจอง
        </button>
      </div>

      {/* Snackbar */}
      {snackbar && (
        <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 rounded bg-red-700 px-4 py-3 text-white shadow-lg max-w-xs sm:max-w-sm">
          {snackbar}
        </div>
      )}
    </div>
  );
}
