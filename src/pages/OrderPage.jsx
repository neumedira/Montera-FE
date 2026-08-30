
import { useEffect, useMemo, useState } from "react";

import Navbar from "../components/layout/Navbar";
import BottomNavigation from "../components/layout/BottomNavigation";

import OrderCard from "../components/orders/OrderCard";
import OrderFilters from "../components/orders/OrderFilters";

import api from "../api/axios";

export default function OrderPage() {
  // ==========================================
  // ORDERS DARI API
  // ==========================================
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // ==========================================
  // FILTER
  // ==========================================
  const [activeFilter, setActiveFilter] = useState("Semua");

  // DatePicker range
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Pesanan yang sedang dibuka
  const [openOrder, setOpenOrder] = useState(null);

  // ==========================================
  // AMBIL PESANAN DARI BACKEND
  // ==========================================
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      // --------------------------------------------------
      // FILTER "DONE"
      // --------------------------------------------------
      const params = {};

      if (activeFilter === "Done") {
        params.status = "done";
      }

      // --------------------------------------------------
      // FILTER ORDER TYPE
      // --------------------------------------------------
      else if (activeFilter === "Dine-In") {
        params.order_type = "dine-in";
      }

      else if (activeFilter === "Take Away") {
        params.order_type = "takeaway";
      }

      // --------------------------------------------------
      // FILTER DATE
      // --------------------------------------------------
      if (startDate) {
        params.start_date = startDate;
      }

      if (endDate) {
        params.end_date = endDate;
      }

      console.log("ORDER FETCH PARAMS:", params);

      const response = await api.get(
        "admin/orders",
        {
          params,
        }
      );

      console.log(
        "Response orders:",
        response.data
      );

      const apiOrders =
        response.data?.data?.data || [];

      // ======================================
      // MAPPING DATA BACKEND → FORMAT FE
      // ======================================

      const mappedOrders =
        apiOrders.map((order) => ({
          ...order,

          // Backend:
          // dine-in
          // takeaway
          //
          // FE:
          // Dine-In
          // Take Away
          type:
            order.order_type === "dine-in"
              ? "Dine-In"
              : "Take Away",

          // Date untuk kebutuhan filter/local UI
          dateValue:
            order.created_at
              ? order.created_at.slice(
                  0,
                  10
                )
              : "",

          // Customer
          customerName:
            order.customer_name,

          // Nomor order
          orderNumber:
            order.order_number,

          // Payment
          paymentMethod:
            order.payment_method,

          paymentStatus:
            order.payment_status,

          // STATUS BACKEND
          status:
            order.status,
        }));

      console.log(
        "Mapped orders:",
        mappedOrders
      );

      setOrders(
        mappedOrders
      );

    } catch (err) {
      console.error(
        "Gagal mengambil pesanan:",
        err
      );

      console.error(
        "Response error:",
        err.response?.data
      );

      setError(
        err.response?.data?.message ||
        "Gagal mengambil data pesanan."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // INITIAL / FILTER FETCH
  // ==========================================
  useEffect(() => {
    fetchOrders();
  }, [
    activeFilter,
    startDate,
    endDate,
  ]);

  // ==========================================
  // SET DATE RANGE
  // ==========================================
  const setDateRange = (
    start,
    end
  ) => {
    setStartDate(start);
    setEndDate(end);
  };

  // ==========================================
  // FILTER PESANAN DI FRONTEND
  // ==========================================
  //
  // Backend sudah melakukan filter utama.
  // FE tetap filter ulang supaya aman.
  //
  // ==========================================

  const filteredOrders =
    useMemo(() => {
      let result = [...orders];

      // ------------------------------------------
      // DONE
      // ------------------------------------------

      if (
        activeFilter === "Done"
      ) {
        result =
          result.filter(
            (order) =>
              order.status === "done"
          );
      }

      // ------------------------------------------
      // DINE-IN
      // ------------------------------------------

      else if (
        activeFilter === "Dine-In"
      ) {
        result =
          result.filter(
            (order) =>
              order.type ===
                "Dine-In" &&
              order.status !==
                "done"
          );
      }

      // ------------------------------------------
      // TAKE AWAY
      // ------------------------------------------

      else if (
        activeFilter ===
        "Take Away"
      ) {
        result =
          result.filter(
            (order) =>
              order.type ===
                "Take Away" &&
              order.status !==
                "done"
          );
      }

      // ------------------------------------------
      // SEMUA
      // ------------------------------------------

      else if (
        activeFilter ===
        "Semua"
      ) {
        result =
          result.filter(
            (order) =>
              order.status !==
              "done"
          );
      }

      // ------------------------------------------
      // RANGE TANGGAL
      // ------------------------------------------

      if (
        startDate ||
        endDate
      ) {
        result =
          result.filter(
            (order) => {
              if (
                !order.dateValue
              ) {
                return false;
              }

              // Hanya tanggal mulai
              if (
                startDate &&
                !endDate
              ) {
                return (
                  order.dateValue >=
                  startDate
                );
              }

              // Hanya tanggal akhir
              if (
                !startDate &&
                endDate
              ) {
                return (
                  order.dateValue <=
                  endDate
                );
              }

              // Range lengkap
              if (
                startDate &&
                endDate
              ) {
                return (
                  order.dateValue >=
                    startDate &&
                  order.dateValue <=
                    endDate
                );
              }

              return true;
            }
          );
      }

      return result;
    }, [
      orders,
      activeFilter,
      startDate,
      endDate,
    ]);

  // ==========================================
  // BUKA / TUTUP DETAIL
  // ==========================================
  const toggleOrder = (
    id
  ) => {
    setOpenOrder(
      (prev) =>
        prev === id
          ? null
          : id
    );
  };

  // ==========================================
  // SELESAIKAN PESANAN
  // ==========================================
  const handleDoneOrder =
    async (id) => {
      try {
        console.log(
          "MARK ORDER AS DONE:",
          id
        );

        // ========================================
        // UPDATE BACKEND
        // ========================================

        const response =
          await api.patch(
            `admin/orders/${id}/status`,
            {
              status: "done",
            }
          );

        console.log(
          "DONE ORDER RESPONSE:",
          response.data
        );

        // ========================================
        // UPDATE STATE LOKAL
        // ========================================

        setOrders(
          (prev) =>
            prev.map(
              (order) =>
                Number(
                  order.id
                ) ===
                Number(id)
                  ? {
                      ...order,
                      status:
                        "done",
                    }
                  : order
            )
        );

        // ========================================
        // TUTUP DETAIL
        // ========================================

        setOpenOrder(
          null
        );

        // ========================================
        // MASUK TAB DONE
        // ========================================

        setActiveFilter(
          "Done"
        );

        // ========================================
        // RESET DATE FILTER
        // ========================================

        setDateRange(
          "",
          ""
        );

      } catch (error) {
        console.error(
          "Gagal menyelesaikan pesanan:",
          error
        );

        console.error(
          "Response error:",
          error.response?.data
        );

        alert(
          error.response?.data
            ?.message ||
          "Gagal menyelesaikan pesanan."
        );
      }
    };

  // ==========================================
  // LOADING
  // ==========================================
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F6F3ED]">

        <Navbar />

        <main className="px-5 pb-28 pt-7 md:px-8 lg:px-10">

          <div className="mx-auto max-w-[1100px]">

            <div className="mb-4">

              <h1
                className="
                  text-[27px]
                  font-extrabold
                  tracking-[-0.03em]
                  text-[#292825]
                "
              >
                Pesanan
              </h1>

              <p className="mt-0.5 text-[14px] text-[#A3A09A]">
                Memuat pesanan...
              </p>

            </div>

          </div>

        </main>

        <BottomNavigation />

      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================
  if (error) {
    return (
      <div className="min-h-screen bg-[#F6F3ED]">

        <Navbar />

        <main className="px-5 pb-28 pt-7 md:px-8 lg:px-10">

          <div className="mx-auto max-w-[1100px]">

            <div
              className="
                rounded-2xl
                border border-[#E7E1D5]
                bg-[#FFFCF4]
                p-10
                text-center
              "
            >

              <p className="text-sm font-semibold text-red-500">
                Gagal mengambil pesanan
              </p>

              <p className="mt-1 text-xs text-[#AAA69F]">
                {error}
              </p>

              <button
                type="button"
                onClick={fetchOrders}
                className="
                  mt-3
                  text-xs
                  font-bold
                  underline
                  text-[#292825]
                "
              >
                Coba lagi
              </button>

            </div>

          </div>

        </main>

        <BottomNavigation />

      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="min-h-screen bg-[#F6F3ED]">

      {/* ===================================== */}
      {/* NAVBAR */}
      {/* ===================================== */}

      <Navbar />

      {/* ===================================== */}
      {/* CONTENT */}
      {/* ===================================== */}

      <main className="px-5 pb-28 pt-7 md:px-8 lg:px-10">

        <div className="mx-auto max-w-[1100px]">

          {/* TITLE */}

          <div className="mb-4">

            <h1
              className="
                text-[27px]
                font-extrabold
                tracking-[-0.03em]
                text-[#292825]
              "
            >
              Pesanan
            </h1>

            <p className="mt-0.5 text-[14px] text-[#A3A09A]">
              {filteredOrders.length} pesanan ditemukan
            </p>

          </div>

          {/* FILTER */}

          <div className="mb-4">

            <OrderFilters
              activeFilter={
                activeFilter
              }
              setActiveFilter={
                setActiveFilter
              }
              startDate={
                startDate
              }
              endDate={
                endDate
              }
              setDateRange={
                setDateRange
              }
            />

          </div>

          {/* LIST */}

          <div className="space-y-3">

            {filteredOrders.length >
            0 ? (

              filteredOrders.map(
                (order) => (

                  <OrderCard
                    key={order.id}
                    order={order}
                    open={
                      openOrder ===
                      order.id
                    }
                    onToggle={() =>
                      toggleOrder(
                        order.id
                      )
                    }
                    onDone={
                      handleDoneOrder
                    }
                    isDone={
                      order.status ===
                      "done"
                    }
                  />

                )
              )

            ) : (

              <div
                className="
                  rounded-2xl
                  border border-[#E7E1D5]
                  bg-[#FFFCF4]
                  p-10
                  text-center
                "
              >

                <p className="text-sm font-semibold text-[#57544F]">
                  Tidak ada pesanan
                </p>

                <p className="mt-1 text-xs text-[#AAA69F]">
                  Belum ada pesanan yang sesuai dengan filter.
                </p>

              </div>

            )}

          </div>

        </div>

      </main>

      {/* ===================================== */}
      {/* BOTTOM NAVIGATION */}
      {/* ===================================== */}

      <BottomNavigation />

    </div>
  );
}

