import React from 'react';
import { Edit2, Trash2, Check } from 'lucide-react';

export default function TabBundle({ items = [], menuItems = [], onEdit, onDelete }) {
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400">
        Belum ada paket bundle. Klik "+ Tambah Paket".
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => {
        // Ambil ID menu yang dipilih di dalam bundle
        // Mendukung array ID langsung [1, 2] atau array object [{id: 1}, {id: 2}]
        const selectedIds = (item.selectedMenuItems || []).map((m) =>
          typeof m === 'object' ? m.id : m
        );

        // Cari item menu terkait dari daftar menu utama
        const bundledMenus = menuItems.filter((m) => selectedIds.includes(m.id));

        // Pengecekan: Bundle dianggap TERSEDIA jika SELURUH menu di dalamnya punya status isTersedia !== false
        const isBundleAvailable =
          bundledMenus.length > 0 &&
          bundledMenus.every((m) => m.isTersedia !== false);

        return (
          <div
            key={item.id}
            className={`bg-white p-3.5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between transition-all ${
              !isBundleAvailable ? 'opacity-60 bg-gray-50' : ''
            }`}
          >
            {/* Sisi Kiri: Foto & Detail Paket */}
            <div className="flex items-center space-x-3.5">
              <img
                src={item.gambarUrl || 'https://via.placeholder.com/150'}
                alt={item.nama}
                className="w-14 h-14 object-cover rounded-xl bg-gray-100"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/150';
                }}
              />
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-base text-[#222222]">
                    {item.nama}
                  </h3>

                  {/* Badge penanda jika ada item habis */}
                  {!isBundleAvailable && (
                    <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-md font-bold">
                      Item Tidak Lengkap
                    </span>
                  )}
                </div>

                <p className="text-xs text-gray-400 font-medium my-0.5">
                  {selectedIds.length} item dalam paket
                </p>
                <p className="font-bold text-sm text-[#222222]">
                  Rp {Number(item.harga || 0).toLocaleString('id-ID')}
                </p>
              </div>
            </div>

            {/* Sisi Kanan: Action Buttons (Edit, Status Check, Delete) */}
            <div className="flex flex-col space-y-1.5 items-center">
              {/* Tombol Edit */}
              <button
                onClick={() => onEdit(item)}
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-600 transition-colors"
                title="Edit Paket"
              >
                <Edit2 size={16} />
              </button>

              {/* Indikator Centang Hijau / Abu-abu */}
              <div
                className={`p-2 rounded-xl flex items-center justify-center transition-colors ${
                  isBundleAvailable
                    ? 'bg-emerald-100 text-emerald-600'
                    : 'bg-gray-200 text-gray-400'
                }`}
                title={
                  isBundleAvailable
                    ? 'Paket Aktif & Tersedia'
                    : 'Paket Non-Aktif (Ada menu yang habis)'
                }
              >
                <Check size={16} strokeWidth={3} />
              </div>

              {/* Tombol Delete */}
              <button
                onClick={() => onDelete(item.id)}
                className="p-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl transition-colors"
                title="Hapus Paket"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}