
import {
  Bell,
  Clock3,
  ExternalLink,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

export default function NotificationModal({
  isOpen,
  onClose,
  notifications = [],
}) {
  const navigate = useNavigate();

  // =========================================================
  // FORMAT DATE / TIME
  // =========================================================

  const formatTime = (createdAt) => {
    if (!createdAt) {
      return "";
    }

    const date = new Date(createdAt);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return date.toLocaleString("id-ID", {
      timeZone: "Asia/Makassar",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  // =========================================================
  // LIHAT SEMUA PESANAN
  // =========================================================

  const handleViewAllOrders = () => {
    onClose();
    navigate("/pesanan");
  };

  // =========================================================
  // CLOSE SAAT KLIK LUAR
  // =========================================================

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  // =========================================================
  // RENDER
  // =========================================================

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-[100]
      "
      onClick={handleOverlayClick}
    >
      {/* ===================================================
          MODAL CARD
      =================================================== */}

      <div
        className="
          absolute
          right-5
          top-[72px]
          w-[350px]
          max-w-[calc(100vw-40px)]
          overflow-hidden
          rounded-2xl
          border
          border-[#3B3937]
          bg-[#242321]
          shadow-2xl
          md:right-25
        "
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-[#3B3937]
            px-5
            py-4
          "
        >
          <div
            className="
              flex
              items-center
              gap-2
            "
          >
            <Bell
              size={16}
              strokeWidth={1.8}
              className="text-[#FFA45B]"
            />

            <h2
              className="
                text-[17px]
                font-bold
                text-[#FFFDF5]
              "
            >
              Notifikasi
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              text-[22px]
              leading-none
              text-[#99958e]
              transition
              hover:text-white
            "
            aria-label="Tutup"
          >
            ×
          </button>
        </div>

        {/* =================================================
            NOTIFICATION LIST
        ================================================= */}

        {notifications.length === 0 ? (
          <div
            className="
              flex
              min-h-[180px]
              flex-col
              items-center
              justify-center
              px-5
              text-center
            "
          >
            <Bell
              size={28}
              strokeWidth={1.5}
              className="
                mb-3
                text-[#77736e]
              "
            />

            <p
              className="
                text-[13px]
                font-semibold
                text-[#FFFDF5]
              "
            >
              Tidak ada notifikasi
            </p>

            <p
              className="
                mt-1
                text-[10px]
                text-[#77736e]
              "
            >
              Semua pesanan terbaru sudah dibaca.
            </p>
          </div>
        ) : (
          <div
            className="
              max-h-[420px]
              overflow-y-auto
            "
          >
            {notifications.map(
              (notification, index) => (
                <button
                  type="button"
                  key={
                    notification.id ??
                    index
                  }
                  onClick={
                    handleViewAllOrders
                  }
                  className="
                    flex
                    w-full
                    items-start
                    justify-between
                    gap-3
                    border-b
                    border-[#3B3937]
                    px-5
                    py-4
                    text-left
                    transition
                    hover:bg-[#2C2A28]
                  "
                >
                  {/* LEFT */}

                  <div
                    className="
                      min-w-0
                      flex-1
                    "
                  >
                    <div
                      className="
                        flex
                        items-center
                        gap-2
                      "
                    >
                      <h3
                        className="
                          truncate
                          text-[14px]
                          font-bold
                          text-[#FFFDF5]
                        "
                      >
                        {notification.title ||
                          "Pesanan Baru"}
                      </h3>

                      {!notification.is_read && (
                        <span
                          className="
                            shrink-0
                            rounded-full
                            bg-[#FFA45B]
                            px-2
                            py-0.5
                            text-[8px]
                            font-bold
                            text-[#292827]
                          "
                        >
                          BARU
                        </span>
                      )}
                    </div>

                    <p
                      className="
                        mt-1
                        line-clamp-2
                        text-[11px]
                        leading-relaxed
                        text-[#aaa7a1]
                      "
                    >
                      {notification.message ||
                        "Ada pesanan baru."}
                    </p>
                  </div>

                  {/* RIGHT */}

                  <div
                    className="
                      flex
                      shrink-0
                      flex-col
                      items-end
                      gap-1
                    "
                  >
                    <Clock3
                      size={13}
                      strokeWidth={1.8}
                      className="text-[#77736e]"
                    />

                    <span
                      className="
                        whitespace-nowrap
                        text-[9px]
                        text-[#77736e]
                      "
                    >
                      {formatTime(
                        notification.created_at
                      )}
                    </span>
                  </div>
                </button>
              )
            )}
          </div>
        )}

        {/* =================================================
            FOOTER
        ================================================= */}

        <button
          type="button"
          onClick={
            handleViewAllOrders
          }
          className="
            flex
            w-full
            items-center
            justify-center
            gap-1
            py-3
            text-[12px]
            font-bold
            text-[#FFA45B]
            transition
            hover:bg-[#2C2A28]
          "
        >
          Lihat Semua Pesanan
          <ExternalLink size={12} />
        </button>
      </div>
    </div>
  );
}

