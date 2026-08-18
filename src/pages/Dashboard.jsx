import Navbar from "../components/layout/Navbar";
import BottomNavigation from "../components/layout/BottomNavigation";

import DashboardHeader from "../components/dashboard/DashboardHeader";
import DashboardSummary from "../components/dashboard/DashboardSummary";
import PaymentMethod from "../components/laporan/PaymentMethod";
import SoldItems from "../components/common/SoldItems";
import RecentOrders from "../components/dashboard/RecentOrders";
import OverallSummary from "../components/dashboard/OverallSummary";


const todayData = {
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
};


export default function Dashboard() {
  return (
    <div className="
      min-h-screen
      bg-[#f5f3ee]
      pb-[100px]
    ">

      {/* ================= HEADER ================= */}
      <Navbar />


      {/* ================= MAIN ================= */}
      <main className="
        max-w-[1000px]
        mx-auto
        px-5
        md:px-8
        py-6
      ">

        {/* Dashboard Header */}
        <DashboardHeader />


        {/* Summary Cards */}
        <DashboardSummary />


        {/* Payment Method */}
        <div className="mb-5">

          <PaymentMethod
            cash={todayData.cash}
            qris={todayData.qris}
          />

        </div>


        {/* Sold Items */}
        <div className="mb-5">

          <SoldItems
            items={todayData.soldItems}
          />

        </div>


        {/* Recent Orders */}
        <RecentOrders />


        {/* Overall Summary */}
        <OverallSummary />

      </main>


      {/* ================= BOTTOM NAV ================= */}
      <BottomNavigation />

    </div>
  );
}