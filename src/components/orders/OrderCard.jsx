
import {
  ChevronDown,
  ChevronUp,
  CreditCard,
  Smartphone,
  Building2,
  WalletCards,
} from "lucide-react";

// =========================================================
// FORMAT RUPIAH
// =========================================================

function formatRupiah(value) {
  const number = Number(value) || 0;

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(number);
}

// =========================================================
// NORMALIZE PAYMENT METHOD
// =========================================================

function normalizePaymentMethod(method) {
  return String(method || "")
    .trim()
    .toLowerCase();
}

// =========================================================
// PAYMENT LABEL
// =========================================================

function getPaymentLabel(method) {
  const value =
    normalizePaymentMethod(method);

  if (
    value === "cash" ||
    value === "tunai"
  ) {
    return "Cash";
  }

  if (value === "qris") {
    return "QRIS";
  }

  if (
    value === "tf_bank" ||
    value.startsWith("tf_bank_")
  ) {
    return "Transfer Bank";
  }

  if (
    value === "ewallet" ||
    value.startsWith("ewallet_")
  ) {
    return "E-Wallet";
  }

  if (
    value === "kartu" ||
    value.startsWith("kartu_")
  ) {
    return "Kartu";
  }

  return String(
    method || "Payment"
  );
}

// =========================================================
// PAYMENT ICON
// =========================================================

function getPaymentIcon(method) {
  const value =
    normalizePaymentMethod(method);

  if (
    value === "cash" ||
    value === "tunai"
  ) {
    return (
      <CreditCard
        size={12}
        strokeWidth={1.8}
      />
    );
  }

  if (value === "qris") {
    return (
      <Smartphone
        size={12}
        strokeWidth={1.8}
      />
    );
  }

  if (
    value === "tf_bank" ||
    value.startsWith("tf_bank_")
  ) {
    return (
      <Building2
        size={12}
        strokeWidth={1.8}
      />
    );
  }

  if (
    value === "ewallet" ||
    value.startsWith("ewallet_")
  ) {
    return (
      <WalletCards
        size={12}
        strokeWidth={1.8}
      />
    );
  }

  return (
    <CreditCard
      size={12}
      strokeWidth={1.8}
    />
  );
}

