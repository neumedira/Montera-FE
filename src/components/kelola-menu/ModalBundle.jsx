import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function ModalBundle({ isOpen, onClose, onSave, editingItem, menuList }) {
  const [form, setForm] = useState({
    nama: '', deskripsi: '', harga: '', gambarUrl: '',
    selectedMenuItems: [], isTersedia: true
  });

  // Reset / isi form setiap kali modal dibuka atau editingItem berubah
  useEffect(() => {
    if (editingItem) {
      setForm(editingItem);
    } else {
      setForm({
        nama: '', deskripsi: '', harga: '', gambarUrl: '',
        selectedMenuItems: [], isTersedia: true
      });
    }
  }, [editingItem, isOpen]);

  if (!isOpen) return null;

  const toggleMenu = (id) => {
    const exists = form.selectedMenuItems.includes(id);
    setForm({
      ...form,
      selectedMenuItems: exists 
        ? form.selectedMenuItems.filter(i => i !== id) 
        : [...form.selectedMenuItems, id]
    });
  };

  // Handler upload foto ke format Base64
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(prev => ({ ...prev, gambarUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalImage = form.gambarUrl || 'https://via.placeholder.com/150';
    onSave({ ...form, gambarUrl: finalImage });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      {/* Scrollbar disembunyikan pada kontainer utama modal */}
      <div className="bg-[#FAF8F5] w-full max-w-md rounded-3xl p-6 relative max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <button 
          onClick={onClose} 
          type="button" 
          className="absolute right-5 top-5 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>
        <h2 className="text-lg font-bold mb-4">{editingItem ? 'Edit Paket' : 'Tambah Paket Baru'}</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input 
            type="text" 
            placeholder="Nama paket" 
            value={form.nama} 
            onChange={(e) => setForm({ ...form, nama: e.target.value })} 
            className="w-full p-3 bg-white rounded-xl border border-gray-200 text-sm outline-none" 
            required 
          />
          <textarea 
            placeholder="Deskripsi paket" 
            value={form.deskripsi} 
            onChange={(e) => setForm({ ...form, deskripsi: e.target.value })} 
            className="w-full p-3 bg-white rounded-xl border border-gray-200 text-sm outline-none h-20" 
          />
          <input 
            type="number" 
            placeholder="Harga bundling (Rp)" 
            value={form.harga} 
            onChange={(e) => setForm({ ...form, harga: e.target.value })} 
            className="w-full p-3 bg-white rounded-xl border border-gray-200 text-sm outline-none" 
            required 
          />

          {/* Bagian Foto Paket */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-bold text-gray-500 uppercase">Foto Paket (Opsional)</label>
            {form.gambarUrl && (
              <img src={form.gambarUrl} alt="Preview" className="w-full h-32 object-cover rounded-xl" />
            )}
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageUpload} 
              className="w-full text-xs text-gray-500 bg-white p-2 rounded-xl border border-gray-200" 
            />
          </div>

          {/* Pilihan Isi Paket */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-bold text-gray-500 uppercase">Isi Paket</label>
            {/* Scrollbar disembunyikan pada daftar isi paket */}
            <div className="space-y-2 max-h-40 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {menuList && menuList.length > 0 ? (
                menuList.map((m) => (
                  <label key={m.id} className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50">
                    <div>
                      <p className="text-sm font-semibold">{m.nama}</p>
                      <p className="text-xs text-gray-400">Rp {Number(m.harga || 0).toLocaleString('id-ID')}</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={form.selectedMenuItems.includes(m.id)} 
                      onChange={() => toggleMenu(m.id)} 
                      className="w-5 h-5 accent-[#2B2B2B]" 
                    />
                  </label>
                ))
              ) : (
                <p className="text-xs text-gray-400 italic p-2">Belum ada item menu yang bisa dipilih. Tambahkan menu terlebih dahulu di tab "Menu".</p>
              )}
            </div>
          </div>

          <button type="submit" className="w-full bg-[#2B2B2B] text-white py-3 rounded-xl font-bold mt-4">
            Simpan Paket
          </button>
        </form>
      </div>
    </div>
  );
}