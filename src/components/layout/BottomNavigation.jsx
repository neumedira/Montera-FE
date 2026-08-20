import {
  Home,
  QrCode,
  Utensils,
  ClipboardList,
  BarChart3,
  Settings,
} from "lucide-react";

import { useLocation, useNavigate } from "react-router-dom";

const menus = [
  {
    label: "Beranda",
    icon: Home,
    path: "/",
  },
  {
    label: "QR",
    icon: QrCode,
    path: "/qr",
  },
  {
    label: "Menu",
    icon: Utensils,
    path: "/menu",
  },
  {
    label: "Pesanan",
    icon: ClipboardList,
    path: "/pesanan",
  },
  {
    label: "Laporan",
    icon: BarChart3,
    path: "/laporan",
  },
  {
    label: "Setelan",
    icon: Settings,
    path: "/settings", // ← ubah dari /setelan
  },
];

export default function BottomNavigation() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#292827] h-[82px] z-50">
      <div className="max-w-[1000px] mx-auto h-full flex items-center justify-around">
        {menus.map((menu) => {
          const Icon = menu.icon;

          // Cek halaman yang sedang aktif
          const isActive = location.pathname === menu.path;

          return (
            <button
              key={menu.label}
              onClick={() => {
                // Izinkan navigasi untuk Beranda, QR, Menu, dan Laporan
                if (
                  menu.path === "/" ||
                  menu.path === "/qr" ||
                  menu.path === "/menu" ||
                  menu.path === "/laporan" ||
                  menu.path === "/settings"
                ) {
                  navigate(menu.path);
                }
              }}
              className={`
                flex
                flex-col
                items-center
                justify-center
                gap-1
                min-w-[55px]
                transition-colors
                ${
                  isActive
                    ? "text-[#f8a35e]"
                    : "text-[#85827c]"
                }
              `}
            >
              <Icon
                size={19}
                strokeWidth={2}
              />

              <span className="text-[10px] font-medium">
                {menu.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}