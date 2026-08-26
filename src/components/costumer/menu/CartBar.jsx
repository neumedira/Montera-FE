import { ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

function formatPrice(price) {
  return `Rp ${price.toLocaleString("id-ID")}`;
}

/* =========================================================
   BURGER ICON
========================================================= */

function BurgerIcon({ size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Bun atas */}
      <path
        d="M6 13.5C6.7 9.2 10.7 6 16 6C21.3 6 25.3 9.2 26 13.5H6Z"
        fill="currentColor"
      />

      {/* Selada */}
      <path
        d="M5 15C7 13.8 8.3 15.8 10.3 14.8C12.3 13.8 13.7 15.8 15.7 14.8C17.7 13.8 19.1 15.8 21.1 14.8C23.1 13.8 24.7 15.5 27 14.7L26.2 17.2H5.8L5 15Z"
        fill="currentColor"
      />

      {/* Patty */}
      <rect
        x="5"
        y="17.5"
        width="22"
        height="4"
        rx="1.5"
        fill="currentColor"
      />

      {/* Keju */}
      <path
        d="M7 21.5H25L23.5 24H8.5L7 21.5Z"
        fill="currentColor"
      />

      {/* Bun bawah */}
      <path
        d="M7 24.5H25C24.2 26.2 21 27 16 27C11 27 7.8 26.2 7 24.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

/* =========================================================
   DRINK ICON
========================================================= */

function DrinkIcon({ size = 19 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Sedotan */}
      <path
        d="M18 7L21.5 3.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Cup */}
      <path
        d="M7 8H25L22.8 26C22.6 27.2 21.6 28 20.4 28H11.6C10.4 28 9.4 27.2 9.2 26L7 8Z"
        fill="currentColor"
      />

      {/* Tutup */}
      <rect
        x="6"
        y="6"
        width="20"
        height="3"
        rx="1.5"
        fill="currentColor"
      />

      {/* Garis putih cup */}
      <path
        d="M11 13H21"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      <path
        d="M11.5 17H20.5"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      <path
        d="M12 21H20"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* =========================================================
   CART BAR
========================================================= */

export default function CartBar({
  itemCount,
  total,
  categories = [],
  activeCategory = "all",
  categoryOpen = false,
  onToggleCategory,
  onCategoryChange,
}) {
  const navigate = useNavigate();

  return (
    <>
      {/* =====================================================
          OVERLAY
      ===================================================== */}

      {categoryOpen && (
        <button
          type="button"
          aria-label="Tutup kategori"
          onClick={onToggleCategory}
          className="
            fixed
            inset-0
            z-[90]
            bg-black/30
          "
        />
      )}

      {/* =====================================================
          FLOATING BAR
      ===================================================== */}

      <div
        className="
          fixed
          bottom-[18px]
          left-1/2
          z-[100]
          flex
          -translate-x-1/2
          flex-col
          items-center
        "
      >
        {/* ===================================================
            CATEGORY DROPDOWN
        =================================================== */}

        {categoryOpen && (
          <div
            className="
              absolute
              bottom-[105px]
              left-1/2
              w-[calc(100vw-140px)]
              max-w-[320px]
              -translate-x-1/2
            "
          >
            <div
              className="
                relative
                overflow-hidden
                bg-white
                px-[11px]
                pt-[9px]
                pb-[22px]
                shadow-[0_8px_25px_rgba(0,0,0,0.12)]
              "
              style={{
                borderRadius: "7px",
                clipPath:
                  "polygon(0 0, 100% 0, 100% 94%, 50% 100%, 0 94%)",
              }}
            >
              {categories.map((category, index) => {
                const isActive =
                  activeCategory === category.id;

                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() =>
                      onCategoryChange(category.id)
                    }
                    className={`
                      relative
                      flex
                      h-[45px]
                      w-full
                      items-center
                      px-[16px]
                      text-left
                      text-[15px]
                      font-bold
                      text-[#111]

                      ${
                        index !== categories.length - 1
                          ? "border-b-[1.5px] border-[#dddddd]"
                          : ""
                      }
                    `}
                  >
                    {/* ACTIVE LINE */}

                    {isActive && (
                      <span
                        className="
                          absolute
                          left-[-11px]
                          top-0
                          h-full
                          w-[3px]
                          bg-[#292826]
                        "
                      />
                    )}

                    {category.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ===================================================
            MENU BUTTON
        =================================================== */}

        <button
          type="button"
          onClick={onToggleCategory}
          className="
            flex
            h-[43px]
            min-w-[118px]
            items-center
            justify-center
            gap-[6px]
            rounded-full
            bg-[#292826]
            px-[16px]
            text-white
            shadow-[0_5px_18px_rgba(0,0,0,0.20)]
            transition-transform
            duration-150
            active:scale-95
          "
        >
          {/* BURGER */}

          <BurgerIcon size={19} />

          {/* TEXT */}

          <span
            className="
              text-[15px]
              font-bold
              leading-none
            "
          >
            Menu
          </span>

          {/* ARROW */}

          <ChevronUp
            size={12}
            strokeWidth={2.5}
            className={`
              transition-transform
              duration-200
              ${
                categoryOpen
                  ? "rotate-180"
                  : ""
              }
            `}
          />
        </button>

        {/* ===================================================
            CART
        =================================================== */}

        {itemCount > 0 && (
          <div
            className="
              mt-[6px]
              flex
              items-center
              gap-[6px]
            "
          >
            {/* =================================================
                CART ICON BUTTON
            ================================================= */}

            <button
              type="button"
              onClick={() => navigate("/cart")}
              aria-label="Lihat keranjang"
              className="
                flex
                h-[49px]
                w-[62px]
                shrink-0
                items-center
                justify-center
                gap-[2px]
                rounded-full
                bg-[#292826]
                text-white
                shadow-[0_5px_18px_rgba(0,0,0,0.20)]
                transition-transform
                duration-150
                active:scale-95
              "
            >
              {/* BURGER */}

              <BurgerIcon size={20} />

              {/* DRINK */}

              <DrinkIcon size={18} />
            </button>

            {/* =================================================
                TOTAL
            ================================================= */}

            <button
              type="button"
              onClick={() => navigate("/cart")}
              className="
                flex
                h-[49px]
                w-[205px]
                shrink-0
                items-center
                justify-between
                rounded-full
                bg-[#292826]
                px-[17px]
                text-white
                shadow-[0_5px_18px_rgba(0,0,0,0.20)]
                transition-transform
                duration-150
                active:scale-[0.98]
              "
            >
              {/* ITEM COUNT */}

              <span
                className="
                  whitespace-nowrap
                  text-[14px]
                  font-bold
                  leading-none
                "
              >
                {itemCount} items
              </span>

              {/* TOTAL PRICE */}

              <span
                className="
                  whitespace-nowrap
                  text-[14px]
                  font-bold
                  leading-none
                "
              >
                {formatPrice(total)}
              </span>
            </button>
          </div>
        )}
      </div>
    </>
  );
}