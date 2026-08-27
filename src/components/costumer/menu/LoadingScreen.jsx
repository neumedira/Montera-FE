import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import loadingLogo from "../../../assets/loading-montera.png";
import loadingFood from "../../../assets/loading-food.png";

export default function LoadingScreen() {
  const navigate = useNavigate();
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const closeTimer = setTimeout(() => {
      setClosing(true);
    }, 1500);

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
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/25 backdrop-blur-[2px]" />

      {/* LOADING */}
    <div className="relative z-20 h-[60px] w-[60px]">

      {/* Bulatan */}
      <img
        src={loadingFood}
        alt=""
        className="absolute left-1/2 top-1/2 h-[60px] w-[60px] -translate-x-1/2 -translate-y-1/2 object-contain animate-loading-food"
      />

      {/* Logo kecil di tengah */}
      <img
        src={loadingLogo}
        alt="Montera"
        className="absolute left-1/2 top-1/2 z-10 h-auto w-[14px] -translate-x-1/2 -translate-y-1/2 object-contain"
      />

    </div>
    </main>
  );
}