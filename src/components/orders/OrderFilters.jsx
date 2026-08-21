import { CalendarDays, SlidersHorizontal } from "lucide-react";

const tabs = ["Semua", "Dine-In", "Take Away"];

export default function OrderFilters({
  activeFilter,
  setActiveFilter,
  date,
  setDate,
}) {
  return (
    <div className="space-y-4">
      {/* Filter Category */}
      <div className="flex items-center gap-2">
        <SlidersHorizontal
          size={18}
          strokeWidth={1.6}
          className="text-[#9B9A96]"
        />

        <div className="flex gap-2">
          {tabs.map((tab) => {
            const active = activeFilter === tab;

            return (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`
                  rounded-full px-5 py-2 text-sm font-semibold
                  transition-all duration-200
                  ${
                    active
                      ? "bg-[#272624] text-white shadow-sm"
                      : "bg-[#E6E3DE] text-[#2A2927] hover:bg-[#DCD9D3]"
                  }
                `}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* Date Filter */}
      <div className="flex h-[44px] items-center rounded-xl border border-[#E7E1D5] bg-[#FFFCF4] px-3 shadow-sm">
        <CalendarDays
          size={17}
          strokeWidth={1.6}
          className="text-[#8D8A83]"
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="
            ml-3 w-full border-none bg-transparent
            text-sm text-[#8D8A83]
            outline-none
            [color-scheme:light]
          "
        />

        {!date && (
          <span className="pointer-events-none absolute right-8 text-sm text-[#9B9891]">
            Semua tanggal
          </span>
        )}
      </div>
    </div>
  );
}