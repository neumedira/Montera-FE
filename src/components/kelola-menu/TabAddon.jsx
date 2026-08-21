import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

export default function TabAddon({ items, onAdd, onDelete }) {
  const [newAddon, setNewAddon] = useState({ nama: '', harga: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newAddon.nama || !newAddon.harga) return;
    onAdd(newAddon);
    setNewAddon({ nama: '', harga: '' });
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-4 space-y-3">
        <h3 className="font-bold text-sm">Tambah Add-on Baru</h3>
        <div className="flex items-center space-x-2">
          <input 
            type="text" 
            placeholder="Nama add-on" 
            value={newAddon.nama}
            onChange={(e) => setNewAddon({ ...newAddon, nama: e.target.value })}
            className="flex-1 bg-[#FAF8F5] p-3 rounded-xl border border-gray-200 text-sm focus:outline-none"
            required
          />
          <input 
            type="number" 
            placeholder="Harga" 
            value={newAddon.harga}
            onChange={(e) => setNewAddon({ ...newAddon, harga: e.target.value })}
            className="w-28 bg-[#FAF8F5] p-3 rounded-xl border border-gray-200 text-sm focus:outline-none"
            required
          />
          <button type="submit" className="bg-[#2B2B2B] hover:bg-black text-white p-3 rounded-xl transition-colors">
            <Plus size={20} />
          </button>
        </div>
      </form>

      {/* Tampilan jika data add-on masih kosong */}
      {(!items || items.length === 0) ? (
        <div className="text-center py-12 text-gray-400 text-sm">
          Belum ada add-on. Buat add-on pertama kamu di atas.
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm">{item.nama}</h4>
                <p className="text-xs text-gray-500">
                  +Rp {Number(item.harga || 0).toLocaleString('id-ID')}
                </p>
              </div>
              <button 
                onClick={() => onDelete(item.id)} 
                className="p-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg transition-colors"
                title="Hapus Add-on"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}