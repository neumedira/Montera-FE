import { useEffect, useState } from "react";

import Navbar from "../components/layout/Navbar";
import BottomNavigation from "../components/layout/BottomNavigation";

import BusinessProfile from "../components/settings/BusinessProfile";
import TaxSettings from "../components/settings/TaxSettings";
import PaymentMethods from "../components/settings/PaymentMethods";

import {
  getSettings,
  updateSettings,
} from "../api/admin";

export default function Settings() {
  // =========================================================
  // STATE
  // =========================================================

  const [settings, setSettings] = useState({
    business: {
      cafeName: "",
      address: "",
      whatsapp: "",
      instagram: "",
      tiktok: "",
    },

    tax: {
      regionalTax: "",
      serviceCharge: "",
    },

    paymentMethods: [],
  });

  const [loading, setLoading] = useState(true);

  // =========================================================
  // LOAD SETTINGS
  // =========================================================

  const loadSettings = async () => {
    try {
      setLoading(true);

      const response = await getSettings();

      console.log("========================================");
      console.log("SETTINGS API:", response);
      console.log("SETTINGS DATA:", response?.data);

      const data = response?.data || {};

      const business = data.business_profile;
      const tax = data.tax_setting;
      const payments = data.payment_settings;

      console.log("BUSINESS PROFILE:", business);
      console.log("TAX SETTING:", tax);
      console.log("PAYMENT SETTINGS:", payments);
      console.log("========================================");

      setSettings({
        business: {
          cafeName: business?.cafe_name || "",
          address: business?.address || "",
          whatsapp: business?.whatsapp_number || "",
          instagram: business?.instagram || "",
          tiktok: business?.tiktok || "",
        },

        tax: {
          regionalTax:
            tax?.tax_percentage ?? "",

          serviceCharge:
            tax?.service_charge_percentage ?? "",
        },

        paymentMethods:
          Array.isArray(payments)
            ? payments
            : [],
      });
    } catch (error) {
      console.error(
        "Gagal mengambil settings:",
        error
      );

      console.error(
        "ERROR RESPONSE:",
        error.response?.data
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    loadSettings();
  }, []);

  // =========================================================
  // SAVE BUSINESS + TAX
  // =========================================================

  const handleSaveSettings = async () => {
    try {
      const payload = {
        business_profile: {
          cafe_name:
            settings.business.cafeName,

          address:
            settings.business.address,

          whatsapp_number:
            settings.business.whatsapp,

          instagram:
            settings.business.instagram,

          tiktok:
            settings.business.tiktok,
        },

        tax_setting: {
          tax_percentage:
            settings.tax.regionalTax || 0,

          service_charge_percentage:
            settings.tax.serviceCharge || 0,
        },

        payment_settings:
          settings.paymentMethods || [],
      };

      console.log("========================================");
      console.log(
        "SAVE SETTINGS PAYLOAD:",
        payload
      );

      const response =
        await updateSettings(payload);

      console.log(
        "SAVE SETTINGS RESPONSE:",
        response
      );
      console.log("========================================");

      // Ambil data terbaru dari database
      await loadSettings();

      alert(
        "Pengaturan berhasil disimpan."
      );
    } catch (error) {
      console.error(
        "Gagal menyimpan settings:",
        error
      );

      console.error(
        "ERROR RESPONSE:",
        error.response?.data
      );

      alert(
        error.response?.data?.message ||
          "Gagal menyimpan pengaturan."
      );
    }
  };

  // =========================================================
  // SAVE PAYMENT
  // =========================================================

  const handleSavePayment = async (
    paymentData,
    editingId = null
  ) => {
    try {
      const currentPayments =
        Array.isArray(
          settings.paymentMethods
        )
          ? settings.paymentMethods
          : [];

      let paymentSettings;

      // =====================================================
      // EDIT
      // =====================================================

      if (editingId) {
        paymentSettings =
          currentPayments.map(
            (payment) => {
              if (payment.id !== editingId) {
                return payment;
              }

              return {
                ...payment,
                ...paymentData,

                // Backend
                method:
                  paymentData.method,

                is_active:
                  paymentData.is_active,

                provider_note:
                  paymentData.provider_note,

                qr_image:
                  paymentData.qr_image,
              };
            }
          );
      }

      // =====================================================
      // ADD
      // =====================================================

      else {
        paymentSettings = [
          ...currentPayments,
          paymentData,
        ];
      }

      const payload = {
        business_profile: {
          cafe_name:
            settings.business.cafeName,

          address:
            settings.business.address,

          whatsapp_number:
            settings.business.whatsapp,

          instagram:
            settings.business.instagram,

          tiktok:
            settings.business.tiktok,
        },

        tax_setting: {
          tax_percentage:
            settings.tax.regionalTax || 0,

          service_charge_percentage:
            settings.tax.serviceCharge || 0,
        },

        payment_settings:
          paymentSettings,
      };

      console.log(
        "========================================"
      );

      console.log(
        editingId
          ? "EDIT PAYMENT PAYLOAD:"
          : "ADD PAYMENT PAYLOAD:",
        payload
      );

      const response =
        await updateSettings(payload);

      console.log(
        "PAYMENT SAVE RESPONSE:",
        response
      );

      console.log(
        "========================================"
      );

      // =====================================================
      // GET ULANG DARI DATABASE
      // =====================================================

      await loadSettings();

      // =====================================================
      // RETURN TRUE
      // PaymentMethods akan menutup modal
      // =====================================================

      return true;
    } catch (error) {
      console.error(
        "Gagal menyimpan metode pembayaran:",
        error
      );

      console.error(
        "ERROR RESPONSE:",
        error.response?.data
      );

      alert(
        error.response?.data?.message ||
          "Gagal menyimpan metode pembayaran."
      );

      return false;
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f2eb] text-[#292725]">
        <Navbar />

        <main className="mx-auto max-w-[1000px] px-5 py-6 pb-[90px] md:px-8">
          <div className="pb-[17px]">
            <h1 className="text-[22px] font-extrabold tracking-[-0.5px] md:text-[24px]">
              Pengaturan
            </h1>

            <p className="mt-0.5 text-[12px] text-[#aaa59d]">
              Memuat pengaturan...
            </p>
          </div>
        </main>

        <BottomNavigation />
      </div>
    );
  }

  // =========================================================
  // RETURN
  // =========================================================

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
            onSave={handleSaveSettings}
          />

          <TaxSettings
            data={settings}
            setData={setSettings}
            onSave={handleSaveSettings}
          />

          <PaymentMethods
            data={settings}
            setData={setSettings}
            onSavePayment={handleSavePayment}
          />

        </div>
      </main>

      <BottomNavigation />
    </div>
  );
}