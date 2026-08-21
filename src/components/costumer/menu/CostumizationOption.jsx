export default function CustomizationOption({
  label,
  price,
  checked,
  onChange,
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className="flex h-[57px] w-full items-center justify-between rounded-[17px] border border-[#e5e1da] bg-white px-[14px]"
    >
      <div className="flex items-center gap-[14px]">
        <span
          className={`flex h-[24px] w-[24px] items-center justify-center rounded-[2px] border-[2px] border-[#111] ${
            checked ? "bg-[#292826]" : "bg-white"
          }`}
        >
          {checked && (
            <span className="text-[15px] font-bold text-white">
              ✓
            </span>
          )}
        </span>

        <span className="text-[17px] font-medium text-[#171717]">
          {label}
        </span>
      </div>

      <span className="text-[16px] font-bold text-[#111]">
        + Rp {price.toLocaleString("id-ID")}
      </span>
    </button>
  );
}