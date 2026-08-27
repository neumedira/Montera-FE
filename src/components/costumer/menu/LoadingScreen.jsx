import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import loadingLogo from "../../../assets/loading-montera.png";
import loadingFood from "../../../assets/loading-food.png";

export default function LoadingScreen() {
  const navigate = useNavigate();
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    // Mulai menghilang sedikit sebelum pindah halaman
    const closeTimer = setTimeout(() => {
      setClosing(true);
    }, 1500);

    // Setelah fade-out hampir selesai, pindah ke Menu
    const navigateTimer = setTimeout(() => {
      navigate("/menu");
    }, 1800);

    return () => {
      clearTimeout(closeTimer);
      clearTimeout(navigateTimer);
    };
  }, [navigate]);

  return (
    <main
      className={`fixed inset-0 z-[9999] flex min-h-screen items-center justify-center overflow-hidden bg-[#fffcf4] ${
        closing ? "animate-loading-exit pointer-events-none" : ""
      }`}
    >
      {/* =========================================
          BACKGROUND / OVERLAY
      ========================================= */}
      <div className="absolute inset-0 bg-black/25 backdrop-blur-[2px]" />

      {/* =========================================
          ORNAMEN MAKANAN
          Berputar mengelilingi logo
      ========================================= */}
      <div className="absolute left-1/2 top-1/2 z-10 h-[310px] w-[310px] -translate-x-1/2 -translate-y-1/2">
        <img
          src={loadingFood}
          alt=""
          className="h-full w-full object-contain animate-loading-food"
        />
      </div>

      {/* =========================================
          LOGO MONTERA
          Tetap di tengah
      ========================================= */}
      <img
        src={loadingLogo}
        alt="Montera"
        className="relative z-20 w-[70px] animate-loading-logo object-contain"
      />
    </main>
  );
}