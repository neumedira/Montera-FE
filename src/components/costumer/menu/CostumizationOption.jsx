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
      className="
        flex
        h-[57px]
        w-full
        items-center
        justify-between
        rounded-[17px]
        border
        border-[#e5e1da]
        dark:border-[#444444]
        bg-white
        dark:bg-[#2d2d2d]
        px-[14px]
        transition-colors
        duration-300
      "
    >
      <div className="flex items-center gap-[14px]">

        {/* CHECKBOX */}

        <span
          className={`
            flex
            h-[24px]
            w-[24px]
            items-center
            justify-center
            rounded-[2px]
            border-[2px]
            border-[#111]
            dark:border-white
            ${
              checked
                ? "bg-[#292826] dark:bg-white"
                : "bg-white dark:bg-[#2d2d2d]"
            }
          `}
        >
          {checked && (
            <span className="text-[15px] font-bold text-white dark:text-[#111]">
              ✓
            </span>
          )}
        </span>

        {/* NAME */}

        <span className="text-[17px] font-medium text-[#171717] dark:text-white">
          {label}
        </span>

      </div>

      {/* PRICE */}

      <span className="text-[16px] font-bold text-[#111] dark:text-white">
        + Rp {price.toLocaleString("id-ID")}
      </span>

    </button>
  );
}