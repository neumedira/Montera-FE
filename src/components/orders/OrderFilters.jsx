import { SlidersHorizontal } from "lucide-react";
import DatePicker from "../common/DatePicker";

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
  {
    label: "Done",
    value: "Done",
  },
];

export default function OrderFilters({
  activeFilter,
  setActiveFilter,
  startDate,
  endDate,
  setDateRange,
}) {
  const handleDateChange = (start, end) => {
    setDateRange(start, end);
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
            const active =
              activeFilter === tab.value &&
              !startDate &&
              !endDate;

            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => {
                  setActiveFilter(tab.value);
                  setDateRange("", "");
                }}
                className={`
                  rounded-full
                  px-5
                  py-2
                  text-sm
                  font-semibold
                  transition-all
                  duration-200

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

      {/* ================= DATE RANGE ================= */}
      <DatePicker
        mode="range"
        startDate={startDate}
        endDate={endDate}
        onChange={handleDateChange}
      />

    </div>
  );
}