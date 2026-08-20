import React from 'react';
import { Banknote } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CashPaymentPage() {
  const navigate = useNavigate();

  // Data Dummy Struk
  const orderData = {
    orderNumber: '0001',
    customerName: 'Nazriel',
    items: [
      { id: 1, name: 'EL PRIMO', qty: 1, price: 58000 },
      { id: 2, name: 'POLLO FINGERS', qty: 1, price: 120000 },
      { id: 3, name: 'COLA', qty: 1, price: 14000 },
    ],
    grandTotal: 166000
  };

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
              {orderData.orderNumber}
            </span>
          </div>

          {/* Customer Name */}
          <div className="pb-3 border-b border-gray-100 mb-4">
            <span className="font-bold text-sm text-gray-900">
              {orderData.customerName}
            </span>
          </div>

          {/* Items List */}
          <div className="space-y-4 pb-4 border-b border-gray-100">
            {orderData.items.map((item) => (
              <div key={item.id} className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-xs tracking-wider text-gray-900 uppercase">
                    {item.name}
                  </h4>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">
                    x{item.qty}
                  </p>
                </div>
                <span className="font-bold text-xs text-gray-900">
                  Rp {item.price.toLocaleString('id-ID')}
                </span>
              </div>
            ))}
          </div>

          {/* Grand Total */}
          <div className="pt-4 flex justify-between items-baseline">
            <span className="font-bold text-xs text-gray-900">Grand Total</span>
            <span className="font-display text-2xl text-gray-900">
              Rp {orderData.grandTotal.toLocaleString('id-ID')}
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
        onClick={() => navigate('/')}
        className="w-full bg-zinc-900 text-white font-bold tracking-wider rounded-2xl py-4 transition-colors hover:bg-black shadow-lg text-sm uppercase mt-6"
      >
        DONE
      </button>
    </div>
  );
}