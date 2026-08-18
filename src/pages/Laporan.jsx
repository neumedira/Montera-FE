import { useState } from "react";

import {
  UsersRound,
  TrendingUp,
  WalletCards,
  QrCode,
  BarChart3,
} from "lucide-react";

import Navbar from "../components/layout/Navbar";
import BottomNavigation from "../components/layout/BottomNavigation";

import PeriodTabs from "../components/common/PeriodTabs";
import SummaryCard from "../components/laporan/SummaryCard";
import PaymentMethod from "../components/laporan/PaymentMethod";
import SoldItems from "../components/common/SoldItems";


// ================= REPORT DATA =================
const reportData = {
  "Hari Ini": {
    totalTransactions: 2,
    totalSales: 250000,
    cash: 165000,
    qris: 85000,

    soldItems: [
      {
        name: "Ayam Bakar Kecap",
        quantity: 2,
        price: 70000,
      },
      {
        name: "Soto Ayam Bening",
        quantity: 1,
        price: 22000,
      },
      {
        name: "Matcha Latte",
        quantity: 1,
        price: 28000,
      },
      {
        name: "Paket Family Montera",
        quantity: 1,
        price: 120000,
      },
    ],
  },


  "7 Hari": {
    totalTransactions: 18,
    totalSales: 1850000,
    cash: 1120000,
    qris: 730000,

    soldItems: [
      {
        name: "Ayam Bakar Kecap",
        quantity: 15,
        price: 525000,
      },
      {
        name: "Soto Ayam Bening",
        quantity: 12,
        price: 264000,
      },
      {
        name: "Matcha Latte",
        quantity: 10,
        price: 280000,
      },
      {
        name: "Paket Family Montera",
        quantity: 6,
        price: 720000,
      },
    ],
  },


  "30 Hari": {
    totalTransactions: 76,
    totalSales: 7850000,
    cash: 4650000,
    qris: 3200000,

    soldItems: [
      {
        name: "Ayam Bakar Kecap",
        quantity: 58,
        price: 2030000,
      },
      {
        name: "Soto Ayam Bening",
        quantity: 45,
        price: 990000,
      },
      {
        name: "Matcha Latte",
        quantity: 38,
        price: 1064000,
      },
      {
        name: "Paket Family Montera",
        quantity: 28,
        price: 3360000,
      },
    ],
  },


  "Semua": {
    totalTransactions: 245,
    totalSales: 25450000,
    cash: 15100000,
    qris: 10350000,

    soldItems: [
      {
        name: "Ayam Bakar Kecap",
        quantity: 185,
        price: 6475000,
      },
      {
        name: "Soto Ayam Bening",
        quantity: 142,
        price: 3124000,
      },
      {
        name: "Matcha Latte",
        quantity: 125,
        price: 3500000,
      },
      {
        name: "Paket Family Montera",
        quantity: 103,
        price: 12360000,
      },
    ],
  },
};


// ================= LAPORAN PAGE =================
export default function Laporan() {

  const [activePeriod, setActivePeriod] = useState("Hari Ini");

  // Ambil data sesuai periode yang aktif
  const report = reportData[activePeriod];


  return (
    <div className="min-h-screen bg-[#f5f3ee] pb-[100px]">

      {/* ================= HEADER ================= */}
      <Navbar />


      {/* ================= MAIN ================= */}
      <main className="max-w-[1000px] mx-auto px-5 md:px-8 py-6">

        {/* ================= TITLE ================= */}
        <div className="mb-5">

          <div className="flex items-center gap-2">

            <BarChart3
              size={20}
              strokeWidth={2}
            />

            <h1 className="text-[24px] font-extrabold">
              Laporan
            </h1>

          </div>

          <p className="text-[#99958e] text-[13px] mt-[-2px]">
            Ringkasan penjualan
          </p>

        </div>


        {/* ================= PERIOD ================= */}
        <div className="mb-5">

          <PeriodTabs
            activePeriod={activePeriod}
            onChange={setActivePeriod}
          />

        </div>


        {/* ================= SUMMARY ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">

          {/* Total Transaksi */}
          <SummaryCard
            title="Total Transaksi"
            value={report.totalTransactions}
            subtitle={activePeriod}
            icon={UsersRound}
            variant="dark"
          />


          {/* Total Penjualan */}
          <SummaryCard
            title="Total Penjualan"
            value={`Rp ${report.totalSales.toLocaleString("id-ID")}`}
            subtitle={activePeriod}
            icon={TrendingUp}
            variant="red"
          />


          {/* Cash */}
          <SummaryCard
            title="Cash"
            value={`Rp ${report.cash.toLocaleString("id-ID")}`}
            subtitle={activePeriod}
            icon={WalletCards}
            variant="orange"
          />


          {/* QRIS */}
          <SummaryCard
            title="QRIS"
            value={`Rp ${report.qris.toLocaleString("id-ID")}`}
            subtitle={activePeriod}
            icon={QrCode}
            variant="light"
          />

        </div>


        {/* ================= PAYMENT ================= */}
        <div className="mb-5">

          <PaymentMethod
            cash={report.cash}
            qris={report.qris}
          />

        </div>


        {/* ================= SOLD ITEMS ================= */}
        <SoldItems
          items={report.soldItems}
        />

      </main>


      {/* ================= BOTTOM NAV ================= */}
      <BottomNavigation />

    </div>
  );
}