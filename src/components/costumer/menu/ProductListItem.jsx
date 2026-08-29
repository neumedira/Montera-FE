import { Plus } from "lucide-react";

export default function ProductListItem({
  product,
  onAdd,
  onClick,
}) {
  const formatPrice = (price) => {
    const numericPrice = Number(price) || 0;

    return new Intl.NumberFormat("id-ID", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numericPrice);
  };

  return (
    <div
      onClick={onClick}
      className="w-full cursor-pointer py-[14px]"
    >
      <div className="flex min-h-[135px] w-full items-stretch">

        {/* PRODUCT INFO */}
        <div className="flex min-w-0 flex-1 flex-col justify-center pr-[12px]">

          <h3 className="text-[20px] font-bold leading-[24px] tracking-[-0.5px] text-[#111] dark:text-white">
            {product.name}
          </h3>

          <p className="mt-[6px] line-clamp-2 max-w-[100%] text-[14px] font-normal leading-[19px] text-[#737887] dark:text-[#a1a1aa]">
            {product.description}
          </p>

          <div className="mt-[9px]">
            <p className="text-[17px] font-bold leading-none text-[#111] dark:text-white">
              Rp{formatPrice(product.price)}
            </p>
          </div>

        </div>

        {/* PRODUCT IMAGE */}
        <div className="relative h-[135px] w-[135px] shrink-0 rounded-[12px] border border-[#dedbd2] bg-white">

          <div className="h-full w-full overflow-hidden rounded-[12px]">

            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[#f5f5f5] text-[12px] text-[#999]">
                No Image
              </div>
            )}

            {product.bestseller && (
              <div className="absolute left-[7px] top-[7px] rounded-full bg-white px-[5px] py-[3px] text-[7px] font-black leading-none text-black shadow-sm">
                BEST
                <br />
                SELLER
              </div>
            )}

          </div>

          {/* ADD BUTTON */}
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onAdd(product);
            }}
            className="absolute bottom-[-13px] left-1/2 flex h-[30px] w-[60px] -translate-x-1/2 items-center justify-center rounded-[20px] bg-[#292826] text-white shadow-md transition active:scale-95"
          >
            <Plus
              size={16}
              strokeWidth={2.5}
            />
          </button>

        </div>
      </div>

      {/* DIVIDER */}
      <div className="mt-[24px] h-px w-full bg-[#d8d5cc] dark:bg-[#333]" />

    </div>
  );
}