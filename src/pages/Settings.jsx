import { useState } from "react";

import Navbar from "../components/layout/Navbar";
import BottomNavigation from "../components/layout/BottomNavigation";

import BusinessProfile from "../components/settings/BusinessProfile";
import TaxSettings from "../components/settings/TaxSettings";
import PaymentMethods from "../components/settings/PaymentMethods";

import { mockSettings } from "../data/mockSettings";

export default function Settings() {
  const [settings, setSettings] = useState(mockSettings);

  const handleSave = () => {
    console.log("Settings saved:", settings);
  };

  return (
    <div className="min-h-screen bg-[#f5f2eb] text-[#292725]">
      <Navbar />

      <main className="mx-auto max-w-[1000px] px-5 py-6 pb-[90px] md:px-8">

        {/* PAGE HEADER */}
        <div className="pb-[17px]">
          <h1 className="text-[22px] font-extrabold tracking-[-0.5px] md:text-[24px]">
            Pengaturan
          </h1>

          <p className="mt-0.5 text-[12px] text-[#aaa59d]">
            Konfigurasi sistem Montera Burger
          </p>
        </div>

        {/* SETTINGS */}
        <div className="space-y-[17px]">

          <BusinessProfile
            data={settings}
            setData={setSettings}
          />

          <TaxSettings
            data={settings}
            setData={setSettings}
          />

          <PaymentMethods
            data={settings}
            setData={setSettings}
          />

        </div>
      </main>

      <BottomNavigation />
    </div>
  );
}