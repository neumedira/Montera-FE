import { Plus } from "lucide-react";
import bestsellerImage from "../../../assets/costumer/bestseller.png";

function formatPrice(price) {
  return `Rp.${price.toLocaleString("id-ID")}`;
}

export default function ProductCard({
  product,
  onAdd,
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      className="
        relative
        w-[239px]
        shrink-0
        cursor-pointer
        overflow-hidden
        rounded-[17px]
        border
        border-[#d8d5cf]
        bg-[#f8f8f8]
        shadow-[0_1px_0_rgba(0,0,0,0.02)]
      "
    >

      {/* =================================
          IMAGE
      ================================= */}

      <div
        className="
          relative
          flex
          h-[140px]
          items-center
          justify-center
          overflow-hidden
          bg-[#f5f5f5]
        "
      >

        {/* BEST SELLER */}

        {product.bestseller && (
          <img
            src={bestsellerImage}
            alt="Best Seller"
            className="
              absolute
              left-[8px]
              top-[8px]
              z-20
              h-[43px]
              w-[43px]
              object-contain
            "
          />
        )}

        {/* CHECKER DECORATION */}

        <div
          className="
            absolute
            right-[12px]
            top-0
            h-[55px]
            w-[28px]
            opacity-70
          "
          style={{
            backgroundImage: `
              linear-gradient(45deg, #292826 25%, transparent 25%),
              linear-gradient(-45deg, #292826 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, #292826 75%),
              linear-gradient(-45deg, transparent 75%, #292826 75%)
            `,
            backgroundSize: "12px 12px",
            backgroundPosition:
              "0 0, 0 6px, 6px -6px, -6px 0",
          }}
        />

        {/* PRODUCT IMAGE */}

        <img
          src={product.image}
          alt={product.name}
          className="
            relative
            z-10
            h-full
            w-full
            object-contain
            drop-shadow-[0_8px_8px_rgba(0,0,0,0.18)]
          "
        />
      </div>

      {/* =================================
          BOTTOM
      ================================= */}

      <div
        className="
          relative
          bg-[#292826]
          px-3
          pb-3
          pt-[12px]
          text-white
        "
      >
        {/* PRODUCT NAME */}

        <h3
          className="
            text-[15px]
            font-bold
            uppercase
            tracking-[0.04em]
          "
        >
          {product.name}
        </h3>

        {/* PRICE + ADD */}

        <div
          className="
            mt-[18px]
            flex
            items-center
            justify-between
          "
        >
          <span
            className="
              text-[14px]
              font-bold
              tracking-wide
              text-white/90
            "
          >
            {formatPrice(product.price)}
          </span>

          {/* ADD BUTTON */}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAdd(product);
            }}
            className="
              flex
              h-[33px]
              w-[33px]
              items-center
              justify-center
              rounded-full
              bg-white
              text-[#292826]
              transition
              active:scale-90
            "
            aria-label={`Tambah ${product.name}`}
          >
            <Plus
              size={21}
              strokeWidth={2.4}
            />
          </button>
        </div>
      </div>
    </div>
  );
}