import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";

export default function ModalEditQR({
  isOpen,
  onClose,
  onSave,
  editingItem,
}) {
  const [namaMeja, setNamaMeja] = useState("");
  const [isTersedia, setIsTersedia] = useState(true);

  useEffect(() => {
    if (editingItem) {
      setNamaMeja(editingItem.nama || "");
      setIsTersedia(editingItem.isTersedia ?? true);
    }
  }, [editingItem, isOpen]);

  if (!isOpen || !editingItem) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    onSave({
      ...editingItem,
      nama: namaMeja,
      isTersedia: isTersedia,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-[#FAF8F5] w-full max-w-[380px] rounded-[28px] p-6 relative shadow-xl">

        {/* Header Modal */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-extrabold text-[#222222]">
            Edit QR Table
          </h2>

          <button
            onClick={onClose}
            type="button"
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Input Nama Meja */}
          <input
            type="text"
            value={namaMeja}
            onChange={(e) => setNamaMeja(e.target.value)}
            className="w-full px-4 py-3 bg-[#FAF8F5] rounded-2xl border border-gray-300 text-sm font-semibold outline-none focus:border-black"
            placeholder="Nomor Meja"
            required
          />

          {/* Pratinjau QR */}
          <div>
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
              QR CODE
            </label>

            <div className="bg-[#FAF8F5] border border-gray-200 rounded-2xl p-4 flex items-center justify-center h-48">

              <QRCodeCanvas
                value={editingItem.qrText || ""}
                size={140}
                bgColor="#ffffff"
                fgColor="#000000"
                level="H"
              />

            </div>
          </div>

          {/* Readonly URL Field */}
          <input
            type="text"
            value={editingItem.qrText || ""}
            readOnly
            className="w-full px-4 py-2.5 bg-[#FAF8F5] rounded-2xl border border-gray-300 text-xs text-gray-400 outline-none cursor-not-allowed"
            placeholder="URL QR"
          />

          {/* Toggle Switch Tersedia */}
          <div className="flex items-center justify-between bg-[#EFECE6]/60 p-3 rounded-2xl">

            <span className="text-sm font-bold text-[#222222]">
              Tersedia
            </span>

            <button
              type="button"
              onClick={() => setIsTersedia(!isTersedia)}
              className={`w-11 h-6 flex items-center rounded-full p-0.5 transition-colors duration-300 ${
                isTersedia
                  ? "bg-[#292827]"
                  : "bg-gray-300"
              }`}
            >
              <div
                className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
                  isTersedia
                    ? "translate-x-5"
                    : "translate-x-0"
                }`}
              />
            </button>

          </div>

          {/* Tombol Simpan */}
          <button
            type="submit"
            className="w-full bg-[#222222] text-white py-3 rounded-2xl font-bold text-sm mt-2 hover:bg-black transition-colors"
          >
            Simpan
          </button>

        </form>
      </div>
    </div>
  );
}