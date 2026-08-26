import React, { useState, useEffect } from "react";
import { QrCode } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

import LoadingScreen from "../components/costumer/menu/LoadingScreen";

export default function QrisPaymentPage() {
  const navigate = useNavigate();

  // =========================================================
  // CART
  // =========================================================

  const {
    totalPrice,
    clearCart,
  } = useCart();

  // =========================================================
  // FINISHING / LOADING
  // =========================================================

  const [isFinishing, setIsFinishing] = useState(false);

  // =========================================================
  // QRIS IMAGE
  // =========================================================

  const qrisImage = "/images/qris-code.png";

  // =========================================================
  // TIMER
  // =========================================================

  const [timeLeft, setTimeLeft] = useState(299);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // =========================================================
  // FORMAT TIME
  // =========================================================

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${String(mins).padStart(2, "0")}:${String(
      secs
    ).padStart(2, "0")}`;
  };

  // =========================================================
  // DONE
  // =========================================================

  const handleDone = () => {
    // Tampilkan loading terlebih dahulu
    setIsFinishing(true);

    /*
     * Beri waktu agar LoadingScreen sudah tampil.
     * Setelah itu cart dikosongkan dan kembali ke "/".
     */
    setTimeout(() => {
      clearCart();

      navigate("/");
    }, 100);
  };

  // =========================================================
  // LOADING SAAT SELESAI
  // =========================================================

  if (isFinishing) {
    return <LoadingScreen />;
  }

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <div className="min-h-screen bg-[#FAF7F2] max-w-md mx-auto p-4 flex flex-col justify-between">

      <div>

        {/* ================================================
            HEADER QRIS
        ================================================= */}

        <div className="mb-6 flex items-center gap-2 text-gray-900">

          <QrCode
            size={24}
            strokeWidth={2}
          />

          <h1 className="text-lg font-bold uppercase tracking-wider">
            QRIS
          </h1>

        </div>

        {/* ================================================
            SUBTITLE + TIMER
        ================================================= */}

        <div className="mb-6 text-center">

          <p className="mb-1 text-sm font-bold text-gray-900">
            Complete the payment within the timeframe
          </p>

          <span className="font-display text-4xl tracking-wider text-gray-900">
            {formatTime(timeLeft)}
          </span>

        </div>

        {/* ================================================
            QR CODE
        ================================================= */}

        <div className="mb-6 flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl border border-gray-200/50 bg-[#D9D9D9] shadow-inner">

          {qrisImage ? (
            <img
              src={qrisImage}
              alt="QRIS Store Code"
              className="h-full w-full bg-white object-contain p-4"
              onError={(e) => {
                e.target.style.display = "none";

                e.target.parentElement.classList.add(
                  "flex-col"
                );

                e.target.parentElement.innerHTML =
                  '<span class="text-xs font-medium text-gray-400">Gambar /public/images/qris-code.png belum ditemukan</span>';
              }}
            />
          ) : (
            <div className="p-6 text-center">

              <QrCode
                size={48}
                className="mx-auto mb-2 text-gray-400"
              />

              <p className="text-xs font-medium text-gray-400">
                QRIS Image Placeholder
              </p>

            </div>
          )}

        </div>

        {/* ================================================
            TOTAL
        ================================================= */}

        <div className="text-center">

          <span className="text-base font-bold text-gray-900">
            Total
          </span>

          <p className="mt-1 font-display text-2xl text-gray-900">
            Rp{" "}
            {(totalPrice || 0).toLocaleString(
              "id-ID"
            )}
          </p>

        </div>

      </div>

      {/* ================================================
          DONE BUTTON
      ================================================= */}

      <button
        type="button"
        onClick={handleDone}
        className="
          mt-6
          w-full
          rounded-2xl
          bg-zinc-900
          py-4
          text-sm
          font-bold
          uppercase
          tracking-wider
          text-white
          shadow-lg
          transition-colors
          hover:bg-black
          active:scale-[0.98]
        "
      >
        DONE
      </button>

    </div>
  );
}