import { useState } from "react";
import { Bell, LogOut, Store } from "lucide-react";
import NotificationModal from "../modal/NotificationModal";

export default function Navbar() {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // Sementara jumlah pesanan baru masih manual
  const newOrderCount = 2;

  return (
    <>
      <header className="h-[66px] bg-[#252423] px-5 md:px-8 flex items-center justify-between text-white">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-[#fffdf7] flex items-center justify-center">
            <Store size={17} color="#252423" strokeWidth={2.5} />
          </div>

          <div className="flex items-center gap-2">
            <span className="font-bold text-[18px]">
              Montera
            </span>

            <span className="text-[#777572] text-[13px]">
              Admin
            </span>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-5">

          {/* Notification */}
          <button
            onClick={() => setIsNotificationOpen(true)}
            className="relative text-[#b8b6b1] hover:text-white transition"
          >
            <Bell size={18} />

            {/* Badge */}
            {newOrderCount > 0 && (
              <span className="absolute -top-3 -right-3 min-w-[20px] h-[20px] px-1 rounded-full bg-[#F23B48] text-white text-[11px] font-bold flex items-center justify-center">
                {newOrderCount}
              </span>
            )}
          </button>

          {/* Logout */}
          <button className="flex items-center gap-2 text-[#a9a7a2] text-[13px] hover:text-white transition">
            <LogOut size={17} />
            <span>Keluar</span>
          </button>

        </div>

      </header>

      {/* Notification Modal */}
      <NotificationModal
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />
    </>
  );
}