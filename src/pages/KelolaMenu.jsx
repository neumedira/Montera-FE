import React, { useState, useEffect } from 'react';
import { Plus, Utensils, Package, PlusCircle, Search } from 'lucide-react';
import TabMenu from '../components/kelola-menu/TabMenu';
import TabBundle from '../components/kelola-menu/TabBundle';
import TabAddon from '../components/kelola-menu/TabAddon';
import ModalMenu from '../components/kelola-menu/ModalMenu';
import ModalBundle from '../components/kelola-menu/ModalBundle';

import Navbar from '../components/layout/Navbar';
import BottomNavigation from '../components/layout/BottomNavigation';

export default function KelolaMenu() {
  const [activeTab, setActiveTab] = useState('menu');
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Inisialisasi state dari localStorage
  const [menuItems, setMenuItems] = useState(() => {
    const saved = localStorage.getItem('menuItems');
    return saved ? JSON.parse(saved) : [];
  });

  const [bundleItems, setBundleItems] = useState(() => {
    const saved = localStorage.getItem('bundleItems');
    return saved ? JSON.parse(saved) : [];
  });

  const [addonItems, setAddonItems] = useState(() => {
    const saved = localStorage.getItem('addonItems');
    return saved ? JSON.parse(saved) : [];
  });

  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState(null);
  const [isBundleModalOpen, setIsBundleModalOpen] = useState(false);
  const [editingBundleItem, setEditingBundleItem] = useState(null);

  // 2. Simpan otomatis ke localStorage
  useEffect(() => {
    localStorage.setItem('menuItems', JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem('bundleItems', JSON.stringify(bundleItems));
  }, [bundleItems]);

  useEffect(() => {
    localStorage.setItem('addonItems', JSON.stringify(addonItems));
  }, [addonItems]);

  // Handlers Menu
  const handleSaveMenu = (data) => {
    if (editingMenuItem) {
      setMenuItems(
        menuItems.map((item) =>
          item.id === editingMenuItem.id ? { ...data, id: item.id } : item
        )
      );
    } else {
      setMenuItems([...menuItems, { ...data, id: Date.now() }]);
    }
    setIsMenuModalOpen(false);
  };

  // Handlers Bundle
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
  };

  // Filter Data berdasarkan Search Query secara Real-time
  const filteredMenuItems = menuItems.filter((item) =>
    item.nama?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredBundleItems = bundleItems.filter((item) =>
    item.nama?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAddonItems = addonItems.filter((item) =>
    item.nama?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-[#FAF8F5] min-h-screen text-[#222222] font-sans relative">
      <Navbar />

      <main className="pt-6 pb-28 max-w-[1000px] mx-auto px-6">
        {/* Header Section dengan Search Bar */}
        <div className="pt-0 pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-[#222222]">
                Kelola Menu
              </h1>
              <p className="text-xs text-gray-400 font-medium mt-1">
                {menuItems.length} item · {bundleItems.length} bundle
              </p>
            </div>

            {/* Search Bar Input */}
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

          {/* Navigation Tabs & Action Button */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-2 bg-gray-200/60 p-1 rounded-full">
              <button
                onClick={() => setActiveTab('menu')}
                className={`flex items-center space-x-1 px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                  activeTab === 'menu'
                    ? 'bg-[#2B2B2B] text-white'
                    : 'text-gray-600'
                }`}
              >
                <Utensils size={14} /> <span>Menu</span>
              </button>
              <button
                onClick={() => setActiveTab('bundle')}
                className={`flex items-center space-x-1 px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                  activeTab === 'bundle'
                    ? 'bg-[#2B2B2B] text-white'
                    : 'text-gray-600'
                }`}
              >
                <Package size={14} /> <span>Bundle</span>
              </button>
              <button
                onClick={() => setActiveTab('addon')}
                className={`flex items-center space-x-1 px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                  activeTab === 'addon'
                    ? 'bg-[#2B2B2B] text-white'
                    : 'text-gray-600'
                }`}
              >
                <PlusCircle size={14} /> <span>Add-on</span>
              </button>
            </div>

            {activeTab === 'menu' && (
              <button
                onClick={() => {
                  setEditingMenuItem(null);
                  setIsMenuModalOpen(true);
                }}
                className="bg-[#2B2B2B] text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center space-x-1 hover:bg-black transition-colors"
              >
                <Plus size={16} /> <span>Tambah</span>
              </button>
            )}

            {activeTab === 'bundle' && (
              <button
                onClick={() => {
                  setEditingBundleItem(null);
                  setIsBundleModalOpen(true);
                }}
                className="bg-[#2B2B2B] text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center space-x-1 hover:bg-black transition-colors"
              >
                <Plus size={16} /> <span>Tambah Paket</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Content dengan Data Ter-filter */}
        <div className="pt-2">
          {activeTab === 'menu' && (
            <TabMenu
              items={filteredMenuItems}
              onEdit={(item) => {
                setEditingMenuItem(item);
                setIsMenuModalOpen(true);
              }}
              onDelete={(id) =>
                setMenuItems(menuItems.filter((i) => i.id !== id))
              }
            />
          )}
          {activeTab === 'bundle' && (
            <TabBundle
              items={filteredBundleItems}
              menuItems={menuItems}
              onEdit={(item) => {
                setEditingBundleItem(item);
                setIsBundleModalOpen(true);
              }}
              onDelete={(id) =>
                setBundleItems(bundleItems.filter((i) => i.id !== id))
              }
            />
          )}
          {activeTab === 'addon' && (
            <TabAddon
              items={filteredAddonItems}
              onAdd={(data) =>
                setAddonItems([...addonItems, { ...data, id: Date.now() }])
              }
              onDelete={(id) =>
                setAddonItems(addonItems.filter((i) => i.id !== id))
              }
            />
          )}
        </div>
      </main>

      <ModalMenu
        isOpen={isMenuModalOpen}
        onClose={() => setIsMenuModalOpen(false)}
        onSave={handleSaveMenu}
        editingItem={editingMenuItem}
      />
      <ModalBundle
        isOpen={isBundleModalOpen}
        onClose={() => setIsBundleModalOpen(false)}
        onSave={handleSaveBundle}
        editingItem={editingBundleItem}
        menuList={menuItems}
      />

      <BottomNavigation />
    </div>
  );
}