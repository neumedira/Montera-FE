import { Package } from "lucide-react";

export default function SoldItems({ items }) {

  // Cari jumlah item yang paling banyak terjual
  const maxQuantity = Math.max(
    ...items.map((item) => item.quantity),
    1
  );

  return (
    <section className="bg-[#fffdf5] border border-[#e5e1d8] rounded-2xl p-4 md:p-5">

      {/* Header */}
      <div className="flex items-center gap-2 mb-5">

        <Package
          size={16}
          strokeWidth={2}
        />

        <h2 className="font-extrabold text-[14px]">
          ITEM TERJUAL
        </h2>

      </div>


      {/* Items */}
      <div className="flex flex-col gap-3">

        {items.map((item) => {

          // Progress berdasarkan jumlah item terbanyak
          const progress = (item.quantity / maxQuantity) * 100;

          return (
            <div key={item.name}>

              {/* Information */}
              <div className="flex items-center justify-between mb-1">

                <span className="font-medium text-[13px]">
                  {item.name}
                </span>


                <div className="flex items-center gap-2">

                  <span className="font-extrabold text-[12px]">
                    {item.quantity}x
                  </span>

                  <span className="text-[11px] text-[#99958e] font-medium">
                    Rp {item.price.toLocaleString("id-ID")}
                  </span>

                </div>

              </div>


              {/* Progress */}
              <div className="w-full h-2 bg-[#ebe9e3] rounded-full overflow-hidden">

                <div
                  className="h-full bg-[#292827] rounded-full transition-all duration-300"
                  style={{
                    width: `${progress}%`,
                  }}
                />

              </div>

            </div>
          );
        })}

      </div>

    </section>
  );
}