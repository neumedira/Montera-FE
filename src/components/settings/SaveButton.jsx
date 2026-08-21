import { Save } from "lucide-react";

export default function SaveButton({ onClick }) {
  return (
    <div className="flex justify-end mt-3">
      <button
        onClick={onClick}
        className="h-[36px] px-4 rounded-[11px] bg-[#252423] text-white flex items-center gap-2 text-[12px] font-bold hover:bg-[#353331] active:scale-[0.98] transition"
      >
        <Save size={14} />
        Simpan Perubahan
      </button>
    </div>
  );
}