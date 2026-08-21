import React from 'react';

export default function OrderSummary({ subtotal, total }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
      <h3 className="text-xs font-black tracking-wider text-gray-900 uppercase mb-4">
        ORDER SUMMARY
      </h3>
      
      <div className="flex justify-between items-center text-sm font-medium text-gray-600 mb-4 pb-4 border-b border-gray-100">
        <span>Subtotal</span>
        <span className="text-gray-900 font-semibold">{subtotal.toLocaleString('id-ID')}</span>
      </div>

      {/* Bagian Total dengan Font Condensed Bold */}
      <div className="flex justify-between items-baseline text-gray-900">
        <span className="font-display text-3xl leading-none">TOTAL</span>
        <span className="font-display text-3xl leading-none">{total.toLocaleString('id-ID')}</span>
      </div>
    </div>
  );
}