import {
  Beer,
  Coffee,
  CookingPot,
  Sandwich,
  Soup,
} from "lucide-react";

const icons = {
  burger: Sandwich,
  combo: CookingPot,
  drink: Coffee,
  snack: Soup,
};

export default function CategoryTabs({
  categories,
  activeCategory,
  onCategoryChange,
}) {
  return (
    <div className="mt-4 overflow-x-auto px-4 scrollbar-hide">
      <div className="flex w-max gap-5 pb-3">
        {categories.map((category) => {
          const Icon = icons[category.icon] || Sandwich;
          const active = activeCategory === category.id;

          return (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className="flex w-[65px] shrink-0 flex-col items-center gap-2"
            >
              <div
                className={`flex h-[64px] w-[64px] items-center justify-center rounded-full border transition ${
                  active
                    ? "border-[#292826] bg-[#292826] text-white"
                    : "border-[#ddd9d2] bg-white text-[#171717]"
                }`}
              >
                <Icon size={27} strokeWidth={1.8} />
              </div>

              <span
                className={`text-[14px] font-semibold ${
                  active ? "text-[#171717]" : "text-[#686868]"
                }`}
              >
                {category.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}