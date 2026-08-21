import React from 'react';

export default function CustomerInput({ customerName, setCustomerName }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
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
  );
}