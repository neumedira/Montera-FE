import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Banknote, QrCode, ArrowRight, Store, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext'; 

export default function OrderDetailPage() {
  const navigate = useNavigate();
  const { cart, totalPrice } = useCart(); 

  const [customerName, setCustomerName] = useState('');
  const [orderType, setOrderType] = useState(''); 
  const [paymentMethod, setPaymentMethod] = useState(''); 

  const isFormValid = customerName.trim() !== '' && orderType !== '' && paymentMethod !== '';

  const handleProceed = () => {
    if (!isFormValid) return; 

    if (paymentMethod === 'cash') {
      navigate('/cash-payment', { state: { customerName } });
    } else if (paymentMethod === 'qris') {
      navigate('/qris-payment', { state: { customerName } });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#121212] max-w-md mx-auto flex flex-col justify-between transition-colors duration-300">
      <div className="p-4">
        {/* Header Title */}
        <h1 className="font-display text-4xl text-gray-900 dark:text-white uppercase tracking-wide mb-4 transition-colors duration-300">
          ORDER DETAILS
        </h1>

        {/* Customer Input */}
        <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-[#333333] mb-6 transition-colors duration-300">
          <label className="block text-xs font-bold text-gray-800 dark:text-gray-200 mb-2 transition-colors duration-300">
            Customer Name
          </label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Enter your name"
            className="w-full bg-gray-50 dark:bg-[#2d2d2d] border border-gray-200 dark:border-[#444444] rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white font-medium focus:outline-none focus:border-zinc-800 dark:focus:border-white transition-colors duration-300 dark:placeholder:text-[#888888]"
          />
        </div>
      </div>

      {/* Checkerboard Pattern Divider */}
      <div className="overflow-hidden w-full h-6 dark:opacity-80 transition-opacity duration-300" style={{
        backgroundImage: `conic-gradient(#18181b 90deg, #ffffff 90deg 180deg, #18181b 180deg 270deg, #ffffff 270deg)`,
        backgroundSize: '24px 24px'
      }} />

      <div className="p-4 flex-1">
        {/* Order Summary */}
        <div className="mb-8">
          <div className="inline-block border-b-2 border-zinc-900 dark:border-white pb-1 mb-4 transition-colors duration-300">
            <h2 className="font-display text-2xl text-gray-900 dark:text-white uppercase tracking-wide transition-colors duration-300">
              ORDER SUMMARY
            </h2>
          </div>

          <div className="divide-y divide-gray-200/60 dark:divide-[#333333] transition-colors duration-300">
            {cart && cart.length > 0 ? (
              cart.map((item) => (
                <div key={item.id} className="py-3.5 first:pt-0 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    
                    {/* GAMBAR MAKANAN KEMBALI NORMAL - Tanpa Invert */}
                    <img
                      src={item.image || item.img}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-xl bg-gray-50 border border-gray-100 dark:bg-[#2d2d2d] dark:border-[#333333] transition-all duration-300"
                    />

                    <div>
                      <h4 className="font-bold text-xs tracking-wider text-gray-900 dark:text-white uppercase transition-colors duration-300">
                        {item.name}
                      </h4>
                      <p className="text-xs text-gray-400 dark:text-gray-400 font-medium mt-0.5 transition-colors duration-300">
                        x{item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-sm text-gray-900 dark:text-white transition-colors duration-300">
                    Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 py-2 transition-colors duration-300">Tidak ada pesanan.</p>
            )}
          </div>

          <div className="pt-5 mt-2 flex justify-between items-baseline">
            <span className="font-bold text-sm text-gray-800 dark:text-gray-200 transition-colors duration-300">Grand Total</span>
            <span className="font-display text-3xl text-gray-900 dark:text-white transition-colors duration-300">
              Rp {(totalPrice || 0).toLocaleString('id-ID')}
            </span>
          </div>
        </div>

        {/* Dine In Or Take Away */}
        <div className="mb-6">
          <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-3 tracking-wide transition-colors duration-300">
            Dine in Or Take Away
          </h3>
          <div className="space-y-3">
            {/* Dine In Option */}
            <div
              onClick={() => setOrderType('dine-in')}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-3 bg-white dark:bg-[#1e1e1e] ${
                orderType === 'dine-in' ? 'border-zinc-900 dark:border-white' : 'border-gray-200 dark:border-[#333333]'
              }`}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                orderType === 'dine-in' ? 'border-zinc-900 dark:border-white' : 'border-gray-300 dark:border-[#444444]'
              }`}>
                {orderType === 'dine-in' && <div className="w-2.5 h-2.5 bg-zinc-900 dark:bg-white rounded-full" />}
              </div>
              <div className="flex items-center gap-2 font-black text-sm text-gray-900 dark:text-white tracking-wider transition-colors duration-300">
                <Store size={18} className="text-gray-800 dark:text-gray-200" />
                <span>DINE IN</span>
              </div>
            </div>

            {/* Take Away Option */}
            <div
              onClick={() => setOrderType('take-away')}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-3 bg-white dark:bg-[#1e1e1e] ${
                orderType === 'take-away' ? 'border-zinc-900 dark:border-white' : 'border-gray-200 dark:border-[#333333]'
              }`}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                orderType === 'take-away' ? 'border-zinc-900 dark:border-white' : 'border-gray-300 dark:border-[#444444]'
              }`}>
                {orderType === 'take-away' && <div className="w-2.5 h-2.5 bg-zinc-900 dark:bg-white rounded-full" />}
              </div>
              <div className="flex items-center gap-2 font-black text-sm text-gray-900 dark:text-white tracking-wider transition-colors duration-300">
                <ShoppingBag size={18} className="text-gray-800 dark:text-gray-200" />
                <span>TAKE AWAY</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mb-6">
          <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-3 tracking-wide transition-colors duration-300">
            Choose Payment Method
          </h3>
          <div className="space-y-3">
            {/* Cash */}
            <div
              onClick={() => setPaymentMethod('cash')}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 bg-white dark:bg-[#1e1e1e] ${
                paymentMethod === 'cash' ? 'border-zinc-900 dark:border-white' : 'border-gray-200 dark:border-[#333333]'
              }`}
            >
              <div className="mt-0.5">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                  paymentMethod === 'cash' ? 'border-zinc-900 dark:border-white' : 'border-gray-300 dark:border-[#444444]'
                }`}>
                  {paymentMethod === 'cash' && <div className="w-2.5 h-2.5 bg-zinc-900 dark:bg-white rounded-full" />}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 font-black text-sm text-gray-900 dark:text-white tracking-wider transition-colors duration-300">
                  <Banknote size={18} className="text-gray-800 dark:text-gray-200" />
                  <span>CASH</span>
                </div>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed mt-1 transition-colors duration-300">
                  Please prepare the exact amount or hand the cash to our cashier.
                </p>
              </div>
            </div>

            {/* QRIS */}
            <div
              onClick={() => setPaymentMethod('qris')}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 bg-white dark:bg-[#1e1e1e] ${
                paymentMethod === 'qris' ? 'border-zinc-900 dark:border-white' : 'border-gray-200 dark:border-[#333333]'
              }`}
            >
              <div className="mt-0.5">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                  paymentMethod === 'qris' ? 'border-zinc-900 dark:border-white' : 'border-gray-300 dark:border-[#444444]'
                }`}>
                  {paymentMethod === 'qris' && <div className="w-2.5 h-2.5 bg-zinc-900 dark:bg-white rounded-full" />}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 font-black text-sm text-gray-900 dark:text-white tracking-wider transition-colors duration-300">
                  <QrCode size={18} className="text-gray-800 dark:text-gray-200" />
                  <span>QRIS</span>
                </div>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed mt-1 transition-colors duration-300">
                  Scan the QR code with your e-wallet or mobile banking app.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Process Button Sticky at Bottom */}
      <div className="p-4 pt-0">
        <button 
          onClick={handleProceed}
          disabled={!isFormValid}
          className={`w-full font-bold tracking-wider rounded-2xl py-4 px-6 flex items-center justify-between transition-colors duration-300 shadow-lg uppercase text-sm ${
            isFormValid 
              ? 'bg-zinc-900 dark:bg-white text-white dark:text-[#111] hover:bg-black dark:hover:bg-gray-200 cursor-pointer' 
              : 'bg-[#CFCFCF] dark:bg-[#333333] text-white dark:text-[#777] cursor-not-allowed'
          }`}
        >
          <span>PROCEED TO PAYMENT</span>
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}