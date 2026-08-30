
import {
  CreditCard,
  QrCode,
  WalletCards,
  Building2,
  Smartphone,
} from "lucide-react";

// =========================================================
// FORMAT RUPIAH
// =========================================================

function formatRupiah(value) {
  return `Rp ${Number(
    value || 0
  ).toLocaleString("id-ID")}`;
}

// =========================================================
// NORMALIZE METHOD
// =========================================================

function normalizeMethod(method) {
  return String(method || "")
    .trim()
    .toLowerCase();
}

// =========================================================
// METHOD TITLE
// =========================================================

function getMethodTitle(method) {
  const value =
    normalizeMethod(method);

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
    method || "Payment"
  )
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) =>
      char.toUpperCase()
    );
}

// =========================================================
// METHOD ICON
// =========================================================

function getMethodIcon(method) {
  const value =
    normalizeMethod(method);

  if (
    value === "cash" ||
    value === "tunai"
  ) {
    return (
      <WalletCards
        size={15}
        strokeWidth={1.8}
      />
    );
  }

  if (
    value === "qris" ||
    value.startsWith("qris_")
  ) {
    return (
      <QrCode
        size={15}
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
        size={15}
        strokeWidth={1.8}
      />
    );
  }

  if (
    value === "ewallet" ||
    value.startsWith("ewallet_")
  ) {
    return (
      <Smartphone
        size={15}
        strokeWidth={1.8}
      />
    );
  }

  return (
    <CreditCard
      size={15}
      strokeWidth={1.8}
    />
  );
}

// =========================================================
// DONUT COLORS
// =========================================================

const donutSegments = [
  "#f8a35e",
  "#292827",
  "#ed3445",
  "#8f8a82",
  "#bcb7ae",
  "#64615c",
];

// =========================================================
// COMPONENT
// =========================================================

export default function PaymentMethod({
  paymentMethods = [],
}) {
  // =======================================================
  // NORMALIZE DATA
  // =======================================================

  const methods = Array.isArray(
    paymentMethods
  )
    ? paymentMethods.filter(
        (item) =>
          item &&
          item.payment_method
      )
    : [];

  // =======================================================
  // TOTAL
  // =======================================================

  const totalAmount =
    methods.reduce(
      (sum, item) =>
        sum +
        Number(
          item.total_amount || 0
        ),
      0
    );

  // =======================================================
  // DONUT SEGMENTS
  // =======================================================

  let accumulatedDegrees = 0;

  const segments = methods.map(
    (item, index) => {
      const amount =
        Number(
          item.total_amount || 0
        );

      const percentage =
        totalAmount > 0
          ? amount /
            totalAmount
          : 0;

      const degrees =
        percentage * 360;

      const start =
        accumulatedDegrees;

      const end =
        accumulatedDegrees +
        degrees;

      accumulatedDegrees = end;

      return {
        ...item,
        amount,
        percentage,
        start,
        end,
        color:
          donutSegments[
            index %
              donutSegments.length
          ],
      };
    }
  );

  // =======================================================
  // DONUT BACKGROUND
  // =======================================================

  const donutBackground =
    segments.length > 0
      ? `conic-gradient(
          ${segments
            .map(
              (segment) =>
                `${segment.color} ${segment.start}deg ${segment.end}deg`
            )
            .join(", ")}
        )`
      : "#dedbd3";

  // =======================================================
  // RENDER
  // =======================================================

  return (
    <section
      className="
        rounded-2xl
        border
        border-[#e5e1d8]
        bg-[#fffdf5]
        p-4
        md:p-5
      "
    >
      {/* HEADER */}

      <div className="mb-5 flex items-center gap-2">
        <h2 className="text-[14px] font-extrabold">
          METODE PEMBAYARAN
        </h2>
      </div>

      {/* EMPTY */}

      {segments.length === 0 ? (
        <div
          className="
            flex
            min-h-[110px]
            items-center
            justify-center
            text-center
          "
        >
          <p className="text-[12px] text-[#aaa7a1]">
            Belum ada transaksi pada periode ini.
          </p>
        </div>
      ) : (
        <div className="flex items-center gap-7">

          {/* DONUT */}

          <div
            className="
              relative
              h-[110px]
              w-[110px]
              shrink-0
            "
          >
            <div
              className="
                h-full
                w-full
                rounded-full
              "
              style={{
                background:
                  donutBackground,
              }}
            />

            {/* CENTER */}

            <div
              className="
                absolute
                inset-[20px]
                flex
                items-center
                justify-center
                rounded-full
                bg-[#fffdf5]
              "
            >
              <div className="text-center">

                <p className="text-[9px] font-medium text-[#aaa7a1]">
                  Total
                </p>

                <p className="text-[11px] font-extrabold text-[#292827]">
                  {formatRupiah(
                    totalAmount
                  ).replace(
                    "Rp ",
                    "Rp"
                  )}
                </p>

              </div>
            </div>
          </div>

          {/* LEGEND */}

          <div
            className="
              flex
              min-w-0
              flex-1
              flex-col
              gap-3
            "
          >
            {segments.map(
              (
                method,
                index
              ) => {

                const title =
                  getMethodTitle(
                    method.payment_method
                  );

                const orderCount =
                  Number(
                    method.order_count ||
                      0
                  );

                return (
                  <div
                    key={`${method.payment_method}-${index}`}
                  >

                    <div
                      className="
                        flex
                        items-center
                        gap-2
                        text-[12px]
                        text-[#6e6b66]
                      "
                    >

                      <span
                        className="
                          flex
                          h-2.5
                          w-2.5
                          shrink-0
                          rounded-full
                        "
                        style={{
                          backgroundColor:
                            method.color,
                        }}
                      />

                      <span className="flex items-center gap-1.5">
                        {getMethodIcon(
                          method.payment_method
                        )}

                        {title}
                      </span>

                    </div>

                    <div className="ml-[18px] mt-1">

                      <div className="text-[14px] font-extrabold">
                        {formatRupiah(
                          method.amount
                        )}
                      </div>

                      <div className="mt-0.5 text-[9px] text-[#aaa7a1]">
                        {orderCount} order
                        {" · "}
                        {Math.round(
                          method.percentage *
                            100
                        )}
                        %
                      </div>

                    </div>

                  </div>
                );
              }
            )}
          </div>

        </div>
      )}
    </section>
  );
}