// =========================================================
// COMPONENT
// =========================================================

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

  const isTakeAway =
    order.order_type ===
    "takeaway";

  const orderType =
    isTakeAway
      ? "Take Away"
      : "Dine-In";

  // =========================================================
  // TABLE
  // =========================================================

  const tableNumber =
    order.table?.table_number ??
    order.table_number ??
    null;

  // =========================================================
  // PAYMENT
  // =========================================================

  const paymentMethod =
    getPaymentLabel(
      order.payment_method
    );

  const normalizedPaymentMethod =
    normalizePaymentMethod(
      order.payment_method
    );

  const isCash =
    normalizedPaymentMethod ===
      "cash" ||
    normalizedPaymentMethod ===
      "tunai";

  // =========================================================
  // TOTAL
  // =========================================================

  const subtotal =
    Number(order.subtotal) || 0;

  const tax =
    Number(order.tax_amount) || 0;

  const serviceCharge =
    Number(
      order.service_charge_amount
    ) || 0;

  const backendTotal =
    Number(
      order.total_amount
    ) || 0;

  const total =
    backendTotal > 0
      ? backendTotal
      : subtotal +
        tax +
        serviceCharge;

  // =========================================================
  // DATE & TIME
  // =========================================================

  const createdAt =
    order.created_at
      ? new Date(order.created_at)
      : null;

  const date =
    createdAt
      ? createdAt.toLocaleDateString(
          "id-ID",
          {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }
        )
      : "-";

  const time =
    createdAt
      ? createdAt.toLocaleTimeString(
          "id-ID",
          {
            hour: "2-digit",
            minute: "2-digit",
          }
        )
      : "-";

  // =========================================================
  // STATUS
  // =========================================================

  const backendStatus =
    String(
      order.status || ""
    )
      .trim()
      .toLowerCase();

  const closedByBackend =
    backendStatus === "done" ||
    backendStatus === "completed" ||
    backendStatus === "closed";

  const closed =
    Boolean(isDone) ||
    closedByBackend;

  // =========================================================
  // GLOBAL ORDER NOTE
  // =========================================================

  const hasOrderNote =
    Boolean(
      String(
        order.notes || ""
      ).trim()
    );

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div
      className="
        overflow-hidden
        rounded-2xl
        border
        border-[#E7E1D5]
        bg-[#FFFCF4]
        shadow-[0_1px_3px_rgba(0,0,0,0.03)]
      "
    >

      {/* =====================================================
          HEADER
      ===================================================== */}

      <button
        type="button"
        onClick={onToggle}
        className="
          flex
          w-full
          items-center
          justify-between
          px-4
          py-4
          text-left
          transition-colors
          hover:bg-[#FAF7EF]
        "
      >

        {/* ===================================================
            LEFT
        =================================================== */}

        <div
          className="
            flex
            min-w-0
            items-center
            gap-3
          "
        >

          {/* TABLE */}

          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-[#272624]
              text-[10px]
              font-bold
              text-white
            "
          >
            {tableNumber
              ? `T${tableNumber}`
              : "TA"}
          </div>

          {/* CUSTOMER */}

          <div
            className="
              min-w-0
            "
          >

            <div
              className="
                flex
                flex-wrap
                items-center
                gap-2
              "
            >

              <h3
                className="
                  text-[15px]
                  font-bold
                  text-[#292825]
                "
              >
                {order.customer_name ||
                  "Customer"}
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

              <span>
                {order.order_number ||
                  "-"}
              </span>

              <span>
                •
              </span>

              <span>
                {date}, {time}
              </span>

              <span>
                •
              </span>

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
                {getPaymentIcon(
                  order.payment_method
                )}

                {paymentMethod}
              </span>

            </div>

          </div>
        </div>

        {/* ===================================================
            RIGHT
        =================================================== */}

        <div
          className="
            ml-4
            flex
            shrink-0
            items-center
            gap-4
          "
        >

          <p
            className="
              text-[15px]
              font-bold
              text-[#292825]
            "
          >
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

      {/* =====================================================
          DETAIL
      ===================================================== */}

      {open && (
        <div
          className="
            border-t
            border-[#E9E4D9]
          "
        >

          <div
            className="
              px-4
              py-4
            "
          >

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

            {/* =================================================
                TABLE INFO
            ================================================= */}

            {tableNumber && (
              <div
                className="
                  mb-4
                  flex
                  items-center
                  justify-between
                  rounded-xl
                  bg-[#F5F1E8]
                  px-3
                  py-2.5
                "
              >

                <span
                  className="
                    text-[11px]
                    font-semibold
                    text-[#8F8A80]
                  "
                >
                  Nomor Meja
                </span>

                <span
                  className="
                    text-[12px]
                    font-bold
                    text-[#292825]
                  "
                >
                  Meja {tableNumber}
                </span>

              </div>
            )}

            {/* =================================================
                ITEMS
            ================================================= */}

            <div
              className="
                space-y-4
              "
            >

              {order.items?.length > 0 ? (

                order.items.map(
                  (item, index) => {

                    const itemName =
                      item.item_name ||
                      item.menu_item?.name ||
                      "Menu";

                    const quantity =
                      Number(
                        item.quantity
                      ) || 0;

                    const unitPrice =
                      Number(
                        item.unit_price ??
                        item.price ??
                        0
                      );

                    const itemSubtotal =
                      Number(
                        item.subtotal
                      ) ||
                      unitPrice *
                        quantity;

                    // =================================================
                    // ADDONS
                    // =================================================

                    const addons =
                      Array.isArray(
                        item.addons
                      )
                        ? item.addons
                        : [];

                    return (
                      <div
                        key={
                          item.id ??
                          `${itemName}-${index}`
                        }
                        className="
                          rounded-xl
                          bg-[#F9F6EF]
                          px-3
                          py-3
                        "
                      >

                        {/* ================================
                            ITEM HEADER
                        ================================= */}

                        <div
                          className="
                            flex
                            items-start
                            justify-between
                            gap-4
                          "
                        >

                          <div
                            className="
                              min-w-0
                            "
                          >

                            <p
                              className="
                                text-[14px]
                                font-semibold
                                text-[#32302C]
                              "
                            >
                              {itemName} ×
                              {quantity}
                            </p>

                            <p
                              className="
                                mt-0.5
                                text-[10px]
                                text-[#A7A39B]
                              "
                            >
                              {formatRupiah(
                                unitPrice
                              )} / item
                            </p>

                          </div>

                          <p
                            className="
                              shrink-0
                              text-[14px]
                              font-semibold
                              text-[#32302C]
                            "
                          >
                            {formatRupiah(
                              itemSubtotal
                            )}
                          </p>

                        </div>

                        {/* ================================
                            ADDONS
                        ================================= */}

                        {addons.length > 0 && (
                          <div
                            className="
                              mt-3
                              border-t
                              border-[#E8E2D7]
                              pt-3
                            "
                          >

                            <p
                              className="
                                mb-2
                                text-[9px]
                                font-bold
                                uppercase
                                tracking-[0.12em]
                                text-[#A7A39B]
                              "
                            >
                              Add On
                            </p>

                            <div
                              className="
                                space-y-1.5
                              "
                            >

                              {addons.map(
                                (
                                  addon,
                                  addonIndex
                                ) => {

                                  const addonName =
                                    addon.addon_name ||
                                    addon.addon?.name ||
                                    "Add On";

                                  const addonPrice =
                                    Number(
                                      addon.addon_price ??
                                      addon.addon?.price ??
                                      0
                                    );

                                  return (
                                    <div
                                      key={
                                        addon.id ??
                                        `${item.id}-addon-${addonIndex}`
                                      }
                                      className="
                                        flex
                                        items-center
                                        justify-between
                                        gap-3
                                        text-[11px]
                                      "
                                    >

                                      <span
                                        className="
                                          min-w-0
                                          text-[#6E6A63]
                                        "
                                      >
                                        +{" "}
                                        {addonName}
                                      </span>

                                      <span
                                        className="
                                          shrink-0
                                          font-medium
                                          text-[#8D8981]
                                        "
                                      >
                                        {formatRupiah(
                                          addonPrice
                                        )}
                                      </span>

                                    </div>
                                  );
                                }
                              )}

                            </div>

                          </div>
                        )}

                        {/* ================================
                            ITEM NOTE
                        ================================= */}

                        {String(
                          item.notes || ""
                        ).trim() && (
                          <div
                            className="
                              mt-3
                              rounded-lg
                              bg-[#F1ECE2]
                              px-3
                              py-2.5
                            "
                          >

                            <p
                              className="
                                text-[9px]
                                font-bold
                                uppercase
                                tracking-[0.12em]
                                text-[#A7A39B]
                              "
                            >
                              Catatan
                            </p>

                            <p
                              className="
                                mt-1
                                text-[11px]
                                leading-relaxed
                                text-[#5F5B54]
                              "
                            >
                              {item.notes}
                            </p>

                          </div>
                        )}

                      </div>
                    );
                  }
                )

              ) : (

                <p
                  className="
                    text-[13px]
                    text-[#A7A39B]
                  "
                >
                  Tidak ada item.
                </p>

              )}

            </div>

            {/* =================================================
                GLOBAL ORDER NOTE
            ================================================= */}

            {hasOrderNote && (
              <div
                className="
                  mt-4
                  rounded-xl
                  border
                  border-[#E5D8C5]
                  bg-[#FFF5E7]
                  px-3
                  py-3
                "
              >

                <p
                  className="
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-[0.12em]
                    text-[#C08345]
                  "
                >
                  Catatan Pesanan
                </p>

                <p
                  className="
                    mt-1
                    text-[12px]
                    leading-relaxed
                    text-[#5F574E]
                  "
                >
                  {order.notes}
                </p>

              </div>
            )}

            {/* =================================================
                PRICE BREAKDOWN
            ================================================= */}

            <div
              className="
                mt-4
                space-y-1
                border-t
                border-[#E9E4D9]
                pt-3
              "
            >

              {/* SUBTOTAL */}

              <div
                className="
                  flex
                  justify-between
                "
              >

                <span
                  className="
                    text-[11px]
                    text-[#A7A39B]
                  "
                >
                  Subtotal
                </span>

                <span
                  className="
                    text-[11px]
                    font-medium
                    text-[#57544F]
                  "
                >
                  {formatRupiah(
                    subtotal
                  )}
                </span>

              </div>

              {/* TAX */}

              <div
                className="
                  flex
                  justify-between
                "
              >

                <span
                  className="
                    text-[11px]
                    text-[#A7A39B]
                  "
                >
                  Pajak
                </span>

                <span
                  className="
                    text-[11px]
                    font-medium
                    text-[#57544F]
                  "
                >
                  {formatRupiah(
                    tax
                  )}
                </span>

              </div>

              {/* SERVICE CHARGE */}

              <div
                className="
                  flex
                  justify-between
                "
              >

                <span
                  className="
                    text-[11px]
                    text-[#A7A39B]
                  "
                >
                  Service Charge
                </span>

                <span
                  className="
                    text-[11px]
                    font-medium
                    text-[#57544F]
                  "
                >
                  {formatRupiah(
                    serviceCharge
                  )}
                </span>

              </div>

            </div>

            {/* =================================================
                TOTAL + DONE
            ================================================= */}

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

                <p
                  className="
                    mt-0.5
                    text-[17px]
                    font-bold
                    text-white
                  "
                >
                  {formatRupiah(
                    total
                  )}
                </p>

              </div>

              {/* DONE / CLOSED */}

              {closed ? (

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

                    if (onDone) {
                      onDone(
                        order.id
                      );
                    }
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

