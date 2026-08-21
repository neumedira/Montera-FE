import React from 'react';
import { Minus, Plus } from 'lucide-react';

export default function CartItem({ item, onUpdateQuantity }) {
  return (
    <div className="bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm border border-gray-100 mb-3">
      <div className="flex items-center gap-4">
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-16 h-16 object-cover rounded-xl bg-gray-50" 
        />
        <div>
          <h3 className="font-bold text-gray-900 tracking-wide text-sm">{item.name}</h3>
          <p className="text-gray-500 font-medium text-sm mt-0.5">
            {item.price.toLocaleString('id-ID')}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 bg-gray-100/80 px-3 py-1.5 rounded-full">
        <button 
          onClick={() => onUpdateQuantity(item.id, -1)}
          className="text-gray-700 hover:text-black font-semibold"
        >
          <Minus size={16} />
        </button>
        <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
        <button 
          onClick={() => onUpdateQuantity(item.id, 1)}
          className="bg-zinc-800 text-white rounded-full p-1 hover:bg-black"
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}