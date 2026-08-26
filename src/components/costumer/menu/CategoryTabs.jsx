import { ChevronDown } from "lucide-react";

export default function CategoryTabs({
  categories,
  activeCategory,
  onCategoryChange,
  isOpen,
  onToggle,
  onClose,
}) {
  const activeCategoryName =
    categories.find(
      (category) => category.id === activeCategory
    )?.name || "All";

  return (
    <div className="relative">

      {/* =====================================
          FILTER BUTTON
      ===================================== */}

      <button
        type="button"
        onClick={onToggle}
        className="flex h-[42px] min-w-[92px] items-center justify-between gap-3 rounded-[12px] border border-[#d3d0ca] bg-white px-4 text-left shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition active:scale-[0.98]"
      >
        <span className="text-[14px] font-bold text-[#292826]">
          {activeCategoryName}
        </span>

        <ChevronDown
          size={18}
          strokeWidth={2}
          className={`text-[#292826] transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* =====================================
          DROPDOWN + OVERLAY
      ===================================== */}

      {isOpen && (
        <>
          {/* OUTSIDE OVERLAY */}

          <button
            type="button"
            aria-label="Close category"
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/30"
          />

          {/* =================================
              DROPDOWN
          ================================= */}

          <div className="absolute left-1/2 top-[50px] z-50 w-[calc(100vw-120px)] min-w-[265px] max-w-[300px] -translate-x-1/2">

            <div className="relative overflow-hidden rounded-[6px] bg-white shadow-[0_12px_30px_rgba(0,0,0,0.16)]">

              {/* CATEGORY ITEMS */}

              <div className="px-[15px] pt-[2px]">
                {categories.map((category, index) => {
                  const active =
                    activeCategory === category.id;

                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() =>
                        onCategoryChange(category.id)
                      }
                      className={`relative flex h-[66px] w-full items-center border-b border-[#d5d5d5] px-[16px] text-left transition active:bg-[#f4f4f4] ${
                        index ===
                        categories.length - 1
                          ? "border-b-0"
                          : ""
                      }`}
                    >
                      {/* ACTIVE INDICATOR */}

                      {active && (
                        <span className="absolute left-[-15px] top-1/2 h-[60px] w-[5px] -translate-y-1/2 bg-[#292826]" />
                      )}

                      <span
                        className={`text-[17px] tracking-[0.02em] ${
                          active
                            ? "font-bold text-[#171717]"
                            : "font-semibold text-[#171717]"
                        }`}
                      >
                        {category.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* =================================
                  TRIANGLE
              ================================= */}

              <div className="relative h-[25px]">
                <div className="absolute left-1/2 top-[-1px] h-[34px] w-[34px] -translate-x-1/2 rotate-45 bg-white" />
              </div>

            </div>
          </div>
        </>
      )}
    </div>
  );
}