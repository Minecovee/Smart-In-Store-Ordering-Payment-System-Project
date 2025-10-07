// components/TableCard.tsx
import type { TableInfo } from "../customer/controllers/TableControllers"; // หรือ path จริงของ TableInfo

interface Props {
  table: TableInfo;
  onToggle: (id: number) => void;
  isSelected?: boolean;
  userType?: string;
}

export default function TableCard({ table, onToggle, userType, isSelected = false }: Props) {
  const isFree = table.status === "free";

  return (
    <button
      onClick={() => isFree && onToggle(table.id)}
      disabled={!isFree}
      className={[
        "relative h-28 w-full sm:w-24 md:w-28 lg:w-32 rounded-lg p-4 shadow-sm transition flex flex-col justify-between items-center",
        isSelected
          ? "bg-blue-500 text-white"
          : isFree
            ? "bg-green-600 text-white hover:ring-2 hover:ring-green-400"
            : "bg-gray-300 text-gray-600 cursor-not-allowed opacity-70",
        "focus:outline-none focus:ring-2 focus:ring-green-500"
      ].join(" ")}
      aria-pressed={isSelected ? "true" : "false"}
      aria-label={`โต๊ะ ${table.id} ${isFree ? "ว่าง" : "มีคน"}`}
    >
      {/* เลขโต๊ะ */}
      <div className="flex h-full flex-col justify-center items-center">
        <span className="text-3xl sm:text-4xl md:text-5xl font-bold">{table.id}</span>
        {userType && (
          <div className="text-[10px] opacity-70 mt-1">({userType})</div>
        )}
      </div>

        {/* สถานะ */}
      {!isFree && (
        <span className="text-xl mt-1 font-semibold text-red-600">X</span>
      )}


      {/* userType debug */}
      {userType && (
        <div className="text-[10px] opacity-70 mt-1">({userType})</div>
      )}

      {/* hover ring */}
      {isFree && (
        <div className="pointer-events-none absolute inset-0 rounded-lg ring-0 group-hover:ring-2 transition-all" />
      )}
    </button>
  );
}
