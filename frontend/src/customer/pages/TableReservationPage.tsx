import { formatDateTime } from "../../utils/formatDateTime";
import TableCard from "../components/TableCard";
import { useEffect, useMemo, useState } from "react";
import { useTableController } from "../controllers/TableControllers";

interface Props {
  userType?: string;
}

export default function TableReservationPage({ userType = "ลูกค้า" }: Props) {
  const [now, setNow] = useState(new Date());
  const { tables, toggleTable, confirmBooking } = useTableController(20);

  const timeLabel = useMemo(() => formatDateTime(now), [now]);

  useEffect(() => {
    const tick = setInterval(() => setNow(new Date()), 60 * 1000);
    return () => clearInterval(tick);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Top bar */}
      <div className="relative w-full rounded-2xl border border-sky-200 bg-sky-50 px-6 py-4 shadow-sm">
        <div className="absolute top-4 right-4">
          <div className="flex gap-2 p-4">

            
      {/* Primary */}
      <button className="btn btn-primary">Primary</button>

      {/* Secondary */}
      <button className="btn btn-secondary">Secondary</button>

      {/* Accent */}
      <button className="btn btn-accent">Accent</button>

      {/* Success */}
      <button className="btn btn-success">Success</button>

      {/* Warning */}
      <button className="btn btn-warning">Warning</button>

      {/* Error */}
      <button className="btn btn-error">Error</button>
    </div>


          <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 shadow-sm">
            <span className="text-sm text-slate-500">ประเภทผู้ใช้</span>
            <span className="rounded-xl bg-slate-100 px-2 py-1 text-sm font-semibold text-slate-700">
              {userType}
            </span>
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800">ร้านนายสมชาย</h1>
        <div className="mt-2 text-sm text-slate-700">
          เวลา: <span className="font-medium">{timeLabel}</span>
        </div>
      </div>

      {/* ตารางโต๊ะ */}
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {tables.map((table) => (
          <TableCard key={table.id} table={table} onToggle={toggleTable} />
        ))}
      </div>

      <div className="mt-6 flex justify-center">
        <button
          onClick={confirmBooking}
          className="fixed bottom-4 right-4 btn btn-success shadow-md transition"
        >
          ยืนยันการจอง
        </button>
      </div>
    </div>
  );
}




