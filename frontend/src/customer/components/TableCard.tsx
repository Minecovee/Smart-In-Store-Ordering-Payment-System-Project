// components/TableCard.tsx
import type { TableInfo } from "../controllers/TableControllers"; // หรือ path จริงของ TableInfo

interface Props {
  table: TableInfo;
  onToggle: (id: number) => void;
  userType?: string;
}

export default function TableCard({ table, onToggle, userType }: Props) {
  const isSelected = table.selected
  const isFree = table.status === "free";
  return (
    <button
      onClick={() => onToggle(table.id)}
      className={[
        "group relative h-28 w-full rounded-2xl p-4 text-left shadow-sm transition",
        "hover:ring-2 hover:ring-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-300",
        isSelected ? "bg-blue-500 text-white" :isFree ?"bg-green-500 text-white" : "bg-gray-300 text-slate-700",
        "flex items-center justify-center"
      ].join(" ")}
      aria-pressed={isFree ? "false" : "true"}
      aria-label={`โต๊ะ ${table.id} ${isFree ? "ว่าง" : "มีคน"}`}
    >
      <div className="flex h-full flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-7xl font-bold justify-center h-full">{table.id}</span>
          {/*<span className="rounded-xl bg-white/30 px-2 py-0.5 text-xs font-semibold text-white mix-blend-luminosity">
            {isFree ? "ว่าง" : "มีคน"}
          </span>*/}
        </div>
        {/*<div className="text-xs opacity-90">
          <span>คลิกเพื่อ{isFree ? "จอง" : "ปลดจอง"}</span>
        </div>*/}
        {/* แสดง userType ไว้เป็น tag/debug */}
        {userType && (
          <div className="text-[10px] opacity-70">({userType})</div>
        )}
      </div>

      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-0 ring-sky-200 transition-all group-hover:ring-2" />
    </button>
  );
}
