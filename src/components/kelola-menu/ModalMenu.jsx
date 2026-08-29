
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function ModalMenu({
  isOpen,
  onClose,
  onSave,
  editingItem,
  categories = [],
}) {
  const [form, setForm] = useState({
    nama: "",
    deskripsi: "",
    harga: "",
    category_id: "",
    gambarUrl: "",
    photo: null,
    isPromo: false,
    labelPromo: "Favorit!",
    isTersedia: true,
  });

  const [imageInputType, setImageInputType] = useState("file");
  const [imagePreview, setImagePreview] = useState("");

  // =========================================================
  // RESET / EDIT FORM
  // =========================================================

  useEffect(() => {
    if (editingItem) {
      setForm({
        nama: editingItem.name || editingItem.nama || "",
        deskripsi:
          editingItem.description ||
          editingItem.deskripsi ||
          "",
        harga:
          editingItem.price ||
          editingItem.harga ||
          "",
        category_id:
          editingItem.category_id ||
          editingItem.category?.id ||
          "",
        gambarUrl:
          editingItem.photo_url ||
          editingItem.gambarUrl ||
          "",
        photo: null,
        isPromo:
          editingItem.label ||
          editingItem.isPromo ||
          false,
        labelPromo:
          editingItem.label ||
          editingItem.labelPromo ||
          "Favorit!",
        isTersedia:
          editingItem.is_active ??
          editingItem.isTersedia ??
          true,
      });

      setImagePreview(
        editingItem.photo_url ||
          editingItem.gambarUrl ||
          ""
      );
    } else {
      setForm({
        nama: "",
        deskripsi: "",
        harga: "",
        category_id:
          categories.length > 0
            ? categories[0].id
            : "",
        gambarUrl: "",
        photo: null,
        isPromo: false,
        labelPromo: "Favorit!",
        isTersedia: true,
      });

      setImagePreview("");
    }
  }, [editingItem, isOpen, categories]);

  if (!isOpen) return null;

  // =========================================================
  // IMAGE UPLOAD
  // =========================================================

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Validasi ukuran maksimal 2MB
    if (file.size > 2 * 1024 * 1024) {
      alert("Ukuran foto maksimal 2MB.");
      e.target.value = "";
      return;
    }

    // Validasi tipe file
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Format foto harus JPG, JPEG, PNG, atau WEBP.");
      e.target.value = "";
      return;
    }

    // Simpan FILE asli untuk dikirim ke backend
    setForm((prev) => ({
      ...prev,
      photo: file,
      gambarUrl: "",
    }));

    // Preview hanya untuk tampilan FE
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  // =========================================================
  // URL IMAGE
  // =========================================================

  const handleImageUrlChange = (e) => {
    const url = e.target.value;

    setForm((prev) => ({
      ...prev,
      gambarUrl: url,
      photo: null,
    }));

    setImagePreview(url);
  };

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = (e) => {
    e.preventDefault();

    onSave({
      nama: form.nama,
      deskripsi: form.deskripsi,
      harga: form.harga,
      category_id: form.category_id || null,

      // URL kalau user memilih URL
      gambarUrl: form.gambarUrl || "",

      // File asli kalau user upload file
      photo: form.photo,

      isPromo: form.isPromo,
      labelPromo: form.isPromo
        ? form.labelPromo
        : null,
      isTersedia: form.isTersedia,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-3 z-50">

      <div className="bg-[#FAF8F5] w-full max-w-[380px] rounded-[28px] p-5 relative shadow-xl">

        {/* ===================================================
            HEADER
        =================================================== */}

        <div className="flex items-center justify-between mb-3">

          <h2 className="text-base font-bold text-[#222222]">
            {editingItem
              ? "Edit Item"
              : "Tambah Item"}
          </h2>

          <button
            onClick={onClose}
            type="button"
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={18} />
          </button>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-2.5"
        >

          {/* =================================================
              NAMA
          ================================================= */}

          <input
            type="text"
            placeholder="Nama item"
            value={form.nama}
            onChange={(e) =>
              setForm({
                ...form,
                nama: e.target.value,
              })
            }
            className="w-full px-3.5 py-2 bg-white rounded-xl border border-gray-200 text-xs outline-none placeholder-gray-400"
            required
          />

          {/* =================================================
              DESKRIPSI
          ================================================= */}

          <textarea
            placeholder="Deskripsi"
            value={form.deskripsi}
            onChange={(e) =>
              setForm({
                ...form,
                deskripsi: e.target.value,
              })
            }
            className="w-full px-3.5 py-2 bg-white rounded-xl border border-gray-200 text-xs outline-none placeholder-gray-400 h-14 resize-none"
          />

          {/* =================================================
              HARGA
          ================================================= */}

          <input
            type="number"
            placeholder="Harga (Rp)"
            value={form.harga}
            onChange={(e) =>
              setForm({
                ...form,
                harga: e.target.value,
              })
            }
            className="w-full px-3.5 py-2 bg-white rounded-xl border border-gray-200 text-xs outline-none placeholder-gray-400"
            required
          />

          {/* =================================================
              KATEGORI
          ================================================= */}

          <div>

            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">
              KATEGORI
            </label>

            {categories.length === 0 ? (
              <div className="bg-[#EFECE6] p-3 rounded-xl text-xs text-gray-500">
                Kategori belum tersedia.
              </div>
            ) : (
              <div className="flex flex-wrap bg-[#EFECE6] p-1 rounded-xl gap-1">

                {categories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() =>
                      setForm({
                        ...form,
                        category_id:
                          category.id,
                      })
                    }
                    className={`flex-1 min-w-[70px] py-1.5 text-xs font-bold rounded-lg transition-all ${
                      Number(form.category_id) ===
                      Number(category.id)
                        ? "bg-[#292827] text-white shadow-sm"
                        : "text-gray-600"
                    }`}
                  >
                    {category.name ||
                      category.nama}
                  </button>
                ))}

              </div>
            )}

          </div>

          {/* =================================================
              FOTO
          ================================================= */}

          <div className="space-y-1.5 pt-0.5">

            <div className="flex items-center justify-between">

              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                FOTO ITEM
              </label>

              <div className="flex text-[10px] bg-gray-200 rounded-lg p-0.5 font-medium">

                <button
                  type="button"
                  onClick={() =>
                    setImageInputType("file")
                  }
                  className={`px-2 py-0.5 rounded-md transition-all ${
                    imageInputType === "file"
                      ? "bg-white text-black font-bold shadow-sm"
                      : "text-gray-500"
                  }`}
                >
                  Upload File
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setImageInputType("url")
                  }
                  className={`px-2 py-0.5 rounded-md transition-all ${
                    imageInputType === "url"
                      ? "bg-white text-black font-bold shadow-sm"
                      : "text-gray-500"
                  }`}
                >
                  URL Link
                </button>

              </div>

            </div>

            <div className="flex items-center gap-2">

              {/* Preview */}
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-9 h-9 object-cover rounded-lg border border-gray-200 shrink-0"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = "none";
                  }}
                />
              )}

              {/* Upload File */}
              {imageInputType === "file" ? (
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/jpg,image/webp"
                  onChange={handleImageUpload}
                  className="w-full text-[11px] text-gray-500 bg-white p-1 rounded-xl border border-gray-200 file:mr-2 file:py-0.5 file:px-2 file:rounded-lg file:border-0 file:text-[10px] file:font-semibold file:bg-gray-100 file:text-gray-700"
                />
              ) : (

                /* URL */
                <input
                  type="text"
                  placeholder="Masukkan URL Gambar (https://...)"
                  value={form.gambarUrl || ""}
                  onChange={handleImageUrlChange}
                  className="w-full px-3 py-1.5 bg-white rounded-xl border border-gray-200 text-xs outline-none placeholder-gray-400"
                />

              )}

            </div>

            <p className="text-[9px] text-gray-400">
              Upload: JPG, PNG, WEBP · Maks. 2MB
            </p>

          </div>

          {/* =================================================
              PROMO
          ================================================= */}

          <div className="bg-[#EFECE6]/60 p-2.5 rounded-xl space-y-2">

            <div className="flex items-center justify-between">

              <span className="text-xs font-bold text-[#222222]">
                Promo / Label
              </span>

              <button
                type="button"
                onClick={() =>
                  setForm({
                    ...form,
                    isPromo: !form.isPromo,
                  })
                }
                className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors duration-300 ${
                  form.isPromo
                    ? "bg-[#292827]"
                    : "bg-gray-300"
                }`}
              >

                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                    form.isPromo
                      ? "translate-x-4"
                      : "translate-x-0"
                  }`}
                />

              </button>

            </div>

            {form.isPromo && (
              <input
                type="text"
                placeholder="Favorit!"
                value={form.labelPromo}
                onChange={(e) =>
                  setForm({
                    ...form,
                    labelPromo:
                      e.target.value,
                  })
                }
                className="w-full px-3 py-1 bg-white rounded-lg border border-gray-200 text-xs font-medium outline-none text-[#222222]"
              />
            )}

          </div>

          {/* =================================================
              TERSEDIA
          ================================================= */}

          <div className="flex items-center justify-between bg-[#EFECE6]/60 p-2.5 rounded-xl">

            <span className="text-xs font-bold text-[#222222]">
              Tersedia
            </span>

            <button
              type="button"
              onClick={() =>
                setForm({
                  ...form,
                  isTersedia:
                    !form.isTersedia,
                })
              }
              className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors duration-300 ${
                form.isTersedia
                  ? "bg-[#292827]"
                  : "bg-gray-300"
              }`}
            >

              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                  form.isTersedia
                    ? "translate-x-4"
                    : "translate-x-0"
                }`}
              />

            </button>

          </div>

          {/* =================================================
              SIMPAN
          ================================================= */}

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

