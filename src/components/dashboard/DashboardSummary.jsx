
import {
  UsersRound,
  TrendingUp,
  WalletCards,
  QrCode,
  Building2,
  CreditCard,
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
// NORMALIZE PAYMENT METHOD
// =========================================================

function normalizePaymentMethod(method) {
  return String(method || "")
    .trim()
    .toLowerCase();
}

// =========================================================
// PAYMENT TITLE
// =========================================================

function getPaymentTitle(method) {
  const value =
    normalizePaymentMethod(method);

  // CASH
  if (
    value === "cash" ||
    value === "tunai"
  ) {
    return "Cash";
  }

  // QRIS
  if (
    value === "qris" ||
    value.startsWith("qris_")
  ) {
    return "QRIS";
  }

  // TRANSFER BANK
  if (
    value === "tf_bank" ||
    value.startsWith("tf_bank_")
  ) {
    return "Transfer Bank";
  }

  // E-WALLET
  if (
    value === "ewallet" ||
    value.startsWith("ewallet_")
  ) {
    return "E-Wallet";
  }

  // KARTU
  if (
    value === "kartu" ||
    value.startsWith("kartu_")
  ) {
    return "Kartu";
  }

  // FALLBACK
  return String(
    method || "Payment"
  )
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}

// =========================================================
// PAYMENT ICON
// =========================================================

function getPaymentIcon(method) {
  const value =
    normalizePaymentMethod(method);

  // CASH
  if (
    value === "cash" ||
    value === "tunai"
  ) {
    return (
      <WalletCards
        size={18}
        strokeWidth={1.8}
      />
    );
  }

  // QRIS
  if (
    value === "qris" ||
    value.startsWith("qris_")
  ) {
    return (
      <QrCode
        size={18}
        strokeWidth={1.8}
      />
    );
  }

  // TRANSFER BANK
  if (
    value === "tf_bank" ||
    value.startsWith("tf_bank_")
  ) {
    return (
      <Building2
        size={18}
        strokeWidth={1.8}
      />
    );
  }

  // E-WALLET
  if (
    value === "ewallet" ||
    value.startsWith("ewallet_")
  ) {
    return (
      <Smartphone
        size={18}
        strokeWidth={1.8}
      />
    );
  }

  // KARTU
  if (
    value === "kartu" ||
    value.startsWith("kartu_")
  ) {
    return (
      <CreditCard
        size={18}
        strokeWidth={1.8}
      />
    );
  }

  // DEFAULT
  return (
    <CreditCard
      size={18}
      strokeWidth={1.8}
    />
  );
}

// =========================================================
// PAYMENT CARD STYLE
// =========================================================
//
// Karena metode pembayaran dinamis, kita kasih variasi
// style berdasarkan urutan card.
// =========================================================

function getPaymentCardStyle(index) {
  const styles = [
    {
      wrapper:
        "bg-[#f8a35e] text-[#292827]",

      icon:
        "text-[#72543e]",

      footer:
        "text-[#8d684d]",
    },

    {
      wrapper:
        "bg-[#fffdf5] border border-[#292827] text-[#292827]",

      icon:
        "text-[#85827c]",

      footer:
        "text-[#aaa7a1]",
    },

    {
      wrapper:
        "bg-[#292827] text-white",

      icon:
        "text-[#aaa7a1]",

      footer:
        "text-[#898681]",
    },

    {
      wrapper:
        "bg-[#dedbd3] text-[#292827]",

      icon:
        "text-[#77736b]",

      footer:
        "text-[#8f8b83]",
    },
  ];

  return styles[
    index % styles.length
  ];
}

// =========================================================
// COMPONENT
// =========================================================

export default function DashboardSummary({
  todayOrders = 0,
  todayRevenue = 0,
  paymentMethods = [],
}) {
  // =======================================================
  // NORMALIZE PAYMENT DATA
  // =======================================================

  const normalizedPayments =
    Array.isArray(paymentMethods)
      ? paymentMethods.filter(
          (payment) =>
            payment &&
            payment.payment_method
        )
      : [];

  // =======================================================
  // RENDER
  // =======================================================

  return (
    <div
      className="
        grid
        grid-cols-1
        gap-3
        md:grid-cols-2
        mb-5
      "
    >

      {/* =====================================================
          TOTAL ORDER
      ===================================================== */}

      <div
        className="
          min-h-[105px]
          rounded-2xl
          bg-[#292827]
          text-white
          px-4
          py-4
          relative
          overflow-hidden
        "
      >
        <div
          className="
            text-[10px]
            font-medium
            tracking-wide
            uppercase
          "
        >
          Total Order
        </div>

        <UsersRound
          size={18}
          strokeWidth={1.8}
          className="
            absolute
            right-4
            top-4
            text-[#aaa7a1]
          "
        />

        <div
          className="
            mt-5
            text-[20px]
            font-extrabold
          "
        >
          {todayOrders}
        </div>

        <div
          className="
            text-[9px]
            text-[#898681]
          "
        >
          hari ini
        </div>
      </div>

      {/* =====================================================
          TOTAL TRANSAKSI
      ===================================================== */}

      <div
        className="
          min-h-[105px]
          rounded-2xl
          bg-[#ed3445]
          text-white
          px-4
          py-4
          relative
          overflow-hidden
        "
      >
        <div
          className="
            text-[10px]
            font-medium
            tracking-wide
            uppercase
          "
        >
          Total Transaksi
        </div>

        <TrendingUp
          size={18}
          strokeWidth={1.8}
          className="
            absolute
            right-4
            top-4
            text-[#ffc1c7]
          "
        />

        <div
          className="
            mt-5
            text-[14px]
            font-extrabold
          "
        >
          {formatRupiah(
            todayRevenue
          )}
        </div>

        <div
          className="
            text-[9px]
            text-[#f28b96]
          "
        >
          hari ini
        </div>
      </div>

      {/* =====================================================
          PAYMENT METHODS DINAMIS
      ===================================================== */}

      {normalizedPayments.length >
      0 ? (

        normalizedPayments.map(
          (
            payment,
            index
          ) => {

            const cardStyle =
              getPaymentCardStyle(
                index
              );

            const title =
              getPaymentTitle(
                payment.payment_method
              );

            const amount =
              Number(
                payment.total_amount ||
                  0
              );

            const orderCount =
              Number(
                payment.order_count ||
                  0
              );

            return (
              <div
                key={
                  `${payment.payment_method}-${index}`
                }
                className={`
                  min-h-[105px]
                  rounded-2xl
                  px-4
                  py-4
                  relative
                  overflow-hidden
                  ${cardStyle.wrapper}
                `}
              >

                {/* TITLE */}

                <div
                  className="
                    text-[10px]
                    font-medium
                    tracking-wide
                    uppercase
                  "
                >
                  {title}
                </div>

                {/* ICON */}

                <div
                  className={`
                    absolute
                    right-4
                    top-4
                    ${cardStyle.icon}
                  `}
                >
                  {getPaymentIcon(
                    payment.payment_method
                  )}
                </div>

                {/* TOTAL */}

                <div
                  className="
                    mt-5
                    text-[14px]
                    font-extrabold
                  "
                >
                  {formatRupiah(
                    amount
                  )}
                </div>

                {/* ORDER COUNT */}

                <div
                  className={`
                    text-[9px]
                    ${cardStyle.footer}
                  `}
                >
                  {orderCount} order
                </div>

              </div>
            );
          }
        )

      ) : (

        <div
          className="
            min-h-[105px]
            rounded-2xl
            bg-[#fffdf5]
            border
            border-dashed
            border-[#cfcac0]
            text-[#77736b]
            px-4
            py-4
            relative
            overflow-hidden
            md:col-span-2
          "
        >
          <div
            className="
              text-[10px]
              font-medium
              tracking-wide
              uppercase
            "
          >
            Metode Pembayaran
          </div>

          <CreditCard
            size={18}
            strokeWidth={1.8}
            className="
              absolute
              right-4
              top-4
              text-[#aaa7a1]
            "
          />

          <div
            className="
              mt-5
              text-[13px]
              font-bold
              text-[#57544F]
            "
          >
            Belum ada transaksi hari ini
          </div>

          <div
            className="
              text-[9px]
              text-[#aaa7a1]
            "
          >
            Belum ada metode pembayaran yang digunakan
          </div>
        </div>

      )}

    </div>
  );
}

