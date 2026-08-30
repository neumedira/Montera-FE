
function formatRevenueCompact(value) {
  const number = Number(value || 0);

  if (number >= 1000000000) {
    return `${(number / 1000000000).toFixed(1)}B`;
  }

  if (number >= 1000000) {
    return `${(number / 1000000).toFixed(1)}M`;
  }

  if (number >= 1000) {
    return `${Math.round(number / 1000)}K`;
  }

  return String(number);
}

export default function OverallSummary({
  totalOrders = 0,
  totalRevenue = 0,
  activeMenuCount = 0,
}) {
  return (
    <section
      className="
        rounded-2xl
        bg-[#292827]
        px-5
        py-4
        text-white
      "
    >

      {/* =====================================================
          TITLE
      ===================================================== */}

      <div
        className="
          mb-3
          text-[10px]
          font-extrabold
          tracking-wide
          text-[#aaa7a1]
        "
      >
        TOTAL KESELURUHAN
      </div>

      {/* =====================================================
          STATISTICS
      ===================================================== */}

      <div
        className="
          grid
          grid-cols-3
          text-center
        "
      >

        {/* ===================================================
            ORDERS
        =================================================== */}

        <div>
          <div className="text-[17px] font-extrabold">
            {totalOrders}
          </div>

          <div
            className="
              text-[8px]
              uppercase
              text-[#898681]
            "
          >
            Pesanan
          </div>
        </div>

        {/* ===================================================
            REVENUE
        =================================================== */}

        <div>
          <div className="text-[17px] font-extrabold">
            {formatRevenueCompact(
              totalRevenue
            )}
          </div>

          <div
            className="
              text-[8px]
              uppercase
              text-[#898681]
            "
          >
            Revenue
          </div>
        </div>

        {/* ===================================================
            ACTIVE PRODUCTS
        =================================================== */}

        <div>
          <div className="text-[17px] font-extrabold">
            {activeMenuCount}
          </div>

          <div
            className="
              text-[8px]
              uppercase
              text-[#898681]
            "
          >
            Produk Aktif
          </div>
        </div>

      </div>

    </section>
  );
}
