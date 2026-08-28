import React, { useState } from "react";
import { Banknote } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";

import LoadingScreen from "../components/costumer/menu/LoadingScreen";
import api from "../api/axios";

export default function CashPaymentPage() {
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
  // LOADING SAAT DONE
  // =========================================================

  const [isFinishing, setIsFinishing] = useState(false);

  // =========================================================
  // CUSTOMER
  // =========================================================

  const customerName =
    location.state?.customerName || "Customer";

  // =========================================================
  // ORDER NUMBER
  // =========================================================
  // Sementara masih dummy.
  // Nomor order sebenarnya sebaiknya berasal dari backend.
  // =========================================================

  const orderNumber = "0001";

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

        // Untuk halaman Cash ini sementara dine-in.
        // Kalau nanti ada pilihan takeaway, tinggal dibuat dinamis.
        order_type: "dine-in",

        customer_name: customerName,

        // Halaman ini khusus pembayaran cash.
        payment_method: "cash",

        // Ambil item dari cart
        items: cart.map((item) => ({
          menu_item_id: item.id,
          quantity: item.quantity,
        })),
      };

      // =======================================================
      // DEBUG
      // =======================================================

      console.log("Order yang dikirim ke backend:", orderData);

      // =======================================================
      // KIRIM ORDER
      // POST /api/v1/customer/orders
      // =======================================================

      const response = await api.post(
        "customer/orders",
        orderData
      );

      console.log(
        "Order berhasil dibuat:",
        response.data
      );

      // =======================================================
      // ORDER BERHASIL
      // =======================================================

      clearCart();

      navigate("/");
    } catch (error) {
      // =======================================================
      // ORDER GAGAL
      // =======================================================

      console.error(
        "Gagal membuat order:",
        error
      );

      console.error(
        "Response backend:",
        error.response?.data
      );

      // Matikan loading supaya user bisa mencoba lagi
      setIsFinishing(false);

      // Sementara pakai alert dulu
      alert(
        error.response?.data?.message ||
        "Pesanan gagal dikirim. Silakan coba lagi."
      );
    }
  };

  // =========================================================
  // LOADING
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

        {/* =====================================================
            HEADER CASH
        ===================================================== */}

        <div className="mb-6 flex items-center gap-2 text-gray-900 dark:text-white transition-colors duration-300">

          <Banknote
            size={24}
            strokeWidth={2}
          />

          <h1 className="text-lg font-bold uppercase tracking-wider">
            CASH
          </h1>

        </div>

        {/* =====================================================
            RECEIPT CARD
        ===================================================== */}

        <div className="mb-6 rounded-3xl border border-gray-100 dark:border-[#333333] bg-white dark:bg-[#1e1e1e] p-6 shadow-sm transition-colors duration-300">

          {/* ===================================================
              ORDER NUMBER
          =================================================== */}

          <div className="mb-6 text-center">

            <span className="font-display text-4xl tracking-wider text-gray-900 dark:text-white transition-colors duration-300">
              {orderNumber}
            </span>

          </div>

          {/* ===================================================
              CUSTOMER NAME
          =================================================== */}

          <div className="mb-4 border-b border-gray-100 dark:border-[#333333] pb-3 transition-colors duration-300">

            <span className="text-sm font-bold text-gray-900 dark:text-white transition-colors duration-300">
              {customerName}
            </span>

          </div>

          {/* ===================================================
              ITEMS
          =================================================== */}

          <div className="space-y-4 border-b border-gray-100 dark:border-[#333333] pb-4 transition-colors duration-300">

            {cart && cart.length > 0 ? (

              cart.map((item, index) => (

                <div
                  key={`${item.id}-${index}`}
                  className="flex items-start justify-between gap-4"
                >

                  {/* ITEM NAME + QTY */}

                  <div className="min-w-0">

                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white transition-colors duration-300">
                      {item.name}
                    </h4>

                    <p className="mt-0.5 text-xs font-medium text-gray-400 dark:text-gray-400 transition-colors duration-300">
                      x{item.quantity}
                    </p>

                  </div>

                  {/* ITEM TOTAL */}

                  <span className="shrink-0 text-xs font-bold text-gray-900 dark:text-white transition-colors duration-300">
                    Rp{" "}
                    {(
                      item.price * item.quantity
                    ).toLocaleString("id-ID")}
                  </span>

                </div>

              ))

            ) : (

              <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">
                Tidak ada item
              </p>

            )}

          </div>

          {/* ===================================================
              GRAND TOTAL
          =================================================== */}

          <div className="flex items-baseline justify-between pt-4">

            <span className="text-xs font-bold text-gray-900 dark:text-white transition-colors duration-300">
              Grand Total
            </span>

            <span className="font-display text-2xl text-gray-900 dark:text-white transition-colors duration-300">
              Rp{" "}
              {(totalPrice || 0).toLocaleString("id-ID")}
            </span>

          </div>

        </div>

        {/* =====================================================
            CASHIER NOTICE
        ===================================================== */}

        <p className="px-4 text-center text-xs font-medium leading-relaxed text-gray-500 dark:text-gray-400 transition-colors duration-300">
          Please proceed directly to the cashier to complete
          the payment.
        </p>

      </div>

      {/* =======================================================
          DONE BUTTON
      ======================================================= */}

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