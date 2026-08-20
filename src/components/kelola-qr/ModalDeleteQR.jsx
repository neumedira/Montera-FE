import React from 'react';
import { Trash2 } from 'lucide-react';

export default function ModalDeleteQR({ isOpen, onClose, onConfirm, itemName }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-[#FAF8F5] w-full max-w-[360px] rounded-[28px] p-6 text-center shadow-xl">
        {/* Circle Icon Trash */}
        <div className="w-14 h-14 bg-[#222222] text-white rounded-full flex items-center justify-center mx-auto mb-4">
          <Trash2 size={24} />
        </div>

        {/* Title */}
        <h3 className="text-xl font-extrabold text-[#222222] mb-2">
          Hapus QR Code?
        </h3>

        {/* Description */}
        <p className="text-xs text-gray-600 font-medium leading-relaxed mb-6 px-2">
          Apakah Anda yakin ingin menghapus<br />
          QR Code <span className="font-bold text-[#222222]">"{itemName}"</span>?
        </p>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 bg-transparent border border-[#222222] text-[#222222] rounded-2xl font-bold text-sm hover:bg-gray-100 transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="w-full py-3 bg-[#222222] text-white rounded-2xl font-bold text-sm hover:bg-black transition-colors"
          >
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>
  );
}