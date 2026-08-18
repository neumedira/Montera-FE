import {
  Clock3,
  ArrowRight,
} from "lucide-react";

const orders = [
  {
    id: "MTR-1001",
    type: "Takeaway",
    status: "ada · 3 item · 15.22",
    total: 85000,
    method: "QRIS",
  },
  {
    id: "MTR-1001",
    type: "Dine-in",
    status: "hari · 2 item · 15.21",
    total: 165000,
    method: "Cash",
  },
];

export default function RecentOrders() {
  return (
    <section className="
      bg-[#fffdf5]
      border
      border-[#e5e1d8]
      rounded-2xl
      overflow-hidden
      mb-5
    ">

      {/* Header */}
      <div className="
        flex
        items-center
        justify-between
        px-4
        py-4
        border-b
        border-[#e5e1d8]
      ">

        <div className="flex items-center gap-2">

          <Clock3
            size={15}
            strokeWidth={2}
          />

          <h2 className="font-extrabold text-[13px]">
            PESANAN TERBARU
          </h2>

        </div>


        <button className="
          flex
          items-center
          gap-1
          text-[9px]
          text-[#85827c]
          hover:text-[#292827]
        ">
          Lihat Semua
          <ArrowRight size={11} />
        </button>

      </div>


      {/* Orders */}
      <div>

        {orders.map((order, index) => (
          <div
            key={`${order.id}-${index}`}
            className={`
              px-4
              py-3
              ${
                index !== orders.length - 1
                  ? "border-b border-[#e5e1d8]"
                  : ""
              }
            `}
          >

            <div className="flex items-start justify-between">

              {/* Left */}
              <div>

                <div className="flex items-center gap-2">

                  <span className="font-extrabold text-[11px]">
                    {order.id}
                  </span>

                  <span className="
                    px-2
                    py-0.5
                    rounded-full
                    bg-[#ebe9e3]
                    text-[8px]
                    text-[#85827c]
                  ">
                    {order.type}
                  </span>

                </div>

                <p className="text-[9px] text-[#99958e] mt-1">
                  {order.status}
                </p>

              </div>


              {/* Right */}
              <div className="text-right">

                <p className="font-extrabold text-[11px]">
                  Rp {order.total.toLocaleString("id-ID")}
                </p>

                <p className="
                  text-[8px]
                  text-[#99958e]
                  mt-1
                ">
                  {order.method}
                </p>

              </div>

            </div>

          </div>
        ))}

      </div>

    </section>
  );
}