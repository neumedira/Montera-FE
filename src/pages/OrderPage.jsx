import { useMemo, useState } from "react";

import Navbar from "../components/layout/Navbar";
import BottomNavigation from "../components/layout/BottomNavigation";

import OrderCard from "../components/orders/OrderCard";
import OrderFilters from "../components/orders/OrderFilters";

import { orders } from "../data/orders";

export default function OrderPage() {
  // ==========================================
  // FILTER
  // ==========================================
  const [activeFilter, setActiveFilter] = useState("Semua");

  // DatePicker range
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Pesanan yang sedang dibuka
  const [openOrder, setOpenOrder] = useState(null);

  // ID pesanan Cash yang sudah Done
  const [doneOrders, setDoneOrders] = useState([]);

  // ==========================================
  // SET DATE RANGE
  // ==========================================
  const setDateRange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  // ==========================================
  // FILTER PESANAN
  // ==========================================
  const filteredOrders = useMemo(() => {
    let result = [...orders];

    // ------------------------------------------
    // FILTER DONE
    // ------------------------------------------
    if (activeFilter === "Done") {
      result = result.filter((order) =>
        doneOrders.includes(order.id)
      );
    }

    // ------------------------------------------
    // FILTER DINE-IN
    // ------------------------------------------
    else if (activeFilter === "Dine-In") {
      result = result.filter(
        (order) =>
          order.type === "Dine-In" &&
          !doneOrders.includes(order.id)
      );
    }

    // ------------------------------------------
    // FILTER TAKE AWAY
    // ------------------------------------------
    else if (activeFilter === "Take Away") {
      result = result.filter(
        (order) =>
          order.type === "Take Away" &&
          !doneOrders.includes(order.id)
      );
    }

    // ------------------------------------------
    // FILTER SEMUA
    // ------------------------------------------
    else if (activeFilter === "Semua") {
      result = result.filter(
        (order) => !doneOrders.includes(order.id)
      );
    }

    // ------------------------------------------
    // FILTER RANGE TANGGAL
    // ------------------------------------------
    if (startDate || endDate) {
      result = result.filter((order) => {
        if (!order.dateValue) {
          return false;
        }

        // Hanya tanggal mulai
        if (startDate && !endDate) {
          return order.dateValue >= startDate;
        }

        // Hanya tanggal akhir
        if (!startDate && endDate) {
          return order.dateValue <= endDate;
        }

        // Range tanggal lengkap
        if (startDate && endDate) {
          return (
            order.dateValue >= startDate &&
            order.dateValue <= endDate
          );
        }

        return true;
      });
    }

    return result;
  }, [
    activeFilter,
    startDate,
    endDate,
    doneOrders,
  ]);

  // ==========================================
  // BUKA / TUTUP DETAIL
  // ==========================================
  const toggleOrder = (id) => {
    setOpenOrder((prev) =>
      prev === id ? null : id
    );
  };

  // ==========================================
  // SELESAIKAN PESANAN CASH
  // ==========================================
  const handleDoneOrder = (id) => {
    setDoneOrders((prev) => {
      if (prev.includes(id)) {
        return prev;
      }

      return [...prev, id];
    });

    // Tutup detail
    setOpenOrder(null);

    // Otomatis pindah ke filter Done
    setActiveFilter("Done");

    // Reset filter tanggal
    setDateRange("", "");
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
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
              startDate={startDate}
              endDate={endDate}
              setDateRange={setDateRange}
            />
          </div>

          {/* LIST PESANAN */}
          <div className="space-y-3">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  open={openOrder === order.id}
                  onToggle={() => toggleOrder(order.id)}
                  onDone={handleDoneOrder}
                  isDone={doneOrders.includes(order.id)}
                />
              ))
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