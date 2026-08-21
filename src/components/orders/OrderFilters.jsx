import { CalendarDays, SlidersHorizontal, X } from "lucide-react";

const tabs = [
  {
    label: "Semua",
    value: "Semua",
  },
  {
    label: "Dine-In",
    value: "Dine-In",
  },
  {
    label: "Take Away",
    value: "Take Away",
  },
];

export default function OrderFilters({
  activeFilter,
  setActiveFilter,
  date,
  setDate,
}) {
  const handleClearDate = () => {
    setDate("");
  };

  return (
    <div className="space-y-4">

      {/* ================= CATEGORY FILTER ================= */}
      <div className="flex items-center gap-2">
        <SlidersHorizontal
          size={18}
          strokeWidth={1.6}
          className="shrink-0 text-[#9B9A96]"
        />

        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const active = activeFilter === tab.value;

            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => setActiveFilter(tab.value)}
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
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= DATE FILTER ================= */}
      <div
        className="
          relative flex h-[44px] items-center
          rounded-xl border border-[#E7E1D5]
          bg-[#FFFCF4] px-3 shadow-sm
        "
      >
        <CalendarDays
          size={17}
          strokeWidth={1.6}
          className="shrink-0 text-[#8D8A83]"
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="
            ml-3 w-full
            border-none bg-transparent
            text-sm text-[#8D8A83]
            outline-none
            [color-scheme:light]
          "
        />

        {/* Clear button */}
        {date && (
          <button
            type="button"
            onClick={handleClearDate}
            className="
              ml-2 flex h-7 w-7 shrink-0
              items-center justify-center
              rounded-full
              text-[#9B9891]
              transition
              hover:bg-[#EDE9E0]
              hover:text-[#292825]
            "
            title="Hapus tanggal"
          >
            <X size={15} />
          </button>
        )}
      </div>

    </div>
  );
}