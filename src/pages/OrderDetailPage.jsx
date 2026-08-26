import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Banknote, QrCode, ArrowRight, Store, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext'; 

export default function OrderDetailPage() {
  const navigate = useNavigate();
  const { cart, totalPrice } = useCart(); 

  // State untuk form
  const [customerName, setCustomerName] = useState('');
  const [orderType, setOrderType] = useState(''); // 'dine-in' atau 'take-away'
  const [paymentMethod, setPaymentMethod] = useState(''); // 'cash' atau 'qris'

  // Validasi: Form dianggap valid jika ketiga pilihan ini sudah terisi
  const isFormValid = customerName.trim() !== '' && orderType !== '' && paymentMethod !== '';

  const handleProceed = () => {
    if (!isFormValid) return; // Mencegah klik jika form belum lengkap

    // Kirim state customerName ke halaman pembayaran
    if (paymentMethod === 'cash') {
      navigate('/cash-payment', { state: { customerName } });
    } else if (paymentMethod === 'qris') {
      navigate('/qris-payment', { state: { customerName } });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] max-w-md mx-auto flex flex-col justify-between">
      <div className="p-4">
        {/* Header Title */}
        <h1 className="font-display text-4xl text-gray-900 uppercase tracking-wide mb-4">
          ORDER DETAILS
        </h1>

        {/* Customer Input */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
          <label className="block text-xs font-bold text-gray-800 mb-2">
            Customer Name
          </label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Enter your name"
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 font-medium focus:outline-none focus:border-zinc-800"
          />
        </div>
      </div>

      {/* Checkerboard Pattern Divider */}
      <div className="overflow-hidden w-full h-6" style={{
        backgroundImage: `conic-gradient(#18181b 90deg, #ffffff 90deg 180deg, #18181b 180deg 270deg, #ffffff 270deg)`,
        backgroundSize: '24px 24px'
      }} />

      <div className="p-4 flex-1">
        {/* Order Summary */}
        <div className="mb-8">
          <div className="inline-block border-b-2 border-zinc-900 pb-1 mb-4">
            <h2 className="font-display text-2xl text-gray-900 uppercase tracking-wide">
              ORDER SUMMARY
            </h2>
          </div>

          <div className="divide-y divide-gray-200/60">
            {cart && cart.length > 0 ? (
              cart.map((item) => (
                <div key={item.id} className="py-3.5 first:pt-0 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image || item.img}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-xl bg-gray-50 border border-gray-100"
                    />
                    <div>
                      <h4 className="font-bold text-xs tracking-wider text-gray-900 uppercase">
                        {item.name}
                      </h4>
                      <p className="text-xs text-gray-400 font-medium mt-0.5">
                        x{item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-sm text-gray-900">
                    Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 py-2">Tidak ada pesanan.</p>
            )}
          </div>

          <div className="pt-5 mt-2 flex justify-between items-baseline">
            <span className="font-bold text-sm text-gray-800">Grand Total</span>
            <span className="font-display text-3xl text-gray-900">
              Rp {(totalPrice || 0).toLocaleString('id-ID')}
            </span>
          </div>
        </div>

        {/* Dine In Or Take Away */}
        <div className="mb-6">
          <h3 className="font-bold text-sm text-gray-900 mb-3 tracking-wide">
            Dine in Or Take Away
          </h3>
          <div className="space-y-3">
            {/* Dine In Option */}
            <div
              onClick={() => setOrderType('dine-in')}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-3 bg-white ${
                orderType === 'dine-in' ? 'border-zinc-900' : 'border-gray-200'
              }`}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                orderType === 'dine-in' ? 'border-zinc-900' : 'border-gray-300'
              }`}>
                {orderType === 'dine-in' && <div className="w-2.5 h-2.5 bg-zinc-900 rounded-full" />}
              </div>
              <div className="flex items-center gap-2 font-black text-sm text-gray-900 tracking-wider">
                <Store size={18} className="text-gray-800" />
                <span>DINE IN</span>
              </div>
            </div>

            {/* Take Away Option */}
            <div
              onClick={() => setOrderType('take-away')}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-3 bg-white ${
                orderType === 'take-away' ? 'border-zinc-900' : 'border-gray-200'
              }`}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                orderType === 'take-away' ? 'border-zinc-900' : 'border-gray-300'
              }`}>
                {orderType === 'take-away' && <div className="w-2.5 h-2.5 bg-zinc-900 rounded-full" />}
              </div>
              <div className="flex items-center gap-2 font-black text-sm text-gray-900 tracking-wider">
                <ShoppingBag size={18} className="text-gray-800" />
                <span>TAKE AWAY</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mb-6">
          <h3 className="font-bold text-sm text-gray-900 mb-3 tracking-wide">
            Choose Payment Method
          </h3>
          <div className="space-y-3">
            {/* Cash */}
            <div
              onClick={() => setPaymentMethod('cash')}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 bg-white ${
                paymentMethod === 'cash' ? 'border-zinc-900' : 'border-gray-200'
              }`}
            >
              <div className="mt-0.5">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  paymentMethod === 'cash' ? 'border-zinc-900' : 'border-gray-300'
                }`}>
                  {paymentMethod === 'cash' && <div className="w-2.5 h-2.5 bg-zinc-900 rounded-full" />}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 font-black text-sm text-gray-900 tracking-wider">
                  <Banknote size={18} className="text-gray-800" />
                  <span>CASH</span>
                </div>
                <p className="text-[11px] text-gray-500 font-medium leading-relaxed mt-1">
                  Please prepare the exact amount or hand the cash to our cashier.
                </p>
              </div>
            </div>

            {/* QRIS */}
            <div
              onClick={() => setPaymentMethod('qris')}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 bg-white ${
                paymentMethod === 'qris' ? 'border-zinc-900' : 'border-gray-200'
              }`}
            >
              <div className="mt-0.5">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  paymentMethod === 'qris' ? 'border-zinc-900' : 'border-gray-300'
                }`}>
                  {paymentMethod === 'qris' && <div className="w-2.5 h-2.5 bg-zinc-900 rounded-full" />}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 font-black text-sm text-gray-900 tracking-wider">
                  <QrCode size={18} className="text-gray-800" />
                  <span>QRIS</span>
                </div>
                <p className="text-[11px] text-gray-500 font-medium leading-relaxed mt-1">
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
          className={`w-full font-bold tracking-wider rounded-2xl py-4 px-6 flex items-center justify-between transition-colors shadow-lg uppercase text-sm ${
            isFormValid 
              ? 'bg-zinc-900 text-white hover:bg-black cursor-pointer' 
              : 'bg-[#CFCFCF] text-white cursor-not-allowed'
          }`}
        >
          <span>PROCEED TO PAYMENT</span>
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}