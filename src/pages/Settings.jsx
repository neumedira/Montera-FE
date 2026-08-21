import { useState } from "react";

import Navbar from "../components/layout/Navbar";
import BottomNavigation from "../components/layout/BottomNavigation";

import BusinessProfile from "../components/settings/BusinessProfile";
import TaxSettings from "../components/settings/TaxSettings";
import PaymentMethods from "../components/settings/PaymentMethods";
import ReceiptSettings from "../components/settings/ReceiptSettings";

import { mockSettings } from "../data/mockSettings";

export default function Settings() {
  const [settings, setSettings] = useState(mockSettings);

  const handleSave = () => {
    console.log("Settings saved:", settings);
  };

  return (
    <div className="min-h-screen bg-[#f5f2eb] text-[#292725]">

      <Navbar />

      <main className="pt-[52px] pb-[90px]">
        <div className="w-full max-w-[900px] mx-auto px-[18px] md:px-6">

          {/* Page Header */}
          <div className="pt-[25px] pb-[17px]">
            <h1 className="text-[22px] md:text-[24px] font-extrabold tracking-[-0.5px]">
              Pengaturan
            </h1>

            <p className="text-[12px] text-[#aaa59d] mt-0.5">
              Konfigurasi sistem Montera Burger
            </p>
          </div>

          {/* Settings */}
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

            <ReceiptSettings
              data={settings}
              setData={setSettings}
            />

          </div>
        </div>
      </main>

      <BottomNavigation />

    </div>
  );
}