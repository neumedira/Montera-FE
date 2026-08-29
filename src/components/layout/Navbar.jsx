
import { useState } from "react";
import { Bell, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

import NotificationModal from "../modal/NotificationModal";
import logoBlack from "../../assets/logoblack.png";
import api from "../../api/axios";

export default function Navbar() {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const navigate = useNavigate();

  // Sementara jumlah pesanan baru masih manual
  const newOrderCount = 2;

  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    const token = localStorage.getItem("admin_token");

    try {
      // Kalau token masih ada, coba logout ke backend
      if (token) {
        await api.post(
          "/admin/logout",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
    } catch (error) {
      console.error("Logout API gagal:", error);
    } finally {
      // =====================================================
      // PENTING:
      // Hapus token WALaupun API logout gagal.
      // Jadi user tetap benar-benar keluar dari sisi frontend.
      // =====================================================

      localStorage.removeItem("admin_token");

      // Kalau ada data admin lain yang disimpan,
      // bisa ikut dibersihkan di sini.
      // localStorage.removeItem("admin");

      navigate("/login", { replace: true });

      setIsLoggingOut(false);
    }
  };

  return (
    <>
      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <header
        className="
          fixed
          top-0
          left-0
          right-0
          z-50
          flex
          h-[66px]
          items-center
          justify-between
          bg-[#252423]
          px-5
          text-white
          md:px-8
        "
      >
        {/* ===================================================
            LOGO
        =================================================== */}

        <div className="flex items-center gap-2">
          <div
            className="
              flex
              h-7
              w-7
              items-center
              justify-center
              overflow-hidden
              rounded-md
              bg-[#fffdf7]
            "
          >
            <img
              src={logoBlack}
              alt="Montera Logo"
              className="h-[21px] w-[21px] object-contain"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[18px] font-bold">
              Montera
            </span>

            <span className="text-[13px] text-[#777572]">
              Admin
            </span>
          </div>
        </div>

        {/* ===================================================
            RIGHT
        =================================================== */}

        <div className="flex items-center gap-5">

          {/* =================================================
              NOTIFICATION
          ================================================= */}

          <button
            type="button"
            onClick={() => setIsNotificationOpen(true)}
            className="
              relative
              text-[#b8b6b1]
              transition
              hover:text-white
            "
            aria-label="Notifikasi"
          >
            <Bell size={18} />

            {/* Badge */}
            {newOrderCount > 0 && (
              <span
                className="
                  absolute
                  -right-3
                  -top-3
                  flex
                  h-[20px]
                  min-w-[20px]
                  items-center
                  justify-center
                  rounded-full
                  bg-[#F23B48]
                  px-1
                  text-[11px]
                  font-bold
                  text-white
                "
              >
                {newOrderCount}
              </span>
            )}
          </button>

          {/* =================================================
              LOGOUT
          ================================================= */}

          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="
              flex
              items-center
              gap-2
              text-[13px]
              text-[#a9a7a2]
              transition
              hover:text-white
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <LogOut size={17} />

            <span>
              {isLoggingOut ? "Keluar..." : "Keluar"}
            </span>
          </button>

        </div>
      </header>

      {/* =====================================================
          SPACER
      ===================================================== */}

      <div className="h-[66px]" />

      {/* =====================================================
          NOTIFICATION MODAL
      ===================================================== */}

      <NotificationModal
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />
    </>
  );
}

