import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function OrderDetailPage() {
  const navigate = useNavigate();
  const [customerName, setCustomerName] = useState('Nazriel');
  const [paymentMethod, setPaymentMethod] = useState('cash');

  const orderItems = [
    {
      id: 1,
      name: 'EL PRIMO',
      quantity: 1,
      totalPrice: 58000,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300'
    },
    {
      id: 2,
      name: 'POLLO FINGERS',
      quantity: 1,
      totalPrice: 120000,
      image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=300'
    },
    {
      id: 3,
      name: 'COLA',
      quantity: 1,
      totalPrice: 14000,
      image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=300'
    }
  ];

  const grandTotal = 166000;

const handleProceed = () => {
  if (paymentMethod === 'cash') {
    navigate('/cash-payment');
  } else if (paymentMethod === 'qris') {
    navigate('/qris-payment');
  }
};

  return (
    <div className="min-h-screen bg-[#FAF7F2] max-w-md mx-auto p-4 flex flex-col justify-between">
      <div>
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
            placeholder="Enter name"
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 font-medium focus:outline-none focus:border-zinc-800"
          />
        </div>

        {/* Checkerboard Pattern Divider */}
        <div className="my-6 overflow-hidden -mx-4">
          <div 
            className="h-6 w-full"
            style={{
              backgroundImage: `conic-gradient(#18181b 90deg, #ffffff 90deg 180deg, #18181b 180deg 270deg, #ffffff 270deg)`,
              backgroundSize: '24px 24px'
            }}
          />
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4">
          <h2 className="font-display text-2xl text-gray-900 uppercase mb-4">
            ORDER SUMMARY
          </h2>

          <div className="divide-y divide-gray-100">
            {orderItems.map((item) => (
              <div key={item.id} className="py-3.5 first:pt-0 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={item.image}
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
                  Rp {item.totalPrice.toLocaleString('id-ID')}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 mt-2 border-t border-gray-100 flex justify-between items-baseline">
            <span className="font-bold text-xs text-gray-800">Grand Total</span>
            <span className="font-display text-2xl text-gray-900">
              Rp {grandTotal.toLocaleString('id-ID')}
            </span>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="space-y-3 mt-4 mb-6">
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
              <div className="font-black text-sm text-gray-900 tracking-wider">CASH</div>
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
              <div className="font-black text-sm text-gray-900 tracking-wider">QRIS</div>
              <p className="text-[11px] text-gray-500 font-medium leading-relaxed mt-1">
                Scan the QR code with your e-wallet or mobile banking app.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Process Button */}
      <button 
        onClick={handleProceed}
        className="w-full bg-zinc-900 text-white font-bold tracking-wider rounded-2xl py-4 px-6 flex items-center justify-between hover:bg-black transition-colors shadow-lg uppercase text-sm"
      >
        <span>PROCEED TO PAYMENT</span>
        <span>&rarr;</span>
      </button>
    </div>
  );
}