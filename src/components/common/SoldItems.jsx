
import { Package } from "lucide-react";

// =========================================================
// FORMAT RUPIAH
// =========================================================

function formatRupiah(value) {
  return `Rp ${Number(
    value || 0
  ).toLocaleString("id-ID")}`;
}

// =========================================================
// COMPONENT
// =========================================================

export default function SoldItems({
  items = [],
}) {
  // =========================================================
  // NORMALIZE DATA
  // =========================================================

  const soldItems = Array.isArray(
    items
  )
    ? items.filter(
        (item) => item
      )
    : [];

  // =========================================================
  // MAX QUANTITY
  // =========================================================

  const maxQuantity = Math.max(
    ...soldItems.map(
      (item) =>
        Number(
          item.quantity || 0
        )
    ),
    1
  );

  // =========================================================
  // RENDER
  // =========================================================

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

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div
        className="
          mb-5
          flex
          items-center
          gap-2
        "
      >

        <Package
          size={16}
          strokeWidth={2}
        />

        <h2 className="text-[14px] font-extrabold">
          ITEM TERJUAL
        </h2>

      </div>

      {/* =====================================================
          EMPTY STATE
      ===================================================== */}

      {soldItems.length === 0 ? (

        <div className="py-6 text-center">

          <p className="text-[11px] font-semibold text-[#57544F]">
            Belum ada item terjual
          </p>

          <p className="mt-1 text-[9px] text-[#AAA69F]">
            Data item terjual hari ini akan muncul di sini.
          </p>

        </div>

      ) : (

        <div className="flex flex-col gap-3">

          {soldItems.map(
            (item, index) => {

              const quantity =
                Number(
                  item.quantity || 0
                );

              const price =
                Number(
                  item.price || 0
                );

              const progress =
                (quantity /
                  maxQuantity) *
                100;

              const isBundle =
                item.item_type ===
                "bundle";

              return (
                <div
                  key={
                    `${item.item_type || "menu"}-${item.bundle_id || item.menu_item_id || item.name}-${index}`
                  }
                >

                  {/* =================================================
                      INFORMATION
                  ================================================= */}

                  <div
                    className="
                      mb-1
                      flex
                      items-center
                      justify-between
                      gap-3
                    "
                  >

                    {/* NAME */}

                    <div
                      className="
                        flex
                        min-w-0
                        items-center
                        gap-2
                      "
                    >

                      <span
                        className="
                          truncate
                          text-[13px]
                          font-medium
                        "
                      >
                        {item.name || "Menu"}
                      </span>

                      {/* BUNDLE BADGE */}

                      {isBundle && (
                        <span
                          className="
                            shrink-0
                            rounded-full
                            bg-[#292827]
                            px-2
                            py-0.5
                            text-[7px]
                            font-extrabold
                            uppercase
                            tracking-wide
                            text-white
                          "
                        >
                          Bundle
                        </span>
                      )}

                    </div>

                    {/* QUANTITY + PRICE */}

                    <div
                      className="
                        flex
                        shrink-0
                        items-center
                        gap-2
                      "
                    >

                      <span
                        className="
                          text-[12px]
                          font-extrabold
                        "
                      >
                        {quantity}x
                      </span>

                      <span
                        className="
                          text-[11px]
                          font-medium
                          text-[#99958e]
                        "
                      >
                        {formatRupiah(
                          price
                        )}
                      </span>

                    </div>

                  </div>

                  {/* =================================================
                      PROGRESS
                  ================================================= */}

                  <div
                    className="
                      h-2
                      w-full
                      overflow-hidden
                      rounded-full
                      bg-[#ebe9e3]
                    "
                  >

                    <div
                      className="
                        h-full
                        rounded-full
                        bg-[#292827]
                        transition-all
                        duration-300
                      "
                      style={{
                        width: `${progress}%`,
                      }}
                    />

                  </div>

                </div>
              );
            }
          )}

        </div>

      )}

    </section>
  );
}
