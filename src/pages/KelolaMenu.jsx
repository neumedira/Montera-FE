import React, { useState, useEffect } from "react";
import {
  Plus,
  Utensils,
  Package,
  PlusCircle,
  Search,
  Tags,
} from "lucide-react";

import TabMenu from "../components/kelola-menu/TabMenu";
import TabBundle from "../components/kelola-menu/TabBundle";
import TabAddon from "../components/kelola-menu/TabAddon";
import TabKategori from "../components/kelola-menu/TabKategori";

import ModalMenu from "../components/kelola-menu/ModalMenu";
import ModalBundle from "../components/kelola-menu/ModalBundle";
import ModalKategori from "../components/kelola-menu/ModalKategori";

import Navbar from "../components/layout/Navbar";
import BottomNavigation from "../components/layout/BottomNavigation";

import {
  getMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,

  getMenuCategories,
  createMenuCategory,
  updateMenuCategory,
  deleteMenuCategory,

  getBundles,
  createBundle,
  updateBundle,
  deleteBundle,

  getAddons,
  createAddon,
  updateAddon,
  deleteAddon,
} from "../api/admin";

// =========================================================
// BASE URL
// =========================================================

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// =========================================================
// HELPER FOTO
// =========================================================

const getImageUrl = (photo) => {
  if (!photo) {
    return "";
  }

  const value = String(photo).trim();

  if (!value) {
    return "";
  }

  // URL lengkap
  if (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("blob:")
  ) {
    return value;
  }

  // /storage/xxx
  if (value.startsWith("/storage/")) {
    return `${BACKEND_URL}${value}`;
  }

  // storage/xxx
  if (value.startsWith("storage/")) {
    return `${BACKEND_URL}/${value}`;
  }

  // /xxx
  if (value.startsWith("/")) {
    return `${BACKEND_URL}/storage${value}`;
  }

  // xxx
  return `${BACKEND_URL}/storage/${value}`;
};

// =========================================================
// AMBIL FOTO
// =========================================================

const getPhotoFromItem = (item) => {
  if (!item) {
    return "";
  }

  const possiblePhotos = [
    item.photo_url,
    item.photoUrl,
    item.photo,
    item.image_url,
    item.imageUrl,
    item.gambarUrl,
    item.image,
  ];

  for (const photo of possiblePhotos) {
    if (
      photo !== null &&
      photo !== undefined &&
      String(photo).trim() !== ""
    ) {
      return photo;
    }
  }

  return "";
};

// =========================================================
// NORMALISASI PHOTO
// =========================================================

const normalizePhoto = (item) => {
  const rawPhoto = getPhotoFromItem(item);

  return {
    raw: rawPhoto,
    url: getImageUrl(rawPhoto),
  };
};

// =========================================================
// COMPONENT
// =========================================================

export default function KelolaMenu() {
  const [activeTab, setActiveTab] = useState("menu");
  const [searchQuery, setSearchQuery] = useState("");

  // =========================================================
  // DATA
  // =========================================================

  const [menuItems, setMenuItems] = useState([]);
  const [menuCategories, setMenuCategories] = useState([]);
  const [bundleItems, setBundleItems] = useState([]);
  const [addonItems, setAddonItems] = useState([]);

  const [menuLoading, setMenuLoading] = useState(false);
  const [bundleLoading, setBundleLoading] = useState(false);
  const [addonLoading, setAddonLoading] = useState(false);
  const [categoryLoading, setCategoryLoading] = useState(false);

  // =========================================================
  // MODALS
  // =========================================================

  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState(null);

  const [isBundleModalOpen, setIsBundleModalOpen] = useState(false);
  const [editingBundleItem, setEditingBundleItem] = useState(null);

  const [isKategoriModalOpen, setIsKategoriModalOpen] = useState(false);
  const [editingKategoriItem, setEditingKategoriItem] = useState(null);

  // =========================================================
  // FETCH
  // =========================================================

  useEffect(() => {
    fetchMenuItems();
    fetchMenuCategories();
    fetchBundles();
    fetchAddons();
  }, []);

  // =========================================================
  // FETCH MENU
  // =========================================================

  const fetchMenuItems = async () => {
    try {
      setMenuLoading(true);

      const response = await getMenuItems();

      console.log("MENU ITEMS API:", response);

      const data = Array.isArray(response?.data)
        ? response.data
        : [];

      const formattedItems = data.map((item) => {
        const photo = normalizePhoto(item);

        console.log("MENU FOTO:", {
          id: item.id,
          name: item.name,
          raw: photo.raw,
          url: photo.url,
        });

        return {
          ...item,

          id: item.id,

          nama: item.name || item.nama || "",

          harga:
            item.price ??
            item.harga ??
            0,

          deskripsi:
            item.description ??
            item.deskripsi ??
            "",

          // FOTO
          gambarUrl: photo.url,

          // simpan nilai asli
          originalPhoto: photo.raw,

          photo_url:
            item.photo_url ??
            null,

          photo:
            item.photo ??
            null,

          labelPromo:
            item.label ??
            item.labelPromo ??
            "",

          isPromo:
            Boolean(
              item.label ??
              item.labelPromo
            ),

          isTersedia:
            item.is_active !== undefined
              ? Boolean(item.is_active)
              : true,

          addons:
            Array.isArray(item.addons)
              ? item.addons
              : [],

          kategori:
            item.category?.name ??
            item.category?.nama ??
            "",
        };
      });

      setMenuItems(formattedItems);
    } catch (error) {
      console.error(
        "Gagal mengambil menu:",
        error
      );

      console.error(
        "Response:",
        error.response?.data
      );
    } finally {
      setMenuLoading(false);
    }
  };

  // =========================================================
  // FETCH CATEGORY
  // =========================================================

  const fetchMenuCategories = async () => {
    try {
      setCategoryLoading(true);

      const response =
        await getMenuCategories();

      const data = Array.isArray(response?.data)
        ? response.data
        : [];

      setMenuCategories(data);
    } catch (error) {
      console.error(
        "Gagal mengambil kategori:",
        error
      );
    } finally {
      setCategoryLoading(false);
    }
  };

  // =========================================================
  // FETCH BUNDLE
  // =========================================================

  const fetchBundles = async () => {
    try {
      setBundleLoading(true);

      const response =
        await getBundles();

      console.log(
        "BUNDLES API:",
        response
      );

      const data = Array.isArray(response?.data)
        ? response.data
        : [];

      const formattedBundles =
        data.map((item) => {
          const bundleItemsFromBackend =
            item.items ??
            item.menu_items ??
            item.menuItems ??
            [];

          const selectedMenuItems =
            bundleItemsFromBackend.map(
              (bundleItem) => {
                if (
                  typeof bundleItem === "object" &&
                  bundleItem !== null
                ) {
                  return (
                    bundleItem.menu_item_id ??
                    bundleItem.menuItemId ??
                    bundleItem.menu_item?.id ??
                    bundleItem.menuItem?.id ??
                    bundleItem.id
                  );
                }

                return bundleItem;
              }
            );

          // FOTO
          const photo = normalizePhoto(item);

          console.log(
            "BUNDLE FOTO:",
            {
              id: item.id,
              name: item.name,
              raw: photo.raw,
              url: photo.url,
            }
          );

          return {
            ...item,

            id: item.id,

            nama:
              item.name ??
              item.nama ??
              "",

            harga:
              item.bundle_price ??
              item.price ??
              item.harga ??
              0,

            normal_price:
              item.normal_price ??
              0,

            bundle_price:
              item.bundle_price ??
              item.price ??
              0,

            // FOTO
            gambarUrl:
              photo.url,

            originalPhoto:
              photo.raw,

            photo_url:
              item.photo_url ??
              null,

            photo:
              item.photo ??
              null,

            isTersedia:
              item.is_active !== undefined
                ? Boolean(item.is_active)
                : true,

            selectedMenuItems,
          };
        });

      setBundleItems(
        formattedBundles
      );
    } catch (error) {
      console.error(
        "Gagal mengambil bundle:",
        error
      );

      console.error(
        "Response:",
        error.response?.data
      );
    } finally {
      setBundleLoading(false);
    }
  };

  // =========================================================
  // FETCH ADDONS
  // =========================================================

  const fetchAddons = async () => {
    try {
      setAddonLoading(true);

      const response =
        await getAddons();

      const data = Array.isArray(response?.data)
        ? response.data
        : [];

      const formattedAddons =
        data.map((item) => {
          const photo =
            normalizePhoto(item);

          return {
            ...item,

            nama:
              item.name ??
              item.nama ??
              "",

            harga:
              item.price ??
              item.harga ??
              0,

            gambarUrl:
              photo.url,

            isTersedia:
              item.is_active !== undefined
                ? Boolean(item.is_active)
                : true,
          };
        });

      setAddonItems(
        formattedAddons
      );
    } catch (error) {
      console.error(
        "Gagal mengambil add-on:",
        error
      );
    } finally {
      setAddonLoading(false);
    }
  };

  // =========================================================
  // SAVE MENU
  // =========================================================

  const handleSaveMenu = async (data) => {
    try {
      /*
       * PENTING:
       *
       * Kalau user tidak memilih foto baru,
       * data.photo = null.
       *
       * Kita ambil foto lama dari editingMenuItem.
       */

      const oldPhoto =
        editingMenuItem
          ? getPhotoFromItem(
              editingMenuItem
            )
          : "";

      const newPhoto =
        data.photo instanceof File
          ? data.photo
          : null;

      /*
       * Kalau ada File baru:
       * photo = File
       * photo_url tidak perlu.
       *
       * Kalau tidak ada File:
       * photo = null
       * photo_url = foto lama.
       */

      const photoUrlToKeep =
        !newPhoto
          ? oldPhoto ||
            data.gambarUrl ||
            ""
          : "";

      const payload = {
        category_id:
          data.category_id
            ? Number(
                data.category_id
              )
            : null,

        name:
          data.nama ??
          "",

        label:
          data.isPromo &&
          data.labelPromo?.trim()
            ? data.labelPromo.trim()
            : null,

        price:
          Number(
            data.harga
          ),

        description:
          data.deskripsi ||
          null,

        photo:
          newPhoto,

        photo_url:
          photoUrlToKeep,

        is_active:
          Boolean(
            data.isTersedia
          ),

        addon_ids:
          Array.isArray(
            data.selectedAddons
          )
            ? data.selectedAddons
            : [],
      };

      console.log(
        "================================"
      );

      console.log(
        "SAVE MENU"
      );

      console.log(
        "EDITING:",
        editingMenuItem
      );

      console.log(
        "OLD PHOTO:",
        oldPhoto
      );

      console.log(
        "NEW PHOTO:",
        newPhoto
      );

      console.log(
        "PHOTO URL TO KEEP:",
        photoUrlToKeep
      );

      console.log(
        "PAYLOAD:",
        payload
      );

      console.log(
        "================================"
      );

      if (editingMenuItem) {
        await updateMenuItem(
          editingMenuItem.id,
          payload
        );
      } else {
        await createMenuItem(
          payload
        );
      }

      await fetchMenuItems();

      setIsMenuModalOpen(false);
      setEditingMenuItem(null);
    } catch (error) {
      console.error(
        "Gagal menyimpan menu:",
        error
      );

      console.error(
        "Response:",
        error.response?.data
      );

      alert(
        error.response?.data?.message ||
          "Gagal menyimpan menu."
      );
    }
  };

  // =========================================================
  // DELETE MENU
  // =========================================================

  const handleDeleteMenu = async (id) => {
    if (
      !window.confirm(
        "Yakin ingin menghapus menu ini?"
      )
    ) {
      return;
    }

    try {
      await deleteMenuItem(id);

      await fetchMenuItems();
    } catch (error) {
      console.error(
        "Gagal menghapus menu:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Gagal menghapus menu."
      );
    }
  };

  // =========================================================
  // SAVE BUNDLE
  // =========================================================

  const handleSaveBundle = async (data) => {
    try {
      const rawSelectedItems =
        Array.isArray(
          data?.selectedMenuItems
        )
          ? data.selectedMenuItems
          : Array.isArray(data?.items)
            ? data.items
            : Array.isArray(
                data?.menu_item_ids
              )
              ? data.menu_item_ids
              : [];

      // =====================================================
      // NORMALISASI ITEMS
      // =====================================================

      const items =
        rawSelectedItems
          .map((selectedItem) => {
            let menuId;
            let quantity = 1;

            if (
              typeof selectedItem ===
                "object" &&
              selectedItem !== null
            ) {
              menuId =
                selectedItem.menu_item_id ??
                selectedItem.menuItemId ??
                selectedItem.menu_item?.id ??
                selectedItem.menuItem?.id ??
                selectedItem.id;

              if (
                selectedItem.quantity !==
                  undefined &&
                selectedItem.quantity !==
                  null &&
                selectedItem.quantity !==
                  ""
              ) {
                quantity =
                  Number(
                    selectedItem.quantity
                  );
              }
            } else {
              menuId =
                selectedItem;
            }

            const normalizedId =
              Number(menuId);

            const normalizedQuantity =
              Number.isFinite(
                quantity
              ) &&
              quantity > 0
                ? quantity
                : 1;

            if (
              !Number.isFinite(
                normalizedId
              ) ||
              normalizedId <= 0
            ) {
              return null;
            }

            return {
              menu_item_id:
                normalizedId,

              quantity:
                normalizedQuantity,
            };
          })
          .filter(Boolean);

      // =====================================================
      // NORMAL PRICE
      // =====================================================

      const calculatedNormalPrice =
        items.reduce(
          (
            total,
            bundleItem
          ) => {
            const menu =
              menuItems.find(
                (item) =>
                  Number(
                    item.id
                  ) ===
                  Number(
                    bundleItem.menu_item_id
                  )
              );

            const menuPrice =
              Number(
                menu?.harga ??
                menu?.price ??
                0
              );

            return (
              total +
              menuPrice *
                Number(
                  bundleItem.quantity ||
                    1
                )
            );
          },
          0
        );

      const normalPrice =
        data?.normal_price !==
          undefined &&
        data?.normal_price !==
          null &&
        data?.normal_price !==
          ""
          ? Number(
              data.normal_price
            )
          : calculatedNormalPrice;

      const bundlePrice =
        data?.bundle_price !==
          undefined &&
        data?.bundle_price !==
          null &&
        data?.bundle_price !==
          ""
          ? Number(
              data.bundle_price
            )
          : Number(
              data?.harga ??
              data?.price ??
              0
            );

      // =====================================================
      // FOTO BUNDLE
      // =====================================================

      const oldPhoto =
        editingBundleItem
          ? getPhotoFromItem(
              editingBundleItem
            )
          : "";

      const newPhoto =
        data?.photo instanceof File
          ? data.photo
          : null;

      const photoUrlToKeep =
        !newPhoto
          ? oldPhoto ||
            data?.gambarUrl ||
            ""
          : "";

      // =====================================================
      // PAYLOAD
      // =====================================================

      const payload = {
        name:
          data?.name ??
          data?.nama ??
          "",

        normal_price:
          Number.isFinite(
            normalPrice
          )
            ? normalPrice
            : 0,

        bundle_price:
          Number.isFinite(
            bundlePrice
          )
            ? bundlePrice
            : 0,

        photo:
          newPhoto,

        photo_url:
          photoUrlToKeep,

        is_active:
          data?.is_active !==
          undefined
            ? Boolean(
                data.is_active
              )
            : data?.isTersedia !==
                undefined
              ? Boolean(
                  data.isTersedia
                )
              : true,

        items,
      };

      console.log(
        "================================"
      );

      console.log(
        "SAVE BUNDLE"
      );

      console.log(
        "EDITING:",
        editingBundleItem
      );

      console.log(
        "OLD PHOTO:",
        oldPhoto
      );

      console.log(
        "NEW PHOTO:",
        newPhoto
      );

      console.log(
        "PHOTO URL TO KEEP:",
        photoUrlToKeep
      );

      console.log(
        "PAYLOAD BUNDLE:",
        payload
      );

      console.log(
        "================================"
      );

      // =====================================================
      // VALIDASI
      // =====================================================

      if (
        !payload.name.trim()
      ) {
        alert(
          "Nama bundle wajib diisi."
        );

        return;
      }

      if (
        payload.items.length ===
        0
      ) {
        alert(
          "Pilih minimal 1 menu untuk bundle."
        );

        return;
      }

      if (
        payload.bundle_price < 0
      ) {
        alert(
          "Harga bundle tidak valid."
        );

        return;
      }

      // =====================================================
      // CREATE / UPDATE
      // =====================================================

      if (editingBundleItem) {
        await updateBundle(
          editingBundleItem.id,
          payload
        );
      } else {
        await createBundle(
          payload
        );
      }

      await fetchBundles();

      setIsBundleModalOpen(false);
      setEditingBundleItem(null);
    } catch (error) {
      console.error(
        "Gagal menyimpan bundle:",
        error
      );

      console.error(
        "Response:",
        error.response?.data
      );

      const validationErrors =
        error.response?.data?.errors;

      if (validationErrors) {
        const messages =
          Object.values(
            validationErrors
          )
            .flat()
            .join("\n");

        alert(messages);
      } else {
        alert(
          error.response?.data?.message ||
            "Gagal menyimpan bundle."
        );
      }
    }
  };

  // =========================================================
  // DELETE BUNDLE
  // =========================================================

  const handleDeleteBundle = async (id) => {
    if (
      !window.confirm(
        "Yakin ingin menghapus paket bundle ini?"
      )
    ) {
      return;
    }

    try {
      await deleteBundle(id);

      await fetchBundles();
    } catch (error) {
      console.error(
        "Gagal menghapus bundle:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Gagal menghapus bundle."
      );
    }
  };

  // =========================================================
  // SAVE ADDON
  // =========================================================

  const handleSaveAddon = async (data) => {
    try {
      const payload = {
        name:
          data.nama,

        price:
          Number(
            data.harga
          ),

        is_active:
          data.isTersedia !==
          undefined
            ? Boolean(
                data.isTersedia
              )
            : true,
      };

      if (data.id) {
        await updateAddon(
          data.id,
          payload
        );
      } else {
        await createAddon(
          payload
        );
      }

      await fetchAddons();
    } catch (error) {
      console.error(
        "Gagal menyimpan add-on:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Gagal menyimpan add-on."
      );
    }
  };

  // =========================================================
  // DELETE ADDON
  // =========================================================

  const handleDeleteAddon = async (id) => {
    if (
      !window.confirm(
        "Yakin ingin menghapus add-on ini?"
      )
    ) {
      return;
    }

    try {
      await deleteAddon(id);

      await fetchAddons();
    } catch (error) {
      console.error(
        "Gagal menghapus add-on:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Gagal menghapus add-on."
      );
    }
  };

  // =========================================================
  // SAVE CATEGORY
  // =========================================================

  const handleSaveKategori =
    async (data) => {
      try {
        const payload = {
          name:
            data.nama,
        };

        if (
          editingKategoriItem
        ) {
          await updateMenuCategory(
            editingKategoriItem.id,
            payload
          );
        } else {
          await createMenuCategory(
            payload
          );
        }

        await fetchMenuCategories();

        setIsKategoriModalOpen(
          false
        );

        setEditingKategoriItem(
          null
        );
      } catch (error) {
        console.error(
          "Gagal menyimpan kategori:",
          error
        );

        alert(
          error.response?.data?.message ||
            "Gagal menyimpan kategori."
        );
      }
    };

  // =========================================================
  // DELETE CATEGORY
  // =========================================================

  const handleDeleteKategori =
    async (id) => {
      if (
        !window.confirm(
          "Yakin ingin menghapus kategori ini?"
        )
      ) {
        return;
      }

      try {
        await deleteMenuCategory(
          id
        );

        await fetchMenuCategories();
      } catch (error) {
        console.error(
          "Gagal menghapus kategori:",
          error
        );

        alert(
          error.response?.data?.message ||
            "Gagal menghapus kategori."
        );
      }
    };

  // =========================================================
  // FILTER
  // =========================================================

  const filteredMenuItems =
    menuItems.filter((item) =>
      item.nama
        ?.toLowerCase()
        .includes(
          searchQuery.toLowerCase()
        )
    );

  const filteredBundleItems =
    bundleItems.filter((item) =>
      item.nama
        ?.toLowerCase()
        .includes(
          searchQuery.toLowerCase()
        )
    );

  const filteredAddonItems =
    addonItems.filter((item) =>
      item.nama
        ?.toLowerCase()
        .includes(
          searchQuery.toLowerCase()
        )
    );

  const filteredCategories =
    menuCategories.filter(
      (item) =>
        item.name
          ?.toLowerCase()
          .includes(
            searchQuery.toLowerCase()
          ) ||
        item.nama
          ?.toLowerCase()
          .includes(
            searchQuery.toLowerCase()
          )
    );

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="bg-[#FAF8F5] min-h-screen text-[#222222] font-sans relative">

      <Navbar />

      <main className="pt-6 pb-28 max-w-[1000px] mx-auto px-6">

        {/* HEADER */}

        <div className="pt-0 pb-2">

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">

            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-[#222222]">
                Kelola Menu
              </h1>

              <p className="text-xs text-gray-400 font-medium mt-1">
                {menuItems.length} item ·{" "}
                {bundleItems.length} bundle ·{" "}
                {menuCategories.length} kategori
              </p>
            </div>

            {/* SEARCH */}

            <div className="relative flex items-center w-full sm:w-64">

              <Search
                size={16}
                className="absolute left-3.5 text-gray-400"
              />

              <input
                type="text"
                placeholder="Cari menu, paket, add-on..."
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(
                    e.target.value
                  )
                }
                className="w-full pl-9 pr-4 py-2 bg-[#FAF6EE] border border-gray-200/80 rounded-full text-xs outline-none placeholder-gray-400 focus:border-black transition-colors"
              />

            </div>

          </div>

          {/* TABS */}

          <div className="flex items-center justify-between mt-4 overflow-x-auto pb-2">

            <div className="flex items-center space-x-2 bg-gray-200/60 p-1 rounded-full whitespace-nowrap">

              <button
                onClick={() =>
                  setActiveTab("menu")
                }
                className={`flex items-center space-x-1 px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                  activeTab === "menu"
                    ? "bg-[#2B2B2B] text-white"
                    : "text-gray-600"
                }`}
              >
                <Utensils size={14} />
                <span>Menu</span>
              </button>

              <button
                onClick={() =>
                  setActiveTab("bundle")
                }
                className={`flex items-center space-x-1 px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                  activeTab === "bundle"
                    ? "bg-[#2B2B2B] text-white"
                    : "text-gray-600"
                }`}
              >
                <Package size={14} />
                <span>Bundle</span>
              </button>

              <button
                onClick={() =>
                  setActiveTab("addon")
                }
                className={`flex items-center space-x-1 px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                  activeTab === "addon"
                    ? "bg-[#2B2B2B] text-white"
                    : "text-gray-600"
                }`}
              >
                <PlusCircle size={14} />
                <span>Add-on</span>
              </button>

              <button
                onClick={() =>
                  setActiveTab("kategori")
                }
                className={`flex items-center space-x-1 px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                  activeTab === "kategori"
                    ? "bg-[#2B2B2B] text-white"
                    : "text-gray-600"
                }`}
              >
                <Tags size={14} />
                <span>Kategori</span>
              </button>

            </div>

            {/* ACTION */}

            {activeTab === "menu" && (
              <button
                onClick={() => {
                  setEditingMenuItem(null);
                  setIsMenuModalOpen(true);
                }}
                className="bg-[#2B2B2B] text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center space-x-1 hover:bg-black transition-colors"
              >
                <Plus size={16} />
                <span>Tambah</span>
              </button>
            )}

            {activeTab === "bundle" && (
              <button
                onClick={() => {
                  setEditingBundleItem(null);
                  setIsBundleModalOpen(true);
                }}
                className="bg-[#2B2B2B] text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center space-x-1 hover:bg-black transition-colors"
              >
                <Plus size={16} />
                <span>Tambah Paket</span>
              </button>
            )}

            {activeTab === "kategori" && (
              <button
                onClick={() => {
                  setEditingKategoriItem(null);
                  setIsKategoriModalOpen(true);
                }}
                className="bg-[#2B2B2B] text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center space-x-1 hover:bg-black transition-colors"
              >
                <Plus size={16} />
                <span>Tambah Kategori</span>
              </button>
            )}

          </div>
        </div>

        {/* CONTENT */}

        <div className="pt-2">

          {/* MENU */}

          {activeTab === "menu" && (
            <>
              {menuLoading ? (
                <div className="flex justify-center py-20">
                  <p className="text-sm text-gray-400">
                    Memuat menu...
                  </p>
                </div>
              ) : (
                <TabMenu
                  items={filteredMenuItems}
                  onEdit={(item) => {
                    setEditingMenuItem(item);
                    setIsMenuModalOpen(true);
                  }}
                  onDelete={handleDeleteMenu}
                />
              )}
            </>
          )}

          {/* BUNDLE */}

          {activeTab === "bundle" && (
            <>
              {bundleLoading ? (
                <div className="flex justify-center py-20">
                  <p className="text-sm text-gray-400">
                    Memuat bundle...
                  </p>
                </div>
              ) : (
                <TabBundle
                  items={filteredBundleItems}
                  menuItems={menuItems}
                  onEdit={(item) => {
                    setEditingBundleItem(item);
                    setIsBundleModalOpen(true);
                  }}
                  onDelete={handleDeleteBundle}
                />
              )}
            </>
          )}

          {/* ADDON */}

          {activeTab === "addon" && (
            <>
              {addonLoading ? (
                <div className="flex justify-center py-20">
                  <p className="text-sm text-gray-400">
                    Memuat add-on...
                  </p>
                </div>
              ) : (
                <TabAddon
                  items={filteredAddonItems}
                  onAdd={handleSaveAddon}
                  onDelete={handleDeleteAddon}
                />
              )}
            </>
          )}

          {/* CATEGORY */}

          {activeTab === "kategori" && (
            <>
              {categoryLoading ? (
                <div className="flex justify-center py-20">
                  <p className="text-sm text-gray-400">
                    Memuat kategori...
                  </p>
                </div>
              ) : (
                <TabKategori
                  items={filteredCategories}
                  onEdit={(item) => {
                    setEditingKategoriItem(item);
                    setIsKategoriModalOpen(true);
                  }}
                  onDelete={handleDeleteKategori}
                />
              )}
            </>
          )}

        </div>
      </main>

      {/* =====================================================
          MODAL MENU
      ===================================================== */}

      <ModalMenu
        isOpen={isMenuModalOpen}
        onClose={() => {
          setIsMenuModalOpen(false);
          setEditingMenuItem(null);
        }}
        onSave={handleSaveMenu}
        editingItem={editingMenuItem}
        categories={menuCategories}
        addonItems={addonItems}
      />

      {/* =====================================================
          MODAL BUNDLE
      ===================================================== */}

      <ModalBundle
        isOpen={isBundleModalOpen}
        onClose={() => {
          setIsBundleModalOpen(false);
          setEditingBundleItem(null);
        }}
        onSave={handleSaveBundle}
        editingItem={editingBundleItem}
        menuList={menuItems}
      />

      {/* =====================================================
          MODAL CATEGORY
      ===================================================== */}

      <ModalKategori
        isOpen={isKategoriModalOpen}
        onClose={() => {
          setIsKategoriModalOpen(false);
          setEditingKategoriItem(null);
        }}
        onSave={handleSaveKategori}
        editingItem={editingKategoriItem}
      />

      <BottomNavigation />

    </div>
  );
}