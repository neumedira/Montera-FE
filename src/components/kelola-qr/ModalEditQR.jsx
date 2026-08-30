import React, {
  useEffect,
  useState,
} from "react";

import {
  X,
} from "lucide-react";

import {
  QRCodeCanvas,
} from "qrcode.react";

export default function ModalEditQR({
  isOpen,
  onClose,
  onSave,
  editingItem,
  saving = false,
}) {
  const [
    namaMeja,
    setNamaMeja,
  ] = useState("");

  const [
    isTersedia,
    setIsTersedia,
  ] = useState(true);

  useEffect(() => {
    if (!editingItem) {
      return;
    }

    setNamaMeja(
      editingItem.table_number ??
        editingItem.nama ??
        ""
    );

    setIsTersedia(
      editingItem.is_active ??
        editingItem.isTersedia ??
        true
    );
  }, [
    editingItem,
    isOpen,
  ]);

  if (
    !isOpen ||
    !editingItem
  ) {
    return null;
  }

  const qrText =
    editingItem.qr_code_url ??
    editingItem.qrText ??
    "";

  const handleSubmit = (
    event
  ) => {
    event.preventDefault();

    if (saving) {
      return;
    }

    const tableNumber =
      namaMeja.trim();

    if (!tableNumber) {
      return;
    }

    onSave({
      ...editingItem,

      table_number:
        tableNumber,

      is_active:
        Boolean(
          isTersedia
        ),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">

      <div className="bg-[#FAF8F5] w-full max-w-[380px] rounded-[28px] p-6 relative shadow-xl">

        {/* HEADER */}

        <div className="flex items-center justify-between mb-4">

          <h2 className="text-xl font-extrabold text-[#222222]">
            Edit QR Table
          </h2>

          <button
            type="button"
            onClick={
              onClose
            }
            disabled={
              saving
            }
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <X
              size={20}
            />
          </button>

        </div>

        <form
          onSubmit={
            handleSubmit
          }
          className="space-y-4"
        >

          {/* INPUT NOMOR MEJA */}

          <div>

            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
              Nomor Meja
            </label>

            <input
              type="text"
              value={
                namaMeja
              }
              onChange={(event) =>
                setNamaMeja(
                  event.target.value
                )
              }
              disabled={
                saving
              }
              className="w-full px-4 py-3 bg-[#FAF8F5] rounded-2xl border border-gray-300 text-sm font-semibold outline-none focus:border-black disabled:opacity-50"
              placeholder="Nomor Meja"
              required
            />

          </div>

          {/* PRATINJAU QR */}

          <div>

            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
              QR CODE
            </label>

            <div className="bg-[#FAF8F5] border border-gray-200 rounded-2xl p-4 flex items-center justify-center h-48">

              {qrText ? (
                <QRCodeCanvas
                  value={
                    qrText
                  }
                  size={
                    140
                  }
                  bgColor="#ffffff"
                  fgColor="#000000"
                  level="H"
                />
              ) : (
                <p className="text-xs text-gray-400">
                  QR Code belum tersedia.
                </p>
              )}

            </div>

          </div>

          {/* QR URL */}

          <div>

            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
              QR URL
            </label>

            <input
              type="text"
              value={
                qrText
              }
              readOnly
              className="w-full px-4 py-2.5 bg-[#FAF8F5] rounded-2xl border border-gray-300 text-xs text-gray-400 outline-none cursor-not-allowed"
            />

          </div>

          {/* STATUS */}

          <div className="flex items-center justify-between bg-[#EFECE6]/60 p-3 rounded-2xl">

            <span className="text-sm font-bold text-[#222222]">
              Tersedia
            </span>

            <button
              type="button"
              disabled={
                saving
              }
              onClick={() =>
                setIsTersedia(
                  (prev) =>
                    !prev
                )
              }
              className={`w-11 h-6 flex items-center rounded-full p-0.5 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
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

          {/* SIMPAN */}

          <button
            type="submit"
            disabled={
              saving ||
              !namaMeja.trim()
            }
            className="w-full bg-[#222222] text-white py-3 rounded-2xl font-bold text-sm mt-2 hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving
              ? "Menyimpan..."
              : "Simpan"}
          </button>

        </form>

      </div>

    </div>
  );
}