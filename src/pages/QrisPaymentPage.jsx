import React, { useState, useEffect } from "react";
import { QrCode } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";

import LoadingScreen from "../components/costumer/menu/LoadingScreen";
import api from "../api/axios"; // Pastikan path ini sesuai

export default function QrisPaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // =========================================================
  // CART
  // =========================================================

  const {
    cart,
    totalPrice,
    clearCart,
  } = useCart();

  // =========================================================
  // CUSTOMER, ORDER TYPE & TIME
  // =========================================================

  const customerName = location.state?.customerName || "Customer";
  
  // Ambil raw value untuk backend (dine-in / take-away)
  const rawOrderType = location.state?.orderType || "dine-in";
  // Format tampilan untuk UI
  const orderTypeDisplay = rawOrderType === "dine-in" ? "Dine In" : "Take Away";
  
  const orderTime = location.state?.orderTime || "-";

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

  const handleDone = async () => {
    try {
      // Tampilkan loading
      setIsFinishing(true);

      // =======================================================
      // DATA YANG DIKIRIM KE BACKEND
      // =======================================================
      const orderData = {
        table_id: null,
        order_type: rawOrderType,
        customer_name: customerName,
        payment_method: "qris", // Halaman khusus QRIS
        items: cart.map((item) => ({
          menu_item_id: item.id,
          quantity: item.quantity,
        })),
      };

      console.log("Order yang dikirim ke backend:", orderData);

      // =======================================================
      // KIRIM ORDER
      // POST /api/v1/customer/orders
      // =======================================================
      const response = await api.post("customer/orders", orderData);
      console.log("Order berhasil dibuat:", response.data);

      // =======================================================
      // ORDER BERHASIL
      // =======================================================
      clearCart();
      navigate("/");
      
    } catch (error) {
      console.error("Gagal membuat order:", error);
      console.error("Response backend:", error.response?.data);

      setIsFinishing(false);

      alert(
        error.response?.data?.message ||
        "Pesanan gagal dikirim. Silakan coba lagi."
      );
    }
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
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#121212] max-w-md mx-auto p-4 flex flex-col justify-between transition-colors duration-300">

      <div>

        {/* ================================================
            HEADER QRIS
        ================================================ */}

        <div className="mb-6 flex items-center gap-2 text-gray-900 dark:text-white transition-colors duration-300">

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
        ================================================ */}

        <div className="mb-6 text-center">

          <p className="mb-1 text-sm font-bold text-gray-900 dark:text-gray-200 transition-colors duration-300">
            Complete the payment within the timeframe
          </p>

          <span className="font-display text-4xl tracking-wider text-gray-900 dark:text-white transition-colors duration-300">
            {formatTime(timeLeft)}
          </span>

        </div>

        {/* ================================================
            QR CODE
        ================================================ */}

        <div className="mb-6 flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl border border-gray-200/50 dark:border-[#333333] bg-[#D9D9D9] dark:bg-[#1e1e1e] shadow-inner transition-colors duration-300">

          {qrisImage ? (
            <img
              src={qrisImage}
              alt="QRIS Store Code"
              className="h-full w-full bg-white object-contain p-4" 
              onError={(e) => {
                e.target.style.display = "none";
                e.target.parentElement.classList.add("flex-col");
                e.target.parentElement.innerHTML =
                  '<span class="text-xs font-medium text-gray-400 dark:text-gray-500">Gambar /public/images/qris-code.png belum ditemukan</span>';
              }}
            />
          ) : (
            <div className="p-6 text-center">
              <QrCode
                size={48}
                className="mx-auto mb-2 text-gray-400 dark:text-gray-500 transition-colors duration-300"
              />
              <p className="text-xs font-medium text-gray-400 dark:text-gray-500 transition-colors duration-300">
                QRIS Image Placeholder
              </p>
            </div>
          )}

        </div>

        {/* ================================================
            CUSTOMER & ORDER DETAILS INFO
        ================================================ */}

        <div className="mb-6 flex items-center justify-between rounded-xl border border-gray-100 dark:border-[#333333] bg-white dark:bg-[#1e1e1e] p-4 shadow-sm transition-colors duration-300">
          <div>
            <span className="block text-sm font-bold text-gray-900 dark:text-white transition-colors duration-300">
              {customerName}
            </span>
            <span className="mt-0.5 block text-[11px] text-gray-500 dark:text-gray-400 transition-colors duration-300">
              {orderTime}
            </span>
          </div>
          <span className="rounded-full bg-gray-100 dark:bg-[#2d2d2d] px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-gray-200 transition-colors duration-300">
            {orderTypeDisplay}
          </span>
        </div>

        {/* ================================================
            TOTAL
        ================================================ */}

        <div className="text-center">

          <span className="text-base font-bold text-gray-900 dark:text-gray-200 transition-colors duration-300">
            Total
          </span>

          <p className="mt-1 font-display text-2xl text-gray-900 dark:text-white transition-colors duration-300">
            Rp{" "}
            {(totalPrice || 0).toLocaleString(
              "id-ID"
            )}
          </p>

        </div>

      </div>

      {/* ================================================
          DONE BUTTON
      ================================================ */}

      <button
        type="button"
        onClick={handleDone}
        disabled={isFinishing || !cart || cart.length === 0}
        className="
          mt-6
          w-full
          rounded-2xl
          bg-zinc-900
          dark:bg-white
          py-4
          text-sm
          font-bold
          uppercase
          tracking-wider
          text-white
          dark:text-[#111]
          shadow-lg
          transition-colors
          duration-300
          hover:bg-black
          dark:hover:bg-gray-200
          active:scale-[0.98]
          disabled:cursor-not-allowed
          disabled:opacity-50
          dark:disabled:opacity-50
        "
      >
        DONE
      </button>

    </div>
  );
}