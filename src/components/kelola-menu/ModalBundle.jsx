
import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

export default function ModalBundle({
  isOpen,
  onClose,
  onSave,
  editingItem,
  menuList = [],
}) {
  const [form, setForm] = useState({
    name: "",
    normal_price: "",
    bundle_price: "",
    photo: null,
    photoPreview: "",
    items: [],
    is_active: true,
  });

  // =========================================================
  // RESET / EDIT FORM
  // =========================================================

  useEffect(() => {
    if (!isOpen) return;

    if (editingItem) {
      const existingItems =
        editingItem.items?.map((item) => ({
          menu_item_id:
            item.menu_item_id ??
            item.menuItem?.id ??
            item.menu_item?.id ??
            item.id,

          quantity: item.quantity ?? 1,
        })) || [];

      setForm({
        name: editingItem.name ?? "",

        normal_price:
          editingItem.normal_price ?? "",

        bundle_price:
          editingItem.bundle_price ?? "",

        // Foto baru selalu null ketika edit
        photo: null,

        // Foto lama ambil dari photo_url
        photoPreview:
          editingItem.photo_url ??
          editingItem.photo ??
          "",

        items: existingItems,

        is_active:
          editingItem.is_active ?? true,
      });
    } else {
      setForm({
        name: "",
        normal_price: "",
        bundle_price: "",
        photo: null,
        photoPreview: "",
        items: [],
        is_active: true,
      });
    }
  }, [editingItem, isOpen]);

  if (!isOpen) return null;

  // =========================================================
  // HANDLE INPUT
  // =========================================================

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // =========================================================
  // FOTO
  // =========================================================

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      console.log("Tidak ada file yang dipilih.");
      return;
    }

    // =======================================================
    // DEBUG FILE
    // =======================================================

    console.log("========================================");
    console.log("BUNDLE FOTO DIPILIH:");
    console.log("File:", file);
    console.log("Nama:", file.name);
    console.log("Type:", file.type);
    console.log("Size:", file.size);
    console.log("========================================");

    // =======================================================
    // VALIDASI UKURAN
    // =======================================================

    if (file.size > 2 * 1024 * 1024) {
      alert("Ukuran foto maksimal 2MB.");
      e.target.value = "";
      return;
    }

    // =======================================================
    // VALIDASI FORMAT
    // =======================================================

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert(
        "Format foto harus JPG, JPEG, PNG, atau WEBP."
      );

      e.target.value = "";
      return;
    }

    // =======================================================
    // PREVIEW
    // =======================================================

    const previewUrl = URL.createObjectURL(file);

    setForm((prev) => ({
      ...prev,

      // File asli dikirim ke backend
      photo: file,

      // URL blob hanya untuk preview
      photoPreview: previewUrl,
    }));

    console.log(
      "PHOTO STATE DISET KE FILE:",
      file
    );
  };

  // =========================================================
  // PILIH MENU
  // =========================================================

  const toggleMenu = (menuId) => {
    setForm((prev) => {
      const exists = prev.items.some(
        (item) =>
          Number(item.menu_item_id) ===
          Number(menuId)
      );

      if (exists) {
        return {
          ...prev,

          items: prev.items.filter(
            (item) =>
              Number(item.menu_item_id) !==
              Number(menuId)
          ),
        };
      }

      return {
        ...prev,

        items: [
          ...prev.items,

          {
            menu_item_id: menuId,
            quantity: 1,
          },
        ],
      };
    });
  };

  // =========================================================
  // QUANTITY
  // =========================================================

  const updateQuantity = (
    menuId,
    quantity
  ) => {
    const parsedQuantity = Number(quantity);

    setForm((prev) => ({
      ...prev,

      items: prev.items.map((item) =>
        Number(item.menu_item_id) ===
        Number(menuId)
          ? {
              ...item,

              quantity:
                parsedQuantity > 0
                  ? parsedQuantity
                  : 1,
            }
          : item
      ),
    }));
  };

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = (e) => {
    e.preventDefault();

    // =======================================================
    // VALIDASI NAMA
    // =======================================================

    if (!form.name.trim()) {
      alert("Nama paket wajib diisi.");
      return;
    }

    // =======================================================
    // VALIDASI HARGA NORMAL
    // =======================================================

    if (
      form.normal_price === "" ||
      Number(form.normal_price) < 0
    ) {
      alert("Harga normal wajib diisi.");
      return;
    }

    // =======================================================
    // VALIDASI HARGA BUNDLE
    // =======================================================

    if (
      form.bundle_price === "" ||
      Number(form.bundle_price) < 0
    ) {
      alert("Harga paket wajib diisi.");
      return;
    }

    // =======================================================
    // PAYLOAD
    // =======================================================

    const payload = {
      name: form.name.trim(),

      normal_price:
        Number(form.normal_price),

      bundle_price:
        Number(form.bundle_price),

      // PENTING:
      // Yang dikirim adalah FILE asli.
      photo: form.photo,

      is_active: form.is_active,

      items: form.items.map((item) => ({
        menu_item_id:
          Number(item.menu_item_id),

        quantity:
          Number(item.quantity) || 1,
      })),
    };

    // =======================================================
    // DEBUG PAYLOAD
    // =======================================================

    console.log("========================================");
    console.log("MODAL BUNDLE PAYLOAD:");
    console.log("Name:", payload.name);
    console.log(
      "Normal Price:",
      payload.normal_price
    );
    console.log(
      "Bundle Price:",
      payload.bundle_price
    );
    console.log(
      "Photo:",
      payload.photo
    );
    console.log(
      "Photo instanceof File:",
      payload.photo instanceof File
    );
    console.log(
      "Photo name:",
      payload.photo?.name
    );
    console.log(
      "Items:",
      payload.items
    );
    console.log("========================================");

    // =======================================================
    // KIRIM KE KELOLA MENU
    // =======================================================

    onSave(payload);
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">

      <div className="bg-[#FAF8F5] w-full max-w-md rounded-3xl p-6 relative max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

        {/* ===================================================
            CLOSE
        =================================================== */}

        <button
          onClick={onClose}
          type="button"
          className="absolute right-5 top-5 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        {/* ===================================================
            TITLE
        =================================================== */}

        <h2 className="text-lg font-bold mb-4">
          {editingItem
            ? "Edit Paket"
            : "Tambah Paket Baru"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-3"
        >

          {/* =================================================
              NAMA
          ================================================= */}

          <input
            type="text"
            placeholder="Nama paket"
            value={form.name}
            onChange={(e) =>
              handleChange(
                "name",
                e.target.value
              )
            }
            className="w-full p-3 bg-white rounded-xl border border-gray-200 text-sm outline-none"
            required
          />

          {/* =================================================
              HARGA NORMAL
          ================================================= */}

          <input
            type="number"
            min="0"
            placeholder="Harga normal (Rp)"
            value={form.normal_price}
            onChange={(e) =>
              handleChange(
                "normal_price",
                e.target.value
              )
            }
            className="w-full p-3 bg-white rounded-xl border border-gray-200 text-sm outline-none"
            required
          />

          {/* =================================================
              HARGA BUNDLE
          ================================================= */}

          <input
            type="number"
            min="0"
            placeholder="Harga bundling (Rp)"
            value={form.bundle_price}
            onChange={(e) =>
              handleChange(
                "bundle_price",
                e.target.value
              )
            }
            className="w-full p-3 bg-white rounded-xl border border-gray-200 text-sm outline-none"
            required
          />

          {/* =================================================
              FOTO
          ================================================= */}

          <div className="space-y-2 pt-2">

            <label className="text-xs font-bold text-gray-500 uppercase">
              Foto Paket (Opsional)
            </label>

            {form.photoPreview && (
              <img
                src={form.photoPreview}
                alt="Preview"
                className="w-full h-32 object-cover rounded-xl"
                onError={(e) => {
                  e.currentTarget.style.display =
                    "none";
                }}
              />
            )}

            <input
              type="file"
              accept="image/jpeg,image/png,image/jpg,image/webp"
              onChange={handleImageUpload}
              className="w-full text-xs text-gray-500 bg-white p-2 rounded-xl border border-gray-200"
            />

            <p className="text-[10px] text-gray-400">
              JPG, PNG, WEBP · Maks. 2MB
            </p>

          </div>

          {/* =================================================
              ISI PAKET
          ================================================= */}

          <div className="space-y-2 pt-2">

            <label className="text-xs font-bold text-gray-500 uppercase">
              Isi Paket
            </label>

            <div className="space-y-2 max-h-40 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

              {menuList.length > 0 ? (
                menuList.map((menu) => {
                  const selectedItem =
                    form.items.find(
                      (item) =>
                        Number(
                          item.menu_item_id
                        ) ===
                        Number(menu.id)
                    );

                  const isSelected =
                    Boolean(selectedItem);

                  return (
                    <div
                      key={menu.id}
                      className="p-3 bg-white rounded-xl border border-gray-200"
                    >

                      <div className="flex items-center justify-between">

                        <label className="flex items-center gap-3 cursor-pointer">

                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() =>
                              toggleMenu(
                                menu.id
                              )
                            }
                            className="w-5 h-5 accent-[#2B2B2B]"
                          />

                          <div>
                            <p className="text-sm font-semibold">
                              {menu.nama ??
                                menu.name}
                            </p>

                            <p className="text-xs text-gray-400">
                              Rp{" "}
                              {Number(
                                menu.harga ??
                                  menu.price ??
                                  0
                              ).toLocaleString(
                                "id-ID"
                              )}
                            </p>
                          </div>

                        </label>

                        {isSelected && (
                          <input
                            type="number"
                            min="1"
                            value={
                              selectedItem.quantity
                            }
                            onChange={(e) =>
                              updateQuantity(
                                menu.id,
                                e.target.value
                              )
                            }
                            className="w-16 px-2 py-1 text-center text-xs border border-gray-200 rounded-lg outline-none"
                          />
                        )}

                      </div>

                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-gray-400 italic p-2">
                  Belum ada item menu yang
                  bisa dipilih. Tambahkan
                  menu terlebih dahulu di
                  tab "Menu".
                </p>
              )}

            </div>
          </div>

          {/* =================================================
              STATUS
          ================================================= */}

          <div className="flex items-center justify-between bg-[#EFECE6]/60 p-3 rounded-xl">

            <span className="text-sm font-bold text-[#222222]">
              Tersedia
            </span>

            <button
              type="button"
              onClick={() =>
                setForm((prev) => ({
                  ...prev,

                  is_active:
                    !prev.is_active,
                }))
              }
              className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors ${
                form.is_active
                  ? "bg-[#292827]"
                  : "bg-gray-300"
              }`}
            >

              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  form.is_active
                    ? "translate-x-4"
                    : "translate-x-0"
                }`}
              />

            </button>

          </div>

          {/* =================================================
              SAVE
          ================================================= */}

          <button
            type="submit"
            className="w-full bg-[#2B2B2B] text-white py-3 rounded-xl font-bold mt-4"
          >
            Simpan Paket
          </button>

        </form>
      </div>
    </div>
  );
}

