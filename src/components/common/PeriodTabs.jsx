import { useState } from "react";

const periods = [
  "Hari Ini",
  "7 Hari",
  "30 Hari",
  "Semua",
];

export default function PeriodTabs({ activePeriod, onChange }) {
  return (
    <div className="w-full bg-[#e5e3df] rounded-xl p-1 flex">
      {periods.map((period) => (
        <button
          key={period}
          onClick={() => onChange(period)}
          className={`
            flex-1
            py-2.5
            rounded-lg
            text-[12px]
            font-bold
            transition-all
            ${
              activePeriod === period
                ? "bg-[#292827] text-white shadow"
                : "text-[#777572] hover:text-[#292827]"
            }
          `}
        >
          {period}
        </button>
      ))}
    </div>
  );
}