import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Check, Trash2, Search } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import BottomNavigation from '../components/layout/BottomNavigation';
import ModalEditQR from '../components/kelola-qr/ModalEditQR';
import ModalDeleteQR from '../components/kelola-qr/ModalDeleteQR';

export default function KelolaQR() {
  const [inputNama, setInputNama] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [qrList, setQrList] = useState(() => {
    const saved = localStorage.getItem('qrTableList');
    return saved ? JSON.parse(saved) : [];
  });

  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState(null);

  useEffect(() => {
    localStorage.setItem('qrTableList', JSON.stringify(qrList));
  }, [qrList]);

  const formatTanggal = (date) => {
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const d = new Date(date);
    return `${d.getDate()} - ${months[d.getMonth()]} - ${d.getFullYear()}`;
  };

  const handleAddQR = (e) => {
    e.preventDefault();
    if (!inputNama.trim()) return;

    const qrText = `https://montera.app/table/${encodeURIComponent(inputNama)}`;
    const newQR = {
      id: Date.now(),
      nama: inputNama,
      tanggal: formatTanggal(new Date()),
      qrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrText)}`,
      isTersedia: true,
    };

    setQrList([newQR, ...qrList]);
    setInputNama('');
  };

  const handleSaveEdit = (updatedData) => {
    setQrList(qrList.map((item) => (item.id === updatedData.id ? updatedData : item)));
    setIsModalEditOpen(false);
  };

  const handleOpenDeleteModal = (item) => {
    setDeletingItem(item);
    setIsModalDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingItem) {
      setQrList(qrList.filter((item) => item.id !== deletingItem.id));
      setIsModalDeleteOpen(false);
      setDeletingItem(null);
    }
  };

  // Filter list berdasarkan teks di Search Bar
  const filteredQrList = qrList.filter((item) =>
    item.nama.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-[#FAF8F5] min-h-screen text-[#222222] font-sans relative">
      <Navbar />

      <main className="pt-[80px] pb-28 max-w-[1000px] mx-auto px-6">
        {/* Header Section dengan Search Bar */}
        <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">Kelola QR TABLE</h1>
            <p className="text-sm text-gray-500 font-medium">{qrList.length} QR Code</p>
          </div>

          {/* Search Bar */}
          <div className="relative flex items-center w-full sm:w-64">
            <Search size={16} className="absolute left-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari nomor meja..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#FAF6EE] border border-gray-200/80 rounded-full text-xs outline-none placeholder-gray-400 focus:border-black transition-colors"
            />
          </div>
        </div>

        {/* Form Tambah QR Meja */}
        <div className="bg-[#FAF6EE] p-4 rounded-2xl border border-gray-200/60 mb-6">
          <label className="text-xs font-bold text-[#222222] block mb-2">
            Tambah QR Meja
          </label>
          <form onSubmit={handleAddQR} className="flex gap-2">
            <input
              type="text"
              placeholder="Nomor Meja"
              value={inputNama}
              onChange={(e) => setInputNama(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-[#FAF8F5] border border-gray-300 rounded-xl text-sm outline-none placeholder-gray-400 focus:border-black"
              required
            />
            <button
              type="submit"
              className="bg-[#222222] text-white p-2.5 rounded-xl hover:bg-black transition-colors flex items-center justify-center shrink-0 w-11"
            >
              <Plus size={20} />
            </button>
          </form>
        </div>

        {/* Daftar Kartu QR */}
        <div className="space-y-3">
          {filteredQrList.map((item) => (
            <div
              key={item.id}
              className={`bg-white p-3.5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between transition-all ${
                !item.isTersedia ? 'opacity-60 bg-gray-50' : ''
              }`}
            >
              <div className="flex items-center space-x-3.5">
                <img
                  src={item.qrUrl}
                  alt={item.nama}
                  className="w-14 h-14 object-contain rounded-lg border border-gray-100 bg-white"
                />
                <div>
                  <h3 className="font-bold text-base text-[#222222]">{item.nama}</h3>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">
                    {item.tanggal}
                  </p>
                </div>
              </div>

              <div className="flex flex-col space-y-1.5 items-center">
                <button
                  onClick={() => {
                    setEditingItem(item);
                    setIsModalEditOpen(true);
                  }}
                  className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-600 transition-colors"
                >
                  <Edit2 size={15} />
                </button>

                <div
                  className={`p-1.5 rounded-xl flex items-center justify-center transition-colors ${
                    item.isTersedia
                      ? 'bg-emerald-100 text-emerald-600'
                      : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  <Check size={15} strokeWidth={3} />
                </div>

                <button
                  onClick={() => handleOpenDeleteModal(item)}
                  className="p-1.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl transition-colors"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}

          {filteredQrList.length === 0 && (
            <div className="text-center py-12 text-gray-400 text-sm">
              {searchQuery ? 'Nomor meja tidak ditemukan.' : 'Belum ada QR Code meja yang dibuat.'}
            </div>
          )}
        </div>
      </main>

      {/* Modal Edit QR */}
      <ModalEditQR
        isOpen={isModalEditOpen}
        onClose={() => setIsModalEditOpen(false)}
        onSave={handleSaveEdit}
        editingItem={editingItem}
      />

      {/* Modal Hapus QR */}
      <ModalDeleteQR
        isOpen={isModalDeleteOpen}
        onClose={() => setIsModalDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={deletingItem?.nama}
      />

      <BottomNavigation />
    </div>
  );
}