import { useMemo, useState } from "react";

import Navbar from "../components/layout/Navbar";
import BottomNavigation from "../components/layout/BottomNavigation";

import OrderCard from "../components/orders/OrderCard";
import OrderFilters from "../components/orders/OrderFilters";
import { orders } from "../data/orders";

export default function OrderPage() {
  const [activeFilter, setActiveFilter] =
    useState("Semua");

  // ==============================
  // DATE RANGE
  // ==============================
  const [startDate, setStartDate] =
    useState("");

  const [endDate, setEndDate] =
    useState("");

  const [openOrder, setOpenOrder] =
    useState(null);


  // ==========================================
  // FILTER PESANAN
  // ==========================================
  const filteredOrders = useMemo(() => {
    let result = [...orders];


    // ------------------------------------------
    // FILTER JENIS PESANAN
    // ------------------------------------------
    if (activeFilter !== "Semua") {
      result = result.filter(
        (order) =>
          order.type === activeFilter
      );
    }


    // ------------------------------------------
    // FILTER TANGGAL
    // ------------------------------------------

    // Kalau tanggal awal + akhir dipilih
    if (startDate && endDate) {
      result = result.filter(
        (order) =>
          order.dateValue >= startDate &&
          order.dateValue <= endDate
      );
    }

    // Kalau baru tanggal awal
    else if (startDate) {
      result = result.filter(
        (order) =>
          order.dateValue === startDate
      );
    }


    return result;

  }, [
    activeFilter,
    startDate,
    endDate,
  ]);


  // ==========================================
  // HANDLE DATE RANGE
  // ==========================================
  const handleDateRangeChange = (
    start,
    end
  ) => {
    setStartDate(start);
    setEndDate(end);

    // Kalau memilih tanggal,
    // filter kategori tetap bisa dipakai.
    //
    // Jadi misalnya:
    // Dine-In + 18-20 Agustus
    // tetap bisa digunakan.
  };


  // ==========================================
  // BUKA / TUTUP DETAIL PESANAN
  // ==========================================
  const toggleOrder = (id) => {
    setOpenOrder((prev) =>
      prev === id ? null : id
    );
  };


  return (
    <div className="min-h-screen bg-[#F6F3ED]">

      {/* ===================================== */}
      {/* NAVBAR */}
      {/* ===================================== */}
      <Navbar />


      {/* ===================================== */}
      {/* CONTENT PESANAN */}
      {/* ===================================== */}
      <main className="px-5 pb-28 pt-7 md:px-8 lg:px-10">

        <div className="mx-auto max-w-[1100px]">

          {/* ================================= */}
          {/* TITLE */}
          {/* ================================= */}
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

            <p
              className="
                mt-0.5
                text-[14px]
                text-[#A3A09A]
              "
            >
              {filteredOrders.length} pesanan ditemukan
            </p>

          </div>


          {/* ================================= */}
          {/* FILTER */}
          {/* ================================= */}
          <div className="mb-4">

            <OrderFilters
              activeFilter={activeFilter}
              setActiveFilter={
                setActiveFilter
              }

              startDate={startDate}
              endDate={endDate}

              setDateRange={
                handleDateRangeChange
              }
            />

          </div>


          {/* ================================= */}
          {/* LIST PESANAN */}
          {/* ================================= */}
          <div className="space-y-3">

            {filteredOrders.length > 0 ? (

              filteredOrders.map((order) => (

                <OrderCard
                  key={order.id}
                  order={order}
                  open={
                    openOrder === order.id
                  }
                  onToggle={() =>
                    toggleOrder(order.id)
                  }
                />

              ))

            ) : (

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
                    text-[#57544F]
                  "
                >
                  Tidak ada pesanan
                </p>

                <p
                  className="
                    mt-1
                    text-xs
                    text-[#AAA69F]
                  "
                >
                  Belum ada pesanan yang
                  sesuai dengan filter.
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