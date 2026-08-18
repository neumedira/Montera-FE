import {
  UsersRound,
  TrendingUp,
  WalletCards,
  QrCode,
} from "lucide-react";

export default function DashboardSummary() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">

      {/* Total Order */}
      <div className="
        min-h-[105px]
        rounded-2xl
        bg-[#292827]
        text-white
        px-4
        py-4
        relative
        overflow-hidden
      ">

        <div className="text-[10px] font-medium tracking-wide uppercase">
          Total Order
        </div>

        <UsersRound
          size={18}
          strokeWidth={1.8}
          className="absolute right-4 top-4 text-[#aaa7a1]"
        />

        <div className="mt-5 text-[20px] font-extrabold">
          2
        </div>

        <div className="text-[9px] text-[#898681]">
          hari ini
        </div>

      </div>


      {/* Total Transaksi */}
      <div className="
        min-h-[105px]
        rounded-2xl
        bg-[#ed3445]
        text-white
        px-4
        py-4
        relative
        overflow-hidden
      ">

        <div className="text-[10px] font-medium tracking-wide uppercase">
          Total Transaksi
        </div>

        <TrendingUp
          size={18}
          strokeWidth={1.8}
          className="absolute right-4 top-4 text-[#ffc1c7]"
        />

        <div className="mt-5 text-[14px] font-extrabold">
          Rp 250.000
        </div>

        <div className="text-[9px] text-[#f28b96]">
          hari ini
        </div>

      </div>


      {/* Cash */}
      <div className="
        min-h-[105px]
        rounded-2xl
        bg-[#f8a35e]
        text-[#292827]
        px-4
        py-4
        relative
        overflow-hidden
      ">

        <div className="text-[10px] font-medium tracking-wide uppercase">
          Cash
        </div>

        <WalletCards
          size={18}
          strokeWidth={1.8}
          className="absolute right-4 top-4 text-[#72543e]"
        />

        <div className="mt-5 text-[14px] font-extrabold">
          Rp 165.000
        </div>

        <div className="text-[9px] text-[#8d684d]">
          hari ini
        </div>

      </div>


      {/* QRIS */}
      <div className="
        min-h-[105px]
        rounded-2xl
        bg-[#fffdf5]
        border
        border-[#292827]
        text-[#292827]
        px-4
        py-4
        relative
        overflow-hidden
      ">

        <div className="text-[10px] font-medium tracking-wide uppercase">
          QRIS
        </div>

        <QrCode
          size={18}
          strokeWidth={1.8}
          className="absolute right-4 top-4 text-[#85827c]"
        />

        <div className="mt-5 text-[14px] font-extrabold">
          Rp 85.000
        </div>

        <div className="text-[9px] text-[#aaa7a1]">
          hari ini
        </div>

      </div>

    </div>
  );
}