import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Minus, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const navigate = useNavigate();
  const [note, setNote] = useState('');

  const { cart, updateQuantity, totalPrice } = useCart();

  const burgerMascotImage = '/images/burger-mascot.png';

  // =========================================
  // KEMBALI KE MENU TANPA LOADING SCREEN
  // =========================================
  const handleAddMore = () => {
    navigate('/', {
      state: {
        skipLoading: true,
      },
    });
  };

  // =========================================
  // CHECKOUT
  // =========================================
  const handleCheckout = () => {
    navigate('/order-details');
  };

  return (
    <div className="min-h-screen bg-[#fffcf4] dark:bg-[#121212] max-w-md mx-auto p-4 flex flex-col justify-between pb-6 transition-colors duration-300">

      <div>

        {/* =========================================
            CART ITEMS
        ========================================= */}
        {cart && cart.length > 0 ? (
          <div className="space-y-3 mb-4">

            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-[#1e1e1e] rounded-2xl p-4 flex items-center justify-between shadow-sm border border-gray-100 dark:border-[#333333] transition-colors duration-300"
              >

                {/* PRODUCT INFO */}
                <div className="flex items-center gap-3">

                  {/* GAMBAR MAKANAN TETAP NORMAL */}
                  <img
                    src={item.image || item.img}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-xl bg-gray-50 dark:bg-[#2d2d2d] border border-gray-100 dark:border-[#333333] transition-colors duration-300"
                  />

                  <div>

                    <h3 className="font-bold text-sm tracking-wider text-gray-900 dark:text-white uppercase transition-colors duration-300">
                      {item.name}
                    </h3>

                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mt-1 transition-colors duration-300">
                      Rp {item.price.toLocaleString('id-ID')}
                    </p>

                  </div>

                </div>

                {/* =========================================
                    QUANTITY
                ========================================= */}
                <div className="flex items-center gap-3 bg-gray-100 dark:bg-[#2d2d2d] px-3 py-1.5 rounded-full transition-colors duration-300">

                  {/* MINUS */}
                  <button
                    type="button"
                    onClick={() =>
                      updateQuantity(
                        item.id,
                        item.quantity - 1
                      )
                    }
                    className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                  >
                    <Minus size={14} />
                  </button>

                  {/* QUANTITY */}
                  <span className="font-bold text-xs text-gray-900 dark:text-white transition-colors duration-300">
                    {item.quantity}
                  </span>

                  {/* PLUS */}
                  <button
                    type="button"
                    onClick={() =>
                      updateQuantity(
                        item.id,
                        item.quantity + 1
                      )
                    }
                    className="w-5 h-5 bg-zinc-900 dark:bg-white text-white dark:text-[#111] rounded-full flex items-center justify-center hover:bg-black dark:hover:bg-gray-200 transition-colors"
                  >
                    <Plus size={12} />
                  </button>

                </div>

              </div>
            ))}

          </div>
        ) : (

          /* =========================================
              EMPTY CART
          ========================================= */
          <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl p-8 text-center border border-gray-100 dark:border-[#333333] mb-4 shadow-sm transition-colors duration-300">

            <p className="text-gray-500 dark:text-gray-400 font-medium text-sm transition-colors duration-300">
              Keranjang belanja Anda masih kosong.
            </p>

          </div>
        )}

        {/* =========================================
            ADD MORE ITEMS
        ========================================= */}
        <div className="flex items-center gap-2 mb-6">

          {/* MASCOT DENGAN EFEK INVERT */}
          <div className="w-12 h-12 flex-shrink-0">

            <img
              src={burgerMascotImage}
              alt="Mascot"
              className="w-full h-full object-contain dark:invert transition-all duration-300"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />

          </div>

          {/* ADD MORE BUTTON */}
          <button
            type="button"
            onClick={handleAddMore}
            className="bg-zinc-900 dark:bg-white text-white dark:text-[#111] font-bold text-xs px-5 py-3 rounded-full hover:bg-black dark:hover:bg-gray-200 transition-all shadow-md"
          >
            Do you want to add anything else?
          </button>

        </div>

        {/* =========================================
            NOTES
        ========================================= */}
        <div className="mb-6">

          <label className="block text-xs font-bold text-gray-900 dark:text-white tracking-wider uppercase mb-2 transition-colors duration-300">
            NOTES (OPTIONAL)
          </label>

          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a note to your order?"
            className="w-full bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-[#444444] rounded-2xl px-4 py-3.5 text-sm text-gray-900 dark:text-white font-medium focus:outline-none focus:border-zinc-800 dark:focus:border-white dark:placeholder:text-[#888888] shadow-sm transition-colors duration-300"
          />

        </div>

        {/* =========================================
            ORDER SUMMARY
        ========================================= */}
        <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-[#333333] mb-6 transition-colors duration-300">

          <h2 className="font-bold text-sm tracking-wider text-gray-900 dark:text-white uppercase mb-4 pb-3 border-b border-gray-100 dark:border-[#333333] transition-colors duration-300">
            ORDER SUMMARY
          </h2>

          <div className="space-y-3">

            {/* SUBTOTAL */}
            <div className="flex justify-between items-center text-sm font-semibold text-gray-600 dark:text-gray-400 transition-colors duration-300">

              <span>
                Subtotal
              </span>

              <span>
                Rp {(totalPrice || 0).toLocaleString('id-ID')}
              </span>

            </div>

            {/* TOTAL */}
            <div className="pt-3 border-t border-gray-100 dark:border-[#333333] flex justify-between items-baseline transition-colors duration-300">

              <span className="font-display text-xl text-gray-900 dark:text-white tracking-wide uppercase transition-colors duration-300">
                TOTAL
              </span>

              <span className="font-display text-2xl text-gray-900 dark:text-white transition-colors duration-300">
                Rp {(totalPrice || 0).toLocaleString('id-ID')}
              </span>

            </div>

          </div>

        </div>

      </div>

      {/* =========================================
          CHECKOUT BUTTON
      ========================================= */}
      <button
        type="button"
        onClick={handleCheckout}
        disabled={!cart || cart.length === 0}
        className={`w-full font-bold tracking-wider rounded-2xl py-4 px-6 flex items-center justify-between transition-colors duration-300 shadow-lg uppercase text-sm ${
          cart && cart.length > 0
            ? 'bg-zinc-900 dark:bg-white text-white dark:text-[#111] hover:bg-black dark:hover:bg-gray-200 cursor-pointer'
            : 'bg-gray-300 dark:bg-[#333333] text-gray-500 dark:text-[#777] cursor-not-allowed'
        }`}
      >

        <span>
          CHECKOUT
        </span>

        <ArrowRight size={20} />

      </button>

    </div>
  );
}