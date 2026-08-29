import React from "react";
import { Edit2, Trash2 } from "lucide-react";

export default function TabKategori({ items, onEdit, onDelete }) {
  if (!items || items.length === 0) {
    return (
      <div className="py-20 text-center bg-white rounded-2xl border border-gray-100 shadow-sm mt-4">
        <p className="text-gray-500 text-sm">Belum ada kategori. Silakan tambah kategori baru.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 mt-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-sm"
        >
          <div>
            <h3 className="font-bold text-[#222222]">{item.name || item.nama}</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(item)}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={() => onDelete(item.id)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}