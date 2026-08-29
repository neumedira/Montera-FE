
import React from "react";
import { Edit2, Trash2 } from "lucide-react";

export default function TabMenu({ items, onEdit, onDelete }) {
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400">
        Belum ada menu. Klik "+ Tambah".
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => {
        // Ambil URL gambar dari beberapa kemungkinan field
        const imageUrl =
          item.photo_url ||
          item.gambarUrl ||
          item.photo ||
          "";

        return (
          <div
            key={item.id}
            className={`bg-white p-3.5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between transition-all ${
              !item.isTersedia ? "opacity-60" : ""
            }`}
          >
            <div className="flex items-center space-x-3.5">
              
              {/* FOTO MENU */}
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={item.nama}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error(
                        "Gagal menampilkan gambar:",
                        imageUrl
                      );

                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-[10px]">
                    No Image
                  </div>
                )}
              </div>

              {/* INFO MENU */}
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-base text-[#222222]">
                    {item.nama}
                  </h3>

                  {/* BADGE PROMO */}
                  {item.isPromo && (
                    <span className="text-[10px] bg-orange-100 text-orange-600 px-2 py-0.5 rounded-md font-bold">
                      {item.labelPromo || "Favorit!"}
                    </span>
                  )}

                  {/* BADGE HABIS */}
                  {!item.isTersedia && (
                    <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-md font-bold">
                      Habis
                    </span>
                  )}
                </div>

                <span className="text-xs text-gray-400 inline-block my-0.5 font-medium">
                  {item.kategori || "Tanpa kategori"}
                </span>

                <p className="font-bold text-sm text-[#222222]">
                  Rp{" "}
                  {Number(item.harga || 0).toLocaleString("id-ID")}
                </p>
              </div>
            </div>

            {/* ACTION */}
            <div className="flex space-x-2">
              <button
                onClick={() => onEdit(item)}
                className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-600 transition-colors"
                title="Edit Item"
              >
                <Edit2 size={16} />
              </button>

              <button
                onClick={() => onDelete(item.id)}
                className="p-2.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl transition-colors"
                title="Hapus Item"
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

