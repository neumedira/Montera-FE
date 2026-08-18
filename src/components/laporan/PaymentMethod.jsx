import { CreditCard } from "lucide-react";

export default function PaymentMethod({ cash, qris }) {
  const total = cash + qris;

  const cashPercentage = total > 0
    ? (cash / total) * 100
    : 0;

  const cashDegrees = cashPercentage * 3.6;

  return (
    <section className="bg-[#fffdf5] border border-[#e5e1d8] rounded-2xl p-4 md:p-5">

      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <h2 className="font-extrabold text-[14px]">
          METODE PEMBAYARAN
        </h2>
      </div>


      <div className="flex items-center gap-7">

        {/* Donut */}
        <div className="relative w-[110px] h-[110px] shrink-0">

          <div
            className="w-full h-full rounded-full"
            style={{
              background: `conic-gradient(
                from 0deg,
                #f8a35e 0deg ${cashDegrees}deg,
                #292827 ${cashDegrees}deg 360deg
              )`,
            }}
          />

          {/* Center */}
          <div className="absolute inset-[20px] bg-[#fffdf5] rounded-full" />

        </div>


        {/* Legend */}
        <div className="flex flex-col gap-3">

          {/* Cash */}
          <div>
            <div className="flex items-center gap-2 text-[12px] text-[#6e6b66]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#f8a35e]" />
              <span>Cash</span>
            </div>

            <div className="font-extrabold text-[14px] ml-[18px] mt-1">
              Rp {cash.toLocaleString("id-ID")}
            </div>
          </div>


          {/* QR */}
          <div>
            <div className="flex items-center gap-2 text-[12px] text-[#6e6b66]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#292827]" />
              <span>BNI QR</span>
            </div>

            <div className="font-extrabold text-[14px] ml-[18px] mt-1">
              Rp {qris.toLocaleString("id-ID")}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}