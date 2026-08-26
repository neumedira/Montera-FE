import React, { useState } from "react";
import { Banknote } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";

import LoadingScreen from "../components/costumer/menu/LoadingScreen";

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

  const orderNumber = "0001";

  // =========================================================
  // DONE
  // =========================================================

  const handleDone = () => {
    // Tampilkan LoadingScreen terlebih dahulu
    setIsFinishing(true);

    /*
     * Tunggu sebentar supaya LoadingScreen
     * sudah benar-benar menggantikan halaman payment.
     *
     * Setelah itu:
     * 1. Clear cart
     * 2. Masuk kembali ke customer menu
     */
    setTimeout(() => {
      clearCart();

      navigate("/");
    }, 100);
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
    <div className="min-h-screen bg-[#FAF7F2] max-w-md mx-auto p-4 flex flex-col justify-between">

      <div>

        {/* =====================================================
            HEADER CASH
        ===================================================== */}

        <div className="mb-6 flex items-center gap-2 text-gray-900">

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

        <div className="mb-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">

          {/* ===================================================
              ORDER NUMBER
          =================================================== */}

          <div className="mb-6 text-center">

            <span className="font-display text-4xl tracking-wider text-gray-900">
              {orderNumber}
            </span>

          </div>

          {/* ===================================================
              CUSTOMER NAME
          =================================================== */}

          <div className="mb-4 border-b border-gray-100 pb-3">

            <span className="text-sm font-bold text-gray-900">
              {customerName}
            </span>

          </div>

          {/* ===================================================
              ITEMS
          =================================================== */}

          <div className="space-y-4 border-b border-gray-100 pb-4">

            {cart && cart.length > 0 ? (

              cart.map((item, index) => (

                <div
                  key={`${item.id}-${index}`}
                  className="flex items-start justify-between gap-4"
                >

                  {/* ITEM NAME + QTY */}

                  <div className="min-w-0">

                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900">
                      {item.name}
                    </h4>

                    <p className="mt-0.5 text-xs font-medium text-gray-400">
                      x{item.quantity}
                    </p>

                  </div>

                  {/* ITEM TOTAL */}

                  <span className="shrink-0 text-xs font-bold text-gray-900">
                    Rp{" "}
                    {(
                      item.price * item.quantity
                    ).toLocaleString("id-ID")}
                  </span>

                </div>

              ))

            ) : (

              <p className="text-xs text-gray-500">
                Tidak ada item
              </p>

            )}

          </div>

          {/* ===================================================
              GRAND TOTAL
          =================================================== */}

          <div className="flex items-baseline justify-between pt-4">

            <span className="text-xs font-bold text-gray-900">
              Grand Total
            </span>

            <span className="font-display text-2xl text-gray-900">
              Rp{" "}
              {(totalPrice || 0).toLocaleString("id-ID")}
            </span>

          </div>

        </div>

        {/* =====================================================
            CASHIER NOTICE
        ===================================================== */}

        <p className="px-4 text-center text-xs font-medium leading-relaxed text-gray-500">
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