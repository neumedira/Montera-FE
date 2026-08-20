import { Plus } from "lucide-react";

function formatPrice(price) {
  return `Rp ${price.toLocaleString("id-ID")}`;
}

export default function ProductCard({ product, onAdd, onClick }) {
  return (
    <div
      onClick={onClick}
      className="relative w-[239px] shrink-0 cursor-pointer overflow-hidden rounded-[17px] border border-[#dedbd5] bg-white"
    >
      {/* Product Image */}
      <div className="relative flex h-[140px] items-center justify-center overflow-hidden bg-white">
        {product.bestseller && (
          <span className="absolute left-[7px] top-[7px] z-10 rounded-full bg-[#e30000] px-2 py-[5px] text-[9px] font-bold tracking-wide text-white">
            BEST SELLER!
          </span>
        )}

        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-contain"
        />
      </div>

      {/* Bottom */}
      <div className="relative bg-[#292826] px-3 pb-3 pt-[12px] text-white">
        <h3 className="text-[15px] font-bold tracking-wide">
          {product.name}
        </h3>

        <div className="mt-5 flex items-center justify-between">
          <span className="text-[15px] font-bold">
            {formatPrice(product.price)}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onAdd(product);
            }}
            className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-white text-[#292826] transition active:scale-90"
          >
            <Plus size={23} strokeWidth={2.2} />
          </button>
        </div>
      </div>
    </div>
  );
}