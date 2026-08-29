
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
  // MENU
  getMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,

  // CATEGORY
  getMenuCategories,
  createMenuCategory,
  updateMenuCategory,
  deleteMenuCategory,

  // BUNDLE
  getBundles,
  createBundle,
  updateBundle,
  deleteBundle,

  // ADDON
  getAddons,
  createAddon,
  updateAddon,
  deleteAddon,
} from "../api/admin";

export default function KelolaMenu() {
  const [activeTab, setActiveTab] = useState("menu");
  const [searchQuery, setSearchQuery] = useState("");

  // =========================================================
  // DATA STATES
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
  // MODAL STATES
  // =========================================================

  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState(null);

  const [isBundleModalOpen, setIsBundleModalOpen] = useState(false);
  const [editingBundleItem, setEditingBundleItem] = useState(null);

  const [isKategoriModalOpen, setIsKategoriModalOpen] = useState(false);
  const [editingKategoriItem, setEditingKategoriItem] = useState(null);

  // =========================================================
  // FETCH ALL DATA
  // =========================================================

  useEffect(() => {
    fetchMenuItems();
    fetchMenuCategories();
    fetchBundles();
    fetchAddons();
  }, []);

  // =========================================================
  // FETCH MENU ITEMS
  // =========================================================

  const fetchMenuItems = async () => {
    try {
      setMenuLoading(true);

      const response = await getMenuItems();

      console.log("MENU ITEMS API:", response);

      const data = response?.data || [];

      console.log("RAW MENU DATA:", data);

      const formattedItems = data.map((item) => {
        console.log("PHOTO URL:", item.photo_url);

        return {
          ...item,

          // Frontend field
          nama: item.name,
          harga: item.price,

          deskripsi: item.description || "",

          gambarUrl: item.photo_url || "",

          labelPromo: item.label || "Favorit!",

          isPromo: Boolean(item.label),

          isTersedia: Boolean(item.is_active),

          kategori:
            item.category?.name ||
            item.category?.nama ||
            "",
        };
      });

      console.log("FORMATTED MENU:", formattedItems);

      setMenuItems(formattedItems);
    } catch (error) {
      console.error("Gagal mengambil menu:", error);

      console.error(
        "Response error:",
        error.response?.data
      );
    } finally {
      setMenuLoading(false);
    }
  };

  // =========================================================
  // FETCH CATEGORIES
  // =========================================================

  const fetchMenuCategories = async () => {
    try {
      setCategoryLoading(true);

      const response = await getMenuCategories();

      console.log("MENU CATEGORIES API:", response);

      const data = response?.data || [];

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
  // FETCH BUNDLES
  // =========================================================

  const fetchBundles = async () => {
    try {
      setBundleLoading(true);

      const response = await getBundles();

      console.log("BUNDLES API:", response);

      const data = response?.data || [];

      console.log("RAW BUNDLE DATA:", data);

      /*
       * Backend bundle bisa menggunakan field:
       * name / nama
       * price / harga
       * photo_url / gambarUrl
       * items / menu_items / selectedMenuItems
       *
       * Kita normalisasi ke format yang dipakai
       * oleh TabBundle dan ModalBundle.
       */

      const formattedBundles = data.map((item) => {
        const selectedMenus =
          item.selectedMenuItems ||
          item.menu_items ||
          item.menuItems ||
          item.items ||
          [];

        return {
          ...item,

          nama:
            item.name ||
            item.nama ||
            "",

          harga:
            item.price ??
            item.harga ??
            0,

          gambarUrl:
            item.photo_url ||
            item.gambarUrl ||
            item.photo ||
            "",

          selectedMenuItems: selectedMenus,
        };
      });

      console.log(
        "FORMATTED BUNDLES:",
        formattedBundles
      );

      setBundleItems(formattedBundles);
    } catch (error) {
      console.error(
        "Gagal mengambil bundle:",
        error
      );

      console.error(
        "Response error:",
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

      const response = await getAddons();

      console.log("ADDONS API:", response);

      const data = response?.data || [];

      console.log("RAW ADDON DATA:", data);

      const formattedAddons = data.map((item) => {
        return {
          ...item,

          nama:
            item.name ||
            item.nama ||
            "",

          harga:
            item.price ??
            item.harga ??
            0,

          gambarUrl:
            item.photo_url ||
            item.gambarUrl ||
            item.photo ||
            "",

          isTersedia:
            item.is_active !== undefined
              ? Boolean(item.is_active)
              : true,
        };
      });

      console.log(
        "FORMATTED ADDONS:",
        formattedAddons
      );

      setAddonItems(formattedAddons);
    } catch (error) {
      console.error(
        "Gagal mengambil add-on:",
        error
      );

      console.error(
        "Response error:",
        error.response?.data
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
      const payload = {
        category_id: data.category_id
          ? Number(data.category_id)
          : null,

        name: data.nama,

        label: data.isPromo
          ? data.labelPromo
          : null,

        price: Number(data.harga),

        description:
          data.deskripsi || null,

        photo: data.photo || null,

        photo_url:
          data.gambarUrl || null,

        is_active:
          Boolean(data.isTersedia),
      };

      console.log(
        "PAYLOAD MENU:",
        payload
      );

      if (editingMenuItem) {
        await updateMenuItem(
          editingMenuItem.id,
          payload
        );
      } else {
        await createMenuItem(payload);
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
        "Response error:",
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
      /*
       * Sesuaikan data dari ModalBundle
       * ke payload backend.
       *
       * Jika ModalBundle menghasilkan:
       * nama
       * harga
       * gambarUrl
       * selectedMenuItems
       */

      const selectedMenuItems =
        data.selectedMenuItems || [];

      const payload = {
        name: data.nama,

        price: Number(data.harga),

        photo_url:
          data.gambarUrl || null,

        /*
         * Backend biasanya membutuhkan
         * daftar menu yang masuk bundle.
         */
        menu_item_ids:
          selectedMenuItems.map((item) =>
            typeof item === "object"
              ? item.id
              : item
          ),
      };

      console.log(
        "PAYLOAD BUNDLE:",
        payload
      );

      if (editingBundleItem) {
        await updateBundle(
          editingBundleItem.id,
          payload
        );
      } else {
        await createBundle(payload);
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
        "Response error:",
        error.response?.data
      );

      alert(
        error.response?.data?.message ||
          "Gagal menyimpan bundle."
      );
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

      console.error(
        "Response error:",
        error.response?.data
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
        name: data.nama,

        price: Number(data.harga),

        is_active:
          data.isTersedia !== undefined
            ? Boolean(data.isTersedia)
            : true,
      };

      console.log(
        "PAYLOAD ADDON:",
        payload
      );

      if (data.id) {
        await updateAddon(
          data.id,
          payload
        );
      } else {
        await createAddon(payload);
      }

      await fetchAddons();
    } catch (error) {
      console.error(
        "Gagal menyimpan add-on:",
        error
      );

      console.error(
        "Response error:",
        error.response?.data
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

      console.error(
        "Response error:",
        error.response?.data
      );

      alert(
        error.response?.data?.message ||
          "Gagal menghapus add-on."
      );
    }
  };

  // =========================================================
  // SAVE KATEGORI
  // =========================================================

  const handleSaveKategori = async (
    data
  ) => {
    try {
      const payload = {
        name: data.nama,
      };

      console.log(
        "PAYLOAD KATEGORI:",
        payload
      );

      if (editingKategoriItem) {
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

      setIsKategoriModalOpen(false);
      setEditingKategoriItem(null);
    } catch (error) {
      console.error(
        "Gagal menyimpan kategori:",
        error
      );

      console.error(
        "Response error:",
        error.response?.data
      );

      alert(
        error.response?.data?.message ||
          "Gagal menyimpan kategori."
      );
    }
  };

  // =========================================================
  // DELETE KATEGORI
  // =========================================================

  const handleDeleteKategori = async (
    id
  ) => {
    if (
      !window.confirm(
        "Yakin ingin menghapus kategori ini?"
      )
    ) {
      return;
    }

    try {
      await deleteMenuCategory(id);

      await fetchMenuCategories();
    } catch (error) {
      console.error(
        "Gagal menghapus kategori:",
        error
      );

      console.error(
        "Response error:",
        error.response?.data
      );

      alert(
        error.response?.data?.message ||
          "Gagal menghapus kategori."
      );
    }
  };

  // =========================================================
  // SEARCH FILTER
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

        {/* ===================================================
            HEADER
        =================================================== */}

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

          {/* =================================================
              TABS
          ================================================= */}

          <div className="flex items-center justify-between mt-4 overflow-x-auto pb-2">

            <div className="flex items-center space-x-2 bg-gray-200/60 p-1 rounded-full whitespace-nowrap">

              {/* MENU */}

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

              {/* BUNDLE */}

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

              {/* ADDON */}

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

              {/* KATEGORI */}

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

            {/* =================================================
                ACTION BUTTONS
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

        {/* ===================================================
            CONTENT
        =================================================== */}

        <div className="pt-2">

          {/* =================================================
              MENU
          ================================================= */}

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
                  onDelete={
                    handleDeleteMenu
                  }
                />
              )}
            </>
          )}

          {/* =================================================
              BUNDLE
          ================================================= */}

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
                  onDelete={
                    handleDeleteBundle
                  }
                />
              )}
            </>
          )}

          {/* =================================================
              ADDON
          ================================================= */}

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

          {/* =================================================
              KATEGORI
          ================================================= */}

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
                  onDelete={
                    handleDeleteKategori
                  }
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
          MODAL KATEGORI
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

