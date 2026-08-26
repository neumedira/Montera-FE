import { Search } from "lucide-react";

export default function SearchBar({
  value,
  onChange,
}) {
  return (
    <div className="px-4">
      <div className="flex h-[48px] w-full items-center rounded-[15px] border border-[#d6d3cd] bg-white px-3">

        <Search
          size={21}
          strokeWidth={2}
          className="shrink-0 text-[#555]"
        />

        <input
          type="text"
          value={value}
          onChange={(e) =>
            onChange(e.target.value)
          }
          placeholder="Find your favorite menu..."
          className="ml-2 min-w-0 flex-1 bg-transparent text-[16px] text-[#292826] outline-none placeholder:text-[#777]"
        />

      </div>
    </div>
  );
}