export default function OverallSummary() {
  return (
    <section className="
      bg-[#292827]
      rounded-2xl
      px-5
      py-4
      text-white
    ">

      {/* Title */}
      <div className="
        text-[10px]
        font-extrabold
        text-[#aaa7a1]
        tracking-wide
        mb-3
      ">
        TOTAL KESELURUHAN
      </div>


      {/* Statistics */}
      <div className="
        grid
        grid-cols-3
        text-center
      ">

        {/* Orders */}
        <div>

          <div className="text-[17px] font-extrabold">
            2
          </div>

          <div className="
            text-[8px]
            text-[#898681]
            uppercase
          ">
            Pesanan
          </div>

        </div>


        {/* Revenue */}
        <div>

          <div className="text-[17px] font-extrabold">
            250K
          </div>

          <div className="
            text-[8px]
            text-[#898681]
            uppercase
          ">
            Revenue
          </div>

        </div>


        {/* Menu */}
        <div>

          <div className="text-[17px] font-extrabold">
            10
          </div>

          <div className="
            text-[8px]
            text-[#898681]
            uppercase
          ">
            Menu Aktif
          </div>

        </div>

      </div>

    </section>
  );
}