import React, { useState, useEffect } from "react";
import {
  Plus,
  Utensils,
  Package,
  PlusCircle,
  Search,
} from "lucide-react";

import TabMenu from "../components/kelola-menu/TabMenu";
import TabBundle from "../components/kelola-menu/TabBundle";
import TabAddon from "../components/kelola-menu/TabAddon";
import ModalMenu from "../components/kelola-menu/ModalMenu";
import ModalBundle from "../components/kelola-menu/ModalBundle";

import Navbar from "../components/layout/Navbar";
import BottomNavigation from "../components/layout/BottomNavigation";

import {
  getMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getMenuCategories,
} from "../api/admin";

export default function KelolaMenu() {
  const [activeTab, setActiveTab] = useState("menu");
  const [searchQuery, setSearchQuery] = useState("");

  // =========================================================
  // MENU DATA DARI API
  // =========================================================

  const [menuItems, setMenuItems] = useState([]);
  const [menuCategories, setMenuCategories] = useState([]);

  const [menuLoading, setMenuLoading] = useState(false);

  // =========================================================
  // BUNDLE & ADDON
  // SEMENTARA MASIH LOCAL STORAGE
  // =========================================================

  const [bundleItems, setBundleItems] = useState(() => {
    const saved = localStorage.getItem("bundleItems");
    return saved ? JSON.parse(saved) : [];
  });

  const [addonItems, setAddonItems] = useState(() => {
    const saved = localStorage.getItem("addonItems");
    return saved ? JSON.parse(saved) : [];
  });

  // =========================================================
  // MODAL
  // =========================================================

  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState(null);

  const [isBundleModalOpen, setIsBundleModalOpen] = useState(false);
  const [editingBundleItem, setEditingBundleItem] = useState(null);

  // =========================================================
  // LOAD MENU & CATEGORY
  // =========================================================

  useEffect(() => {
    fetchMenuItems();
    fetchMenuCategories();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setMenuLoading(true);

      const response = await getMenuItems();

      console.log("MENU ITEMS API:", response);

      const data = response?.data || [];

      /*
       * Backend:
       * name
       * price
       * description
       * photo_url
       * label
       * is_active
       * category
       *
       * UI:
       * nama
       * harga
       * deskripsi
       * gambarUrl
       * labelPromo
       * isPromo
       * isTersedia
       * kategori
       */

      const formattedItems = data.map((item) => ({
        ...item,

        nama: item.name,
        harga: item.price,
        deskripsi: item.description || "",
        gambarUrl: item.photo_url || "",
        labelPromo: item.label || "Favorit!",
        isPromo: Boolean(item.label),
        isTersedia: Boolean(item.is_active),

        // Ambil nama kategori dari relationship Laravel
        kategori:
          item.category?.name ||
          item.category?.nama ||
          "",
      }));

      setMenuItems(formattedItems);
    } catch (error) {
      console.error("Gagal mengambil menu:", error);

      if (error.response) {
        console.error("Response:", error.response.data);
      }
    } finally {
      setMenuLoading(false);
    }
  };

  const fetchMenuCategories = async () => {
    try {
      const response = await getMenuCategories();

      console.log("MENU CATEGORIES API:", response);

      setMenuCategories(response?.data || []);
    } catch (error) {
      console.error("Gagal mengambil kategori:", error);

      if (error.response) {
        console.error("Response:", error.response.data);
      }
    }
  };

  // =========================================================
  // LOCAL STORAGE
  // BUNDLE & ADDON SAJA
  // =========================================================

  useEffect(() => {
    localStorage.setItem("bundleItems", JSON.stringify(bundleItems));
  }, [bundleItems]);

  useEffect(() => {
    localStorage.setItem("addonItems", JSON.stringify(addonItems));
  }, [addonItems]);

  // =========================================================
  // MENU
  // =========================================================

  const handleSaveMenu = async (data) => {
    try {
      /*
       * Data dari ModalMenu masih menggunakan
       * nama field versi frontend.
       *
       * Kita ubah menjadi format yang diminta Laravel.
       */

      const payload = {
        category_id: data.category_id
          ? Number(data.category_id)
          : null,

        name: data.nama,
        label: data.isPromo
          ? data.labelPromo
          : null,

        price: Number(data.harga),

        description: data.deskripsi || null,

        photo_url: data.gambarUrl || null,

        is_active: Boolean(data.isTersedia),
      };

      console.log("PAYLOAD MENU:", payload);

      let response;

      // =====================================================
      // EDIT
      // =====================================================

      if (editingMenuItem) {
        response = await updateMenuItem(
          editingMenuItem.id,
          payload
        );

        console.log("MENU UPDATED:", response);
      }

      // =====================================================
      // TAMBAH
      // =====================================================

      else {
        response = await createMenuItem(payload);

        console.log("MENU CREATED:", response);
      }

      // Setelah berhasil, ambil ulang data dari database
      await fetchMenuItems();

      setIsMenuModalOpen(false);
      setEditingMenuItem(null);
    } catch (error) {
      console.error("Gagal menyimpan menu:", error);

      if (error.response) {
        console.error(
          "API ERROR:",
          error.response.data
        );

        alert(
          error.response.data?.message ||
            "Gagal menyimpan menu."
        );
      } else {
        alert("Tidak dapat terhubung ke server.");
      }
    }
  };

  // =========================================================
  // DELETE MENU
  // =========================================================

  const handleDeleteMenu = async (id) => {
    const confirmed = window.confirm(
      "Yakin ingin menghapus menu ini?"
    );

    if (!confirmed) return;

    try {
      await deleteMenuItem(id);

      console.log("Menu berhasil dihapus");

      // Ambil ulang dari database
      await fetchMenuItems();
    } catch (error) {
      console.error("Gagal menghapus menu:", error);

      if (error.response) {
        console.error(
          "API ERROR:",
          error.response.data
        );

        alert(
          error.response.data?.message ||
            "Gagal menghapus menu."
        );
      } else {
        alert("Tidak dapat terhubung ke server.");
      }
    }
  };

  // =========================================================
  // BUNDLE
  // =========================================================

  const handleSaveBundle = (data) => {
    if (editingBundleItem) {
      setBundleItems(
        bundleItems.map((item) =>
          item.id === editingBundleItem.id
            ? {
                ...data,
                id: item.id,
              }
            : item
        )
      );
    } else {
      setBundleItems([
        ...bundleItems,
        {
          ...data,
          id: Date.now(),
        },
      ]);
    }

    setIsBundleModalOpen(false);
    setEditingBundleItem(null);
  };

  // =========================================================
  // SEARCH
  // =========================================================

  const filteredMenuItems = menuItems.filter((item) =>
    item.nama
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const filteredBundleItems = bundleItems.filter((item) =>
    item.nama
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const filteredAddonItems = addonItems.filter((item) =>
    item.nama
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="bg-[#FAF8F5] min-h-screen text-[#222222] font-sans relative">
      <Navbar />

      <main className="pt-6 pb-28 max-w-[1000px] mx-auto px-6">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="pt-0 pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">

            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-[#222222]">
                Kelola Menu
              </h1>

              <p className="text-xs text-gray-400 font-medium mt-1">
                {menuItems.length} item ·{" "}
                {bundleItems.length} bundle
              </p>
            </div>

            {/* Search */}

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
                  setSearchQuery(e.target.value)
                }
                className="w-full pl-9 pr-4 py-2 bg-[#FAF6EE] border border-gray-200/80 rounded-full text-xs outline-none placeholder-gray-400 focus:border-black transition-colors"
              />
            </div>
          </div>

          {/* =====================================================
              TABS
          ===================================================== */}

          <div className="flex items-center justify-between mt-4">

            <div className="flex items-center space-x-2 bg-gray-200/60 p-1 rounded-full">

              {/* MENU */}

              <button
                onClick={() => setActiveTab("menu")}
                className={`flex items-center space-x-1 px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                  activeTab === "menu"
                    ? "bg-[#2B2B2B] text-white"
                    : "text-gray-600"
                }`}
              >
                <Utensils size={14} />
                <span>Menu</span>
              </button>

              {/* BUNDLE */}

              <button
                onClick={() => setActiveTab("bundle")}
                className={`flex items-center space-x-1 px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                  activeTab === "bundle"
                    ? "bg-[#2B2B2B] text-white"
                    : "text-gray-600"
                }`}
              >
                <Package size={14} />
                <span>Bundle</span>
              </button>

              {/* ADDON */}

              <button
                onClick={() => setActiveTab("addon")}
                className={`flex items-center space-x-1 px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                  activeTab === "addon"
                    ? "bg-[#2B2B2B] text-white"
                    : "text-gray-600"
                }`}
              >
                <PlusCircle size={14} />
                <span>Add-on</span>
              </button>
            </div>

            {/* =================================================
                ACTION BUTTON
            ================================================= */}

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
          </div>
        </div>

        {/* =====================================================
            CONTENT
        ===================================================== */}

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
            <TabBundle
              items={filteredBundleItems}
              menuItems={menuItems}
              onEdit={(item) => {
                setEditingBundleItem(item);
                setIsBundleModalOpen(true);
              }}
              onDelete={(id) =>
                setBundleItems(
                  bundleItems.filter(
                    (i) => i.id !== id
                  )
                )
              }
            />
          )}

          {/* ADDON */}

          {activeTab === "addon" && (
            <TabAddon
              items={filteredAddonItems}
              onAdd={(data) =>
                setAddonItems([
                  ...addonItems,
                  {
                    ...data,
                    id: Date.now(),
                  },
                ])
              }
              onDelete={(id) =>
                setAddonItems(
                  addonItems.filter(
                    (i) => i.id !== id
                  )
                )
              }
            />
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

      <BottomNavigation />
    </div>
  );
}