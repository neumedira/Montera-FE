import {
  ChevronDown,
  ChevronUp,
  CreditCard,
  Smartphone,
} from "lucide-react";

function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function OrderCard({ order, open, onToggle }) {
  const isTakeAway = order.type === "Take Away";
  const isCash = order.payment === "Cash";

  return (
    <div
      className="
        overflow-hidden rounded-2xl
        border border-[#E7E1D5]
        bg-[#FFFCF4]
        shadow-[0_1px_3px_rgba(0,0,0,0.03)]
      "
    >
      {/* Header */}
      <button
        onClick={onToggle}
        className="
          flex w-full items-center justify-between
          px-4 py-4 text-left
          transition-colors hover:bg-[#FAF7EF]
        "
      >
        {/* Left */}
        <div className="flex min-w-0 items-center gap-3">
          {/* Table Number */}
          <div
            className="
              flex h-10 w-10 shrink-0 items-center justify-center
              rounded-xl bg-[#272624]
              text-[10px] font-bold text-white
            "
          >
            1001
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-[15px] font-bold text-[#292825]">
                {order.customer}
              </h3>

              <span
                className={`
                  rounded-full px-2.5 py-1
                  text-[10px] font-semibold
                  ${
                    isTakeAway
                      ? "bg-[#FFE8D3] text-[#F39A52]"
                      : "bg-[#292825] text-white"
                  }
                `}
              >
                {order.type}
              </span>
            </div>

            <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-[#B1ADA6]">
              <span>{order.orderId}</span>
              <span>•</span>
              <span>
                {order.date}, {order.time}
              </span>
              <span>•</span>

              <span
                className={`flex items-center gap-1 font-semibold ${
                  isCash ? "text-[#F3A34E]" : "text-[#7D7B76]"
                }`}
              >
                {isCash ? (
                  <CreditCard size={12} strokeWidth={1.8} />
                ) : (
                  <Smartphone size={12} strokeWidth={1.8} />
                )}

                {order.payment}
              </span>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="ml-4 flex shrink-0 items-center gap-4">
          <div className="text-right">
            <p className="text-[15px] font-bold text-[#292825]">
              {formatRupiah(order.total)}
            </p>
          </div>

          {open ? (
            <ChevronUp
              size={17}
              strokeWidth={1.5}
              className="text-[#A7A39B]"
            />
          ) : (
            <ChevronDown
              size={17}
              strokeWidth={1.5}
              className="text-[#A7A39B]"
            />
          )}
        </div>
      </button>

      {/* Detail */}
      {open && (
        <div className="border-t border-[#E9E4D9]">
          <div className="px-4 py-4">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.12em] text-[#A7A39B]">
              Detail Pesanan
            </p>

            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-4"
                >
                  <p className="text-[14px] font-medium text-[#32302C]">
                    {item.name} ×{item.qty}
                  </p>

                  <p className="text-[14px] font-semibold text-[#32302C]">
                    {formatRupiah(item.price)}
                  </p>
                </div>
              ))}
            </div>

            {/* Total */}
            <div
              className="
                mt-4 flex items-center justify-between
                rounded-xl bg-[#292825] px-4 py-3
              "
            >
              <div>
                <p className="text-[9px] uppercase tracking-[0.12em] text-[#9D9A93]">
                  Total
                </p>

                <p className="mt-0.5 text-[17px] font-bold text-white">
                  {formatRupiah(order.total)}
                </p>
              </div>

              <span
                className={`
                  rounded-full px-4 py-1.5
                  text-[11px] font-bold
                  ${
                    isCash
                      ? "bg-[#F6A257] text-[#282621]"
                      : "bg-[#45433F] text-white"
                  }
                `}
              >
                {order.paymentProvider}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}