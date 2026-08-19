import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function ModalMenu({ isOpen, onClose, onSave, editingItem }) {
  const [form, setForm] = useState({
    nama: '',
    deskripsi: '',
    harga: '',
    kategori: 'Makanan',
    gambarUrl: '',
    isPromo: false,
    labelPromo: 'Favorit!',
    isTersedia: true,
  });

  // State untuk memilih metode input foto (file upload atau link URL)
  const [imageInputType, setImageInputType] = useState('file');

  useEffect(() => {
    if (editingItem) {
      setForm({
        ...editingItem,
        isPromo: editingItem.isPromo ?? false,
        labelPromo: editingItem.labelPromo || 'Favorit!',
        isTersedia: editingItem.isTersedia ?? true,
      });
    } else {
      setForm({
        nama: '',
        deskripsi: '',
        harga: '',
        kategori: 'Makanan',
        gambarUrl: '',
        isPromo: false,
        labelPromo: 'Favorit!',
        isTersedia: true,
      });
    }
  }, [editingItem, isOpen]);

  if (!isOpen) return null;

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, gambarUrl: reader.result }));
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-3 z-50">
      <div className="bg-[#FAF8F5] w-full max-w-[380px] rounded-[28px] p-5 relative shadow-xl">
        {/* Header Modal */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-[#222222]">
            {editingItem ? 'Edit Item' : 'Tambah Item'}
          </h2>
          <button
            onClick={onClose}
            type="button"
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-2.5">
          {/* Input Nama Item */}
          <input
            type="text"
            placeholder="Nama item"
            value={form.nama}
            onChange={(e) => setForm({ ...form, nama: e.target.value })}
            className="w-full px-3.5 py-2 bg-white rounded-xl border border-gray-200 text-xs outline-none placeholder-gray-400"
            required
          />

          {/* Input Deskripsi */}
          <textarea
            placeholder="Deskripsi"
            value={form.deskripsi}
            onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
            className="w-full px-3.5 py-2 bg-white rounded-xl border border-gray-200 text-xs outline-none placeholder-gray-400 h-14 resize-none"
          />

          {/* Input Harga */}
          <input
            type="number"
            placeholder="Harga (Rp)"
            value={form.harga}
            onChange={(e) => setForm({ ...form, harga: e.target.value })}
            className="w-full px-3.5 py-2 bg-white rounded-xl border border-gray-200 text-xs outline-none placeholder-gray-400"
            required
          />

          {/* Kategori Toggle */}
          <div className="flex bg-[#EFECE6] p-1 rounded-xl">
            {['Makanan', 'Minuman'].map((kat) => (
              <button
                key={kat}
                type="button"
                onClick={() => setForm({ ...form, kategori: kat })}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  form.kategori === kat
                    ? 'bg-[#292827] text-white shadow-sm'
                    : 'text-gray-600'
                }`}
              >
                {kat}
              </button>
            ))}
          </div>

          {/* Opsi Foto Item (File / URL Switcher) */}
          <div className="space-y-1.5 pt-0.5">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                FOTO ITEM
              </label>
              <div className="flex text-[10px] bg-gray-200 rounded-lg p-0.5 font-medium">
                <button
                  type="button"
                  onClick={() => setImageInputType('file')}
                  className={`px-2 py-0.5 rounded-md transition-all ${
                    imageInputType === 'file' ? 'bg-white text-black font-bold shadow-sm' : 'text-gray-500'
                  }`}
                >
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setImageInputType('url')}
                  className={`px-2 py-0.5 rounded-md transition-all ${
                    imageInputType === 'url' ? 'bg-white text-black font-bold shadow-sm' : 'text-gray-500'
                  }`}
                >
                  URL Link
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {form.gambarUrl && (
                <img
                  src={form.gambarUrl}
                  alt="Preview"
                  className="w-9 h-9 object-cover rounded-lg border border-gray-200 shrink-0"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/150';
                  }}
                />
              )}

              {imageInputType === 'file' ? (
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full text-[11px] text-gray-500 bg-white p-1 rounded-xl border border-gray-200 file:mr-2 file:py-0.5 file:px-2 file:rounded-lg file:border-0 file:text-[10px] file:font-semibold file:bg-gray-100 file:text-gray-700"
                />
              ) : (
                <input
                  type="text"
                  placeholder="Masukkan URL Gambar (https://...)"
                  value={form.gambarUrl}
                  onChange={(e) => setForm({ ...form, gambarUrl: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white rounded-xl border border-gray-200 text-xs outline-none placeholder-gray-400"
                />
              )}
            </div>
          </div>

          {/* Switch Promo / Label */}
          <div className="bg-[#EFECE6]/60 p-2.5 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#222222]">
                Promo / Label
              </span>
              <button
                type="button"
                onClick={() => setForm({ ...form, isPromo: !form.isPromo })}
                className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors duration-300 ${
                  form.isPromo ? 'bg-[#292827]' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                    form.isPromo ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {form.isPromo && (
              <input
                type="text"
                placeholder="Favorit!"
                value={form.labelPromo}
                onChange={(e) => setForm({ ...form, labelPromo: e.target.value })}
                className="w-full px-3 py-1 bg-white rounded-lg border border-gray-200 text-xs font-medium outline-none text-[#222222]"
              />
            )}
          </div>

          {/* Switch Tersedia */}
          <div className="flex items-center justify-between bg-[#EFECE6]/60 p-2.5 rounded-xl">
            <span className="text-xs font-bold text-[#222222]">Tersedia</span>
            <button
              type="button"
              onClick={() =>
                setForm({ ...form, isTersedia: !form.isTersedia })
              }
              className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors duration-300 ${
                form.isTersedia ? 'bg-[#292827]' : 'bg-gray-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                  form.isTersedia ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Tombol Simpan */}
          <button
            type="submit"
            className="w-full bg-[#292827] text-white py-2.5 rounded-xl font-bold text-xs mt-2 hover:bg-black transition-colors"
          >
            Simpan
          </button>
        </form>
      </div>
    </div>
  );
}