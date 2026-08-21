import React from 'react';

export default function OrderSummaryCard({ items, grandTotal }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <h2 className="font-display text-2xl text-gray-900 uppercase mb-4">
        ORDER SUMMARY
      </h2>

      <div className="divide-y divide-gray-100">
        {items.map((item) => (
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
  );
}