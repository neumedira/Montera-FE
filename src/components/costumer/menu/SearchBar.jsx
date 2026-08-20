import { Search, SlidersHorizontal } from "lucide-react";

export default function SearchBar({ value, onChange }) {
  return (
    <div className="flex items-center gap-3 px-4">
      <div className="flex h-[48px] flex-1 items-center rounded-[15px] border border-[#dedbd5] bg-white px-3">
        <Search
          size={21}
          strokeWidth={2}
          className="shrink-0 text-[#666]"
        />

        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Find your favorite menu..."
          className="ml-2 w-full bg-transparent text-[16px] text-[#292826] outline-none placeholder:text-[#7d7d7d]"
        />

        <SlidersHorizontal
          size={20}
          strokeWidth={1.8}
          className="shrink-0 text-[#666]"
        />
      </div>
    </div>
  );
}