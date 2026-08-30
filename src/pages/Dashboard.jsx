
import { useEffect, useState } from "react";

import Navbar from "../components/layout/Navbar";
import BottomNavigation from "../components/layout/BottomNavigation";

import DashboardHeader from "../components/dashboard/DashboardHeader";
import DashboardSummary from "../components/dashboard/DashboardSummary";
import PaymentMethod from "../components/laporan/PaymentMethod";
import SoldItems from "../components/common/SoldItems";
import RecentOrders from "../components/dashboard/RecentOrders";
import OverallSummary from "../components/dashboard/OverallSummary";

import api from "../api/axios";

export default function Dashboard() {
  // =======================================================
  // DASHBOARD DATA
  // =======================================================

  const [dashboardData, setDashboardData] = useState({
    // OVERALL
    total_orders: 0,
    total_revenue: 0,

    // TODAY
    today_orders: 0,
    today_revenue: 0,

    // ACTIVE PRODUCTS
    // Menu aktif + Bundle aktif
    active_menu_count: 0,

    // OTHER DATA
    today_payment_methods: [],
    today_sold_items: [],
    recent_orders: [],
  });

  // =======================================================
  // STATE
  // =======================================================

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // =======================================================
  // FETCH DASHBOARD
  // =======================================================

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      console.log(
        "🔄 FETCHING ADMIN DASHBOARD..."
      );

      // =====================================================
      // DASHBOARD API
      // =====================================================

      const response =
        await api.get(
          "admin/dashboard"
        );

      console.log(
        "📊 DASHBOARD API:",
        response.data
      );

      const data =
        response.data?.data || {};

      // =====================================================
      // DEBUG ACTIVE PRODUCT
      // =====================================================

      console.log(
        "🛒 ACTIVE PRODUCT COUNT:",
        data.active_menu_count
      );

      // =====================================================
      // SET DASHBOARD DATA
      // =====================================================

      setDashboardData({
        // -------------------------------------------------
        // OVERALL
        // -------------------------------------------------

        total_orders:
          Number(
            data.total_orders || 0
          ),

        total_revenue:
          Number(
            data.total_revenue || 0
          ),

        // -------------------------------------------------
        // TODAY
        // -------------------------------------------------

        today_orders:
          Number(
            data.today_orders || 0
          ),

        today_revenue:
          Number(
            data.today_revenue || 0
          ),

        // -------------------------------------------------
        // ACTIVE PRODUCTS
        // Menu + Bundle aktif
        // -------------------------------------------------

        active_menu_count:
          Number(
            data.active_menu_count || 0
          ),

        // -------------------------------------------------
        // PAYMENT METHODS
        // -------------------------------------------------

        today_payment_methods:
          Array.isArray(
            data.today_payment_methods
          )
            ? data.today_payment_methods
            : [],

        // -------------------------------------------------
        // SOLD ITEMS
        // -------------------------------------------------

        today_sold_items:
          Array.isArray(
            data.today_sold_items
          )
            ? data.today_sold_items
            : [],

        // -------------------------------------------------
        // RECENT ORDERS
        // -------------------------------------------------

        recent_orders:
          Array.isArray(
            data.recent_orders
          )
            ? data.recent_orders
            : [],
      });

    } catch (err) {

      console.error(
        "❌ Gagal mengambil data dashboard:",
        err
      );

      console.error(
        "❌ Response error:",
        err.response?.data
      );

      setError(
        err.response?.data?.message ||
          "Gagal mengambil data dashboard."
      );

    } finally {

      setLoading(false);
    }
  };

  // =======================================================
  // INITIAL FETCH
  // =======================================================

  useEffect(() => {
    fetchDashboard();
  }, []);

  // =======================================================
  // LOADING
  // =======================================================

  if (loading) {
    return (
      <div
        className="
          min-h-screen
          bg-[#f5f3ee]
          pb-[100px]
        "
      >

        <Navbar />

        <main
          className="
            mx-auto
            max-w-[1000px]
            px-5
            py-6
            md:px-8
          "
        >

          <div className="mb-6">

            <h1
              className="
                text-[27px]
                font-extrabold
                tracking-[-0.03em]
                text-[#292825]
              "
            >
              Dashboard
            </h1>

            <p
              className="
                mt-1
                text-sm
                text-[#A3A09A]
              "
            >
              Memuat data dashboard...
            </p>

          </div>

        </main>

        <BottomNavigation />

      </div>
    );
  }

  // =======================================================
  // ERROR
  // =======================================================

  if (error) {
    return (
      <div
        className="
          min-h-screen
          bg-[#f5f3ee]
          pb-[100px]
        "
      >

        <Navbar />

        <main
          className="
            mx-auto
            max-w-[1000px]
            px-5
            py-6
            md:px-8
          "
        >

          <div
            className="
              rounded-2xl
              border
              border-[#E7E1D5]
              bg-[#FFFCF4]
              p-10
              text-center
            "
          >

            <p
              className="
                text-sm
                font-semibold
                text-red-500
              "
            >
              Gagal memuat dashboard
            </p>

            <p
              className="
                mt-1
                text-xs
                text-[#AAA69F]
              "
            >
              {error}
            </p>

            <button
              type="button"
              onClick={fetchDashboard}
              className="
                mt-3
                text-xs
                font-bold
                text-[#292825]
                underline
              "
            >
              Coba lagi
            </button>

          </div>

        </main>

        <BottomNavigation />

      </div>
    );
  }

  // =======================================================
  // DATA
  // =======================================================

  const paymentMethods =
    dashboardData.today_payment_methods;

  const soldItems =
    dashboardData.today_sold_items;

  const recentOrders =
    dashboardData.recent_orders;

  // =======================================================
  // PAGE
  // =======================================================

  return (
    <div
      className="
        min-h-screen
        bg-[#f5f3ee]
        pb-[100px]
      "
    >

      {/* =================================================
          NAVBAR
      ================================================= */}

      <Navbar />

      {/* =================================================
          MAIN
      ================================================= */}

      <main
        className="
          mx-auto
          max-w-[1000px]
          px-5
          py-6
          md:px-8
        "
      >

        {/* =================================================
            HEADER
        ================================================= */}

        <DashboardHeader />

        {/* =================================================
            SUMMARY
        ================================================= */}

        <DashboardSummary
          todayOrders={
            dashboardData.today_orders
          }

          todayRevenue={
            dashboardData.today_revenue
          }

          paymentMethods={
            paymentMethods
          }
        />

        {/* =================================================
            PAYMENT METHOD
        ================================================= */}

        <div className="mb-5">

          <PaymentMethod
            paymentMethods={
              paymentMethods
            }
          />

        </div>

        {/* =================================================
            SOLD ITEMS
        ================================================= */}

        <div className="mb-5">

          <SoldItems
            items={
              soldItems
            }
          />

        </div>

        {/* =================================================
            RECENT ORDERS
        ================================================= */}

        <RecentOrders
          orders={
            recentOrders
          }
        />

        {/* =================================================
            OVERALL SUMMARY
        ================================================= */}

        <OverallSummary
          totalOrders={
            dashboardData.total_orders
          }

          totalRevenue={
            dashboardData.total_revenue
          }

          activeMenuCount={
            dashboardData.active_menu_count
          }
        />

      </main>

      {/* =================================================
          BOTTOM NAVIGATION
      ================================================= */}

      <BottomNavigation />

    </div>
  );
}
