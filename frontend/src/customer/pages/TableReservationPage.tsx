import { formatDateTime } from "../../utils/formatDateTime";
import TableCard from "../components/TableCard";
import { useEffect, useMemo, useState } from "react";
import { useTableController } from "../controllers/TableControllers";
import { useNavigate } from "react-router-dom"; // Import useNavigate

interface Props {
  userType?: string;
}

export default function TableReservationPage({ userType = "ลูกค้า" }: Props) {
  const [now, setNow] = useState(new Date());
  const { tables, toggleTable } = useTableController(20);
  const navigate = useNavigate(); // Get the navigate function

  const timeLabel = useMemo(() => formatDateTime(now), [now]);

  useEffect(() => {
    const tick = setInterval(() => setNow(new Date()), 60 * 1000);
    return () => clearInterval(tick);
  }, []);

  // --- NEW: Handle table selection and navigation directly ---
  const handleTableSelect = (tableId: number) => {
    // Navigate immediately to the order page for the selected table
    navigate(`/order/${tableId}`);
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
            // Pass the new navigation function to the TableCard component
            onToggle={() => handleTableSelect(table.id)}
          />
        ))}
      </div>
      
      {/* The "Confirm Booking" button has been removed */}

    </div>
  );
}