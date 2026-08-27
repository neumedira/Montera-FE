import {
  ChevronDown,
  ChevronUp,
  CreditCard,
  Smartphone,
} from "lucide-react";

function formatRupiah(value) {
  const number = Number(value) || 0;

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(number);
}

export default function OrderCard({
  order,
  open,
  onToggle,
  onDone,
  isDone,
}) {
  // =========================================================
  // ORDER TYPE
  // =========================================================

  const isTakeAway = order.order_type === "takeaway";

  const orderType = isTakeAway
    ? "Take Away"
    : "Dine-In";

  // =========================================================
  // PAYMENT
  // =========================================================

  const isCash = order.payment_method === "cash";

  const paymentMethod = isCash
    ? "Cash"
    : "QRIS";

  // =========================================================
  // TOTAL
  // =========================================================

  const subtotal = Number(order.subtotal) || 0;
  const tax = Number(order.tax_amount) || 0;
  const serviceCharge =
    Number(order.service_charge_amount) || 0;

  const total =
    subtotal +
    tax +
    serviceCharge;

  // =========================================================
  // DATE & TIME
  // =========================================================

  const createdAt = order.created_at
    ? new Date(order.created_at)
    : null;

  const date = createdAt
    ? createdAt.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "-";

  const time = createdAt
    ? createdAt.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "-";

  return (
    <div
      className="
        overflow-hidden
        rounded-2xl
        border border-[#E7E1D5]
        bg-[#FFFCF4]
        shadow-[0_1px_3px_rgba(0,0,0,0.03)]
      "
    >

      {/* ===================================================== */}
      {/* HEADER */}
      {/* ===================================================== */}

      <button
        type="button"
        onClick={onToggle}
        className="
          flex w-full items-center justify-between
          px-4 py-4 text-left
          transition-colors hover:bg-[#FAF7EF]
        "
      >

        {/* LEFT */}

        <div className="flex min-w-0 items-center gap-3">

          {/* TABLE */}

          <div
            className="
              flex h-10 w-10 shrink-0
              items-center justify-center
              rounded-xl bg-[#272624]
              text-[10px]
              font-bold
              text-white
            "
          >
            {order.table?.name || "-"}
          </div>

          {/* CUSTOMER */}

          <div className="min-w-0">

            <div className="flex flex-wrap items-center gap-2">

              <h3 className="text-[15px] font-bold text-[#292825]">
                {order.customer_name || "Customer"}
              </h3>

              <span
                className={`
                  rounded-full
                  px-2.5
                  py-1
                  text-[10px]
                  font-semibold

                  ${
                    isTakeAway
                      ? "bg-[#FFE8D3] text-[#F39A52]"
                      : "bg-[#292825] text-white"
                  }
                `}
              >
                {orderType}
              </span>

            </div>

            {/* INFO */}

            <div
              className="
                mt-1
                flex
                flex-wrap
                items-center
                gap-2
                text-[11px]
                text-[#B1ADA6]
              "
            >

              {/* ORDER NUMBER */}

              <span>
                {order.order_number}
              </span>

              <span>•</span>

              {/* DATE */}

              <span>
                {date}, {time}
              </span>

              <span>•</span>

              {/* PAYMENT */}

              <span
                className={`
                  flex
                  items-center
                  gap-1
                  font-semibold
                  ${
                    isCash
                      ? "text-[#F3A34E]"
                      : "text-[#7D7B76]"
                  }
                `}
              >

                {isCash ? (
                  <CreditCard
                    size={12}
                    strokeWidth={1.8}
                  />
                ) : (
                  <Smartphone
                    size={12}
                    strokeWidth={1.8}
                  />
                )}

                {paymentMethod}

              </span>

            </div>

          </div>

        </div>

        {/* RIGHT */}

        <div className="ml-4 flex shrink-0 items-center gap-4">

          <p className="text-[15px] font-bold text-[#292825]">
            {formatRupiah(total)}
          </p>

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

      {/* ===================================================== */}
      {/* DETAIL */}
      {/* ===================================================== */}

      {open && (
        <div className="border-t border-[#E9E4D9]">

          <div className="px-4 py-4">

            {/* DETAIL TITLE */}

            <p
              className="
                mb-3
                text-[10px]
                font-bold
                uppercase
                tracking-[0.12em]
                text-[#A7A39B]
              "
            >
              Detail Pesanan
            </p>

            {/* ================================================= */}
            {/* ITEMS */}
            {/* ================================================= */}

            <div className="space-y-2">

              {order.items?.length > 0 ? (

                order.items.map((item) => {

                  const itemName =
                    item.menu_item?.name ||
                    "Menu";

                  const quantity =
                    Number(item.quantity) || 0;

                  const price =
                    Number(item.price) || 0;

                  const itemTotal =
                    price * quantity;

                  return (
                    <div
                      key={item.id}
                      className="
                        flex
                        items-center
                        justify-between
                        gap-4
                      "
                    >

                      <p className="text-[14px] font-medium text-[#32302C]">
                        {itemName} ×{quantity}
                      </p>

                      <p className="text-[14px] font-semibold text-[#32302C]">
                        {formatRupiah(itemTotal)}
                      </p>

                    </div>
                  );
                })

              ) : (

                <p className="text-[13px] text-[#A7A39B]">
                  Tidak ada item.
                </p>

              )}

            </div>

            {/* ================================================= */}
            {/* PRICE BREAKDOWN */}
            {/* ================================================= */}

            <div
              className="
                mt-4
                space-y-1
                border-t
                border-[#E9E4D9]
                pt-3
              "
            >

              <div className="flex justify-between">

                <span className="text-[11px] text-[#A7A39B]">
                  Subtotal
                </span>

                <span className="text-[11px] font-medium text-[#57544F]">
                  {formatRupiah(subtotal)}
                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-[11px] text-[#A7A39B]">
                  Pajak
                </span>

                <span className="text-[11px] font-medium text-[#57544F]">
                  {formatRupiah(tax)}
                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-[11px] text-[#A7A39B]">
                  Service Charge
                </span>

                <span className="text-[11px] font-medium text-[#57544F]">
                  {formatRupiah(serviceCharge)}
                </span>

              </div>

            </div>

            {/* ================================================= */}
            {/* TOTAL */}
            {/* ================================================= */}

            <div
              className="
                mt-4
                flex
                items-center
                justify-between
                rounded-xl
                bg-[#292825]
                px-4
                py-3
              "
            >

              {/* TOTAL */}

              <div>

                <p
                  className="
                    text-[9px]
                    uppercase
                    tracking-[0.12em]
                    text-[#9D9A93]
                  "
                >
                  Total
                </p>

                <p className="mt-0.5 text-[17px] font-bold text-white">
                  {formatRupiah(total)}
                </p>

              </div>

              {/* ================================================= */}
              {/* DONE / CLOSED */}
              {/* ================================================= */}

              {isDone ? (

                <span
                  className="
                    rounded-full
                    bg-[#5A5854]
                    px-4
                    py-1.5
                    text-[11px]
                    font-bold
                    text-white
                  "
                >
                  Closed
                </span>

              ) : (

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDone(order.id);
                  }}
                  className="
                    rounded-full
                    bg-[#F6A257]
                    px-4
                    py-1.5
                    text-[11px]
                    font-bold
                    text-[#282621]
                    transition
                    duration-200
                    hover:bg-[#F7AE68]
                    active:scale-95
                  "
                >
                  Done
                </button>

              )}

            </div>

          </div>

        </div>
      )}

    </div>
  );
}