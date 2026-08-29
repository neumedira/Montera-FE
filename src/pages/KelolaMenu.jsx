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
  // Pastikan fungsi API di bawah ini sudah Anda buat di file api/admin
createMenuCategory, // <-- Hapus tanda // di sini
  updateMenuCategory, // <-- Hapus tanda // di sini (opsional untuk edit nanti)
  deleteMenuCategory  // <-- Hapus tanda // di sini (opsional untuk hapus nanti)
} from "../api/admin";

export default function KelolaMenu() {
  const [activeTab, setActiveTab] = useState("menu");
  const [searchQuery, setSearchQuery] = useState("");

  const [menuItems, setMenuItems] = useState([]);
  const [menuCategories, setMenuCategories] = useState([]);
  const [menuLoading, setMenuLoading] = useState(false);

  const [bundleItems, setBundleItems] = useState(() => {
    const saved = localStorage.getItem("bundleItems");
    return saved ? JSON.parse(saved) : [];
  });

  const [addonItems, setAddonItems] = useState(() => {
    const saved = localStorage.getItem("addonItems");
    return saved ? JSON.parse(saved) : [];
  });

  // Modal States
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState(null);

  const [isBundleModalOpen, setIsBundleModalOpen] = useState(false);
  const [editingBundleItem, setEditingBundleItem] = useState(null);

  const [isKategoriModalOpen, setIsKategoriModalOpen] = useState(false);
  const [editingKategoriItem, setEditingKategoriItem] = useState(null);

  useEffect(() => {
    fetchMenuItems();
    fetchMenuCategories();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setMenuLoading(true);
      const response = await getMenuItems();
      const data = response?.data || [];
      const formattedItems = data.map((item) => ({
        ...item,
        nama: item.name,
        harga: item.price,
        deskripsi: item.description || "",
        gambarUrl: item.photo_url || "",
        labelPromo: item.label || "Favorit!",
        isPromo: Boolean(item.label),
        isTersedia: Boolean(item.is_active),
        kategori: item.category?.name || item.category?.nama || "",
      }));
      setMenuItems(formattedItems);
    } catch (error) {
      console.error("Gagal mengambil menu:", error);
    } finally {
      setMenuLoading(false);
    }
  };

  const fetchMenuCategories = async () => {
    try {
      const response = await getMenuCategories();
      setMenuCategories(response?.data || []);
    } catch (error) {
      console.error("Gagal mengambil kategori:", error);
    }
  };

  useEffect(() => {
    localStorage.setItem("bundleItems", JSON.stringify(bundleItems));
  }, [bundleItems]);

  useEffect(() => {
    localStorage.setItem("addonItems", JSON.stringify(addonItems));
  }, [addonItems]);

  // =========================================================
  // HANDLERS
  // =========================================================

  const handleSaveMenu = async (data) => {
    try {
      const payload = {
        category_id: data.category_id ? Number(data.category_id) : null,
        name: data.nama,
        label: data.isPromo ? data.labelPromo : null,
        price: Number(data.harga),
        description: data.deskripsi || null,
        photo_url: data.gambarUrl || null,
        is_active: Boolean(data.isTersedia),
      };

      if (editingMenuItem) {
        await updateMenuItem(editingMenuItem.id, payload);
      } else {
        await createMenuItem(payload);
      }
      await fetchMenuItems();
      setIsMenuModalOpen(false);
      setEditingMenuItem(null);
    } catch (error) {
      console.error("Gagal menyimpan menu:", error);
      alert(error.response?.data?.message || "Gagal menyimpan menu.");
    }
  };

  const handleDeleteMenu = async (id) => {
    if (!window.confirm("Yakin ingin menghapus menu ini?")) return;
    try {
      await deleteMenuItem(id);
      await fetchMenuItems();
    } catch (error) {
      console.error("Gagal menghapus menu:", error);
      alert(error.response?.data?.message || "Gagal menghapus menu.");
    }
  };

  const handleSaveBundle = (data) => {
    if (editingBundleItem) {
      setBundleItems(
        bundleItems.map((item) =>
          item.id === editingBundleItem.id ? { ...data, id: item.id } : item
        )
      );
    } else {
      setBundleItems([...bundleItems, { ...data, id: Date.now() }]);
    }
    setIsBundleModalOpen(false);
    setEditingBundleItem(null);
  };

  // --- KATEGORI HANDLERS (Sementara pakai Local State/Placeholder API) ---
const handleSaveKategori = async (data) => {
    try {
      const payload = { name: data.nama };
      
      if (editingKategoriItem) {
        // Hapus tanda // di bawah ini jika endpoint update sudah ada
        await updateMenuCategory(editingKategoriItem.id, payload);
        console.log("KATEGORI UPDATED:", payload);
      } else {
        // Hapus tanda // di bawah ini untuk mengaktifkan fungsi create
        await createMenuCategory(payload);
        console.log("KATEGORI CREATED:", payload);
      }
      
      await fetchMenuCategories(); 
      setIsKategoriModalOpen(false);
      setEditingKategoriItem(null);
    } catch (error) {
      console.error("Gagal menyimpan kategori:", error);
    }
  };

  const handleDeleteKategori = async (id) => {
    if (!window.confirm("Yakin ingin menghapus kategori ini?")) return;
    try {
      // await deleteMenuCategory(id);
      console.log("Delete Kategori ID:", id);
      await fetchMenuCategories();
    } catch (error) {
      console.error("Gagal menghapus kategori:", error);
    }
  };

  // =========================================================
  // SEARCH FILTER
  // =========================================================

  const filteredMenuItems = menuItems.filter((item) =>
    item.nama?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredBundleItems = bundleItems.filter((item) =>
    item.nama?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredAddonItems = addonItems.filter((item) =>
    item.nama?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredCategories = menuCategories.filter((item) =>
    item.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.nama?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-[#FAF8F5] min-h-screen text-[#222222] font-sans relative">
      <Navbar />

      <main className="pt-6 pb-28 max-w-[1000px] mx-auto px-6">
        <div className="pt-0 pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-[#222222]">
                Kelola Menu
              </h1>
              <p className="text-xs text-gray-400 font-medium mt-1">
                {menuItems.length} item · {bundleItems.length} bundle · {menuCategories.length} kategori
              </p>
            </div>

            <div className="relative flex items-center w-full sm:w-64">
              <Search size={16} className="absolute left-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari menu, paket, add-on..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[#FAF6EE] border border-gray-200/80 rounded-full text-xs outline-none placeholder-gray-400 focus:border-black transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 overflow-x-auto pb-2">
            <div className="flex items-center space-x-2 bg-gray-200/60 p-1 rounded-full whitespace-nowrap">
              <button
                onClick={() => setActiveTab("menu")}
                className={`flex items-center space-x-1 px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                  activeTab === "menu" ? "bg-[#2B2B2B] text-white" : "text-gray-600"
                }`}
              >
                <Utensils size={14} />
                <span>Menu</span>
              </button>

              <button
                onClick={() => setActiveTab("bundle")}
                className={`flex items-center space-x-1 px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                  activeTab === "bundle" ? "bg-[#2B2B2B] text-white" : "text-gray-600"
                }`}
              >
                <Package size={14} />
                <span>Bundle</span>
              </button>

              <button
                onClick={() => setActiveTab("addon")}
                className={`flex items-center space-x-1 px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                  activeTab === "addon" ? "bg-[#2B2B2B] text-white" : "text-gray-600"
                }`}
              >
                <PlusCircle size={14} />
                <span>Add-on</span>
              </button>

              <button
                onClick={() => setActiveTab("kategori")}
                className={`flex items-center space-x-1 px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                  activeTab === "kategori" ? "bg-[#2B2B2B] text-white" : "text-gray-600"
                }`}
              >
                <Tags size={14} />
                <span>Kategori</span>
              </button>
            </div>

            {/* ACTION BUTTONS */}
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

        <div className="pt-2">
          {activeTab === "menu" && (
            <>
              {menuLoading ? (
                <div className="flex justify-center py-20">
                  <p className="text-sm text-gray-400">Memuat menu...</p>
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

          {activeTab === "bundle" && (
            <TabBundle
              items={filteredBundleItems}
              menuItems={menuItems}
              onEdit={(item) => {
                setEditingBundleItem(item);
                setIsBundleModalOpen(true);
              }}
              onDelete={(id) => setBundleItems(bundleItems.filter((i) => i.id !== id))}
            />
          )}

          {activeTab === "addon" && (
            <TabAddon
              items={filteredAddonItems}
              onAdd={(data) => setAddonItems([...addonItems, { ...data, id: Date.now() }])}
              onDelete={(id) => setAddonItems(addonItems.filter((i) => i.id !== id))}
            />
          )}

          {activeTab === "kategori" && (
            <TabKategori
              items={filteredCategories}
              onEdit={(item) => {
                setEditingKategoriItem(item);
                setIsKategoriModalOpen(true);
              }}
              onDelete={handleDeleteKategori}
            />
          )}
        </div>
      </main>

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