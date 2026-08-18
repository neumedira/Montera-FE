export default function NotificationModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const orders = [
    {
      id: "MTR-1001",
      name: "ada",
      type: "Take Away",
      price: "Rp 85.000",
      time: "1 menit lalu",
    },
    {
      id: "MTR-1002",
      name: "haji",
      type: "Dine-in",
      price: "Rp 165.000",
      time: "2 menit lalu",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">

      {/* Notification */}
      <div className="pointer-events-auto absolute top-[72px] right-5 md:right-25 w-[330px] rounded-2xl bg-[#242321] border border-[#3B3937] overflow-hidden shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#3B3937]">
          <h2 className="text-[17px] font-bold text-[#FFFDF5]">
            Pesanan Baru
          </h2>

          <button
            onClick={onClose}
            className="text-[#99958e] hover:text-white text-[22px] leading-none transition"
          >
            ×
          </button>
        </div>

        {/* Orders */}
        {orders.map((order, index) => (
          <div
            key={index}
            className="flex items-center justify-between gap-3 px-5 py-4 border-b border-[#3B3937] hover:bg-[#2C2A28] transition"
          >
            <div className="min-w-0">
              <h3 className="text-[14px] font-bold text-[#FFFDF5] truncate">
                {order.id} · {order.name}
              </h3>

              <p className="text-[12px] text-[#99958e] mt-1">
                {order.type} · {order.price}
              </p>
            </div>

            <span className="shrink-0 text-[11px] text-[#77736e]">
              {order.time}
            </span>
          </div>
        ))}

        {/* Footer */}
        <button
          className="w-full py-3 text-[13px] font-bold text-[#FFA45B] hover:bg-[#2C2A28] transition"
        >
          Lihat Semua Pesanan →
        </button>

      </div>
    </div>
  );
}