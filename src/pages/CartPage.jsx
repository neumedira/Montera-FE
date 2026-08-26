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
    <div className="min-h-screen bg-[#fffcf4] max-w-md mx-auto p-4 flex flex-col justify-between pb-6">

      <div>

        {/* =========================================
            CART ITEMS
        ========================================= */}
        {cart && cart.length > 0 ? (
          <div className="space-y-3 mb-4">

            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm border border-gray-100"
              >

                {/* PRODUCT INFO */}
                <div className="flex items-center gap-3">

                  <img
                    src={item.image || item.img}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-xl bg-gray-50 border border-gray-100"
                  />

                  <div>

                    <h3 className="font-bold text-sm tracking-wider text-gray-900 uppercase">
                      {item.name}
                    </h3>

                    <p className="text-sm font-semibold text-gray-700 mt-1">
                      {item.price.toLocaleString('id-ID')}
                    </p>

                  </div>

                </div>

                {/* =========================================
                    QUANTITY
                ========================================= */}
                <div className="flex items-center gap-3 bg-gray-100 px-3 py-1.5 rounded-full">

                  {/* MINUS */}
                  <button
                    type="button"
                    onClick={() =>
                      updateQuantity(
                        item.id,
                        item.quantity - 1
                      )
                    }
                    className="text-gray-600 hover:text-black"
                  >
                    <Minus size={14} />
                  </button>

                  {/* QUANTITY */}
                  <span className="font-bold text-xs text-gray-900">
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
                    className="w-5 h-5 bg-zinc-900 text-white rounded-full flex items-center justify-center hover:bg-black"
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
          <div className="bg-white rounded-2xl p-8 text-center border border-gray-100 mb-4 shadow-sm">

            <p className="text-gray-500 font-medium text-sm">
              Keranjang belanja Anda masih kosong.
            </p>

          </div>
        )}

        {/* =========================================
            ADD MORE ITEMS
        ========================================= */}
        <div className="flex items-center gap-2 mb-6">

          {/* MASCOT */}
          <div className="w-12 h-12 flex-shrink-0">

            <img
              src={burgerMascotImage}
              alt="Mascot"
              className="w-full h-full object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />

          </div>

          {/* ADD MORE BUTTON */}
          <button
            type="button"
            onClick={handleAddMore}
            className="bg-zinc-900 text-white font-bold text-xs px-5 py-3 rounded-full hover:bg-black transition-all shadow-md"
          >
            Do you want to add anything else?
          </button>

        </div>

        {/* =========================================
            NOTES
        ========================================= */}
        <div className="mb-6">

          <label className="block text-xs font-bold text-gray-900 tracking-wider uppercase mb-2">
            NOTES (OPTIONAL)
          </label>

          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a note to your order?"
            className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3.5 text-sm text-gray-900 font-medium focus:outline-none focus:border-zinc-800 shadow-sm"
          />

        </div>

        {/* =========================================
            ORDER SUMMARY
        ========================================= */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">

          <h2 className="font-bold text-sm tracking-wider text-gray-900 uppercase mb-4 pb-3 border-b border-gray-100">
            ORDER SUMMARY
          </h2>

          <div className="space-y-3">

            {/* SUBTOTAL */}
            <div className="flex justify-between items-center text-sm font-semibold text-gray-600">

              <span>
                Subtotal
              </span>

              <span>
                {(totalPrice || 0).toLocaleString('id-ID')}
              </span>

            </div>

            {/* TOTAL */}
            <div className="pt-3 border-t border-gray-100 flex justify-between items-baseline">

              <span className="font-display text-xl text-gray-900 tracking-wide uppercase">
                TOTAL
              </span>

              <span className="font-display text-2xl text-gray-900">
                {(totalPrice || 0).toLocaleString('id-ID')}
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
        className={`w-full font-bold tracking-wider rounded-2xl py-4 px-6 flex items-center justify-between transition-colors shadow-lg uppercase text-sm ${
          cart && cart.length > 0
            ? 'bg-zinc-900 text-white hover:bg-black cursor-pointer'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
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