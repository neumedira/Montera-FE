import { Bell, X } from "lucide-react";

export default function NewOrderModal({
  isOpen,
  onClose,
  orderId = "MTR-1001",
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none">

      {/* Modal */}
      <div
        className="
          absolute
          top-5
          right-5
          w-[300px]
          bg-[#ed3445]
          text-white
          rounded-2xl
          shadow-[0_10px_35px_rgba(0,0,0,0.18)]
          p-4
          pointer-events-auto
          animate-[slideIn_0.25s_ease-out]
        "
      >

        {/* Close */}
        <button
          onClick={onClose}
          className="
            absolute
            top-3
            right-3
            text-white/80
            hover:text-white
            transition
          "
        >
          <X size={16} />
        </button>


        {/* Content */}
        <div className="flex items-start gap-3">

          {/* Icon */}
          <div
            className="
              w-9
              h-9
              rounded-xl
              bg-white/20
              flex
              items-center
              justify-center
              shrink-0
            "
          >
            <Bell
              size={18}
              strokeWidth={2}
            />
          </div>


          {/* Text */}
          <div className="pr-5">

            <p className="text-[12px] font-extrabold">
              Pesanan Baru!
            </p>

            <p className="text-[10px] text-white/80 mt-1">
              Ada pesanan baru masuk
            </p>

            <p className="text-[10px] font-semibold mt-1">
              {orderId}
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}