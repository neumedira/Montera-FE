import React from 'react';
import { Banknote } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function CashPaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Ambil data dinamis dari CartContext
  const { cart, totalPrice } = useCart();
  
  // Ambil nama pelanggan dari state route (jika tidak ada, gunakan 'Customer')
  const customerName = location.state?.customerName || 'Customer';

  // Nomor antrean / order (bisa digenerate acak atau berurutan dari backend nanti)
  const orderNumber = '0001';

  return (
    <div className="min-h-screen bg-[#FAF7F2] max-w-md mx-auto p-4 flex flex-col justify-between">
      <div>
        {/* Header Cash */}
        <div className="flex items-center gap-2 mb-6 text-gray-900">
          <Banknote size={24} />
          <h1 className="font-bold text-lg tracking-wider uppercase">CASH</h1>
        </div>

        {/* Receipt Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6">
          {/* Order Number */}
          <div className="text-center mb-6">
            <span className="font-display text-4xl text-gray-900 tracking-wider">
              {orderNumber}
            </span>
          </div>

          {/* Customer Name */}
          <div className="pb-3 border-b border-gray-100 mb-4">
            <span className="font-bold text-sm text-gray-900">
              {customerName}
            </span>
          </div>

          {/* Items List Dinamis */}
          <div className="space-y-4 pb-4 border-b border-gray-100">
            {cart && cart.length > 0 ? (
              cart.map((item) => (
                <div key={item.id} className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-xs tracking-wider text-gray-900 uppercase">
                      {item.name}
                    </h4>
                    <p className="text-xs text-gray-400 font-medium mt-0.5">
                      x{item.quantity}
                    </p>
                  </div>
                  <span className="font-bold text-xs text-gray-900">
                    Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-500">Tidak ada item</p>
            )}
          </div>

          {/* Grand Total Dinamis */}
          <div className="pt-4 flex justify-between items-baseline">
            <span className="font-bold text-xs text-gray-900">Grand Total</span>
            <span className="font-display text-2xl text-gray-900">
              Rp {(totalPrice || 0).toLocaleString('id-ID')}
            </span>
          </div>
        </div>

        {/* Cashier Notice */}
        <p className="text-center text-xs text-gray-500 font-medium px-4 leading-relaxed">
          Please proceed directly to the cashier to complete the payment.
        </p>
      </div>

      {/* Done Button */}
      <button 
        onClick={() => {
          // Opsional: Anda bisa memanggil fungsi clearCart() di sini jika ingin mengosongkan keranjang setelah selesai.
          navigate('/');
        }}
        className="w-full bg-zinc-900 text-white font-bold tracking-wider rounded-2xl py-4 transition-colors hover:bg-black shadow-lg text-sm uppercase mt-6"
      >
        DONE
      </button>
    </div>
  );
}