import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function ModalKategori({ isOpen, onClose, onSave, editingItem }) {
  const [nama, setNama] = useState("");

  useEffect(() => {
    if (editingItem) {
      setNama(editingItem.name || editingItem.nama || "");
    } else {
      setNama("");
    }
  }, [editingItem, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ nama });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl relative">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="font-bold text-lg text-[#222222]">
            {editingItem ? "Edit Kategori" : "Tambah Kategori"}
          </h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Nama Kategori</label>
            <input
              type="text"
              required
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-black outline-none transition-colors"
              placeholder="Contoh: Makanan Utama, Minuman, Dessert"
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-[#2B2B2B] text-white font-bold rounded-xl py-3 mt-2 hover:bg-black transition-colors"
          >
            Simpan Kategori
          </button>
        </form>
      </div>
    </div>
  );
}