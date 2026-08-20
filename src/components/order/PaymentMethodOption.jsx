import React from 'react';

export default function PaymentMethodOption({ 
  id, 
  title, 
  description, 
  icon: Icon, 
  selected, 
  onSelect 
}) {
  return (
    <div
      onClick={() => onSelect(id)}
      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 bg-white ${
        selected ? 'border-zinc-900' : 'border-gray-200'
      }`}
    >
      <div className="mt-0.5">
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
          selected ? 'border-zinc-900' : 'border-gray-300'
        }`}>
          {selected && <div className="w-2.5 h-2.5 bg-zinc-900 rounded-full" />}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 font-black text-sm text-gray-900 tracking-wider">
          <Icon size={18} />
          <span>{title}</span>
        </div>
        <p className="text-[11px] text-gray-500 font-medium leading-relaxed mt-1">
          {description}
        </p>
      </div>
    </div>
  );
}