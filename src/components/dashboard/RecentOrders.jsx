
import {
  Clock3,
  ArrowRight,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

// =========================================================
// FORMAT RUPIAH
// =========================================================

function formatRupiah(value) {
  return `Rp ${Number(
    value || 0
  ).toLocaleString("id-ID")}`;
}

// =========================================================
// FORMAT ORDER TYPE
// =========================================================

function getOrderType(orderType) {
  const value = String(
    orderType || ""
  )
    .trim()
    .toLowerCase();

  if (value === "takeaway") {
    return "Takeaway";
  }

  if (value === "dine-in") {
    return "Dine-in";
  }

  return value || "-";
}

// =========================================================
// FORMAT PAYMENT METHOD
// =========================================================

function getPaymentMethod(method) {
  const value = String(
    method || ""
  )
    .trim()
    .toLowerCase();

  if (
    value === "cash" ||
    value === "tunai"
  ) {
    return "Cash";
  }

  if (
    value === "qris" ||
    value.startsWith("qris_")
  ) {
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
    method || "-"
  )
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) =>
      char.toUpperCase()
    );
}

// =========================================================
// FORMAT DATE & TIME
// =========================================================

function formatDateTime(createdAt) {
  if (!createdAt) {
    return "-";
  }

  const date = new Date(
    createdAt
  );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "-";
  }

  const time =
    date.toLocaleTimeString(
      "id-ID",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );

  return time;
}

// =========================================================
// COMPONENT
// =========================================================

export default function RecentOrders({
  orders = [],
}) {
  const navigate =
    useNavigate();

  const recentOrders =
    Array.isArray(orders)
      ? orders
      : [];

  return (
    <section
      className="
        mb-5
        overflow-hidden
        rounded-2xl
        border
        border-[#e5e1d8]
        bg-[#fffdf5]
      "
    >

      {/* ===================================================
          HEADER
      =================================================== */}

      <div
        className="
          flex
          items-center
          justify-between
          border-b
          border-[#e5e1d8]
          px-4
          py-4
        "
      >

        <div className="flex items-center gap-2">

          <Clock3
            size={15}
            strokeWidth={2}
          />

          <h2 className="text-[13px] font-extrabold">
            PESANAN TERBARU
          </h2>

        </div>

        <button
          type="button"
          onClick={() =>
            navigate("/pesanan")
          }
          className="
            flex
            items-center
            gap-1
            text-[9px]
            text-[#85827c]
            transition-colors
            hover:text-[#292827]
          "
        >
          Lihat Semua

          <ArrowRight
            size={11}
          />
        </button>

      </div>

      {/* ===================================================
          ORDERS
      =================================================== */}

      <div>

        {recentOrders.length > 0 ? (

          recentOrders.map(
            (order, index) => {

              const itemCount =
                Array.isArray(
                  order.items
                )
                  ? order.items.reduce(
                      (
                        total,
                        item
                      ) =>
                        total +
                        Number(
                          item.quantity ||
                            0
                        ),
                      0
                    )
                  : 0;

              return (
                <div
                  key={
                    order.id ??
                    `${order.order_number}-${index}`
                  }
                  className={`
                    px-4
                    py-3
                    ${
                      index !==
                      recentOrders.length - 1
                        ? "border-b border-[#e5e1d8]"
                        : ""
                    }
                  `}
                >

                  <div className="flex items-start justify-between gap-4">

                    {/* =====================================
                        LEFT
                    ===================================== */}

                    <div className="min-w-0">

                      <div className="flex flex-wrap items-center gap-2">

                        <span className="text-[11px] font-extrabold">
                          {order.order_number ||
                            `#${order.id}`}
                        </span>

                        <span
                          className="
                            rounded-full
                            bg-[#ebe9e3]
                            px-2
                            py-0.5
                            text-[8px]
                            text-[#85827c]
                          "
                        >
                          {getOrderType(
                            order.order_type
                          )}
                        </span>

                      </div>

                      <p
                        className="
                          mt-1
                          text-[9px]
                          text-[#99958e]
                        "
                      >
                        {order.customer_name ||
                          "Customer"}
                        {" · "}
                        {itemCount} item
                        {" · "}
                        {formatDateTime(
                          order.created_at
                        )}
                      </p>

                    </div>

                    {/* =====================================
                        RIGHT
                    ===================================== */}

                    <div className="shrink-0 text-right">

                      <p className="text-[11px] font-extrabold">
                        {formatRupiah(
                          order.total_amount
                        )}
                      </p>

                      <p
                        className="
                          mt-1
                          text-[8px]
                          text-[#99958e]
                        "
                      >
                        {getPaymentMethod(
                          order.payment_method
                        )}
                      </p>

                    </div>

                  </div>

                </div>
              );
            }
          )

        ) : (

          <div className="px-4 py-8 text-center">

            <p className="text-[11px] font-semibold text-[#57544F]">
              Belum ada pesanan
            </p>

            <p className="mt-1 text-[9px] text-[#AAA69F]">
              Pesanan terbaru akan muncul di sini.
            </p>

          </div>

        )}

      </div>

    </section>
  );
}

