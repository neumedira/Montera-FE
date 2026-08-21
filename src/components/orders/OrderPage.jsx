import { useMemo, useState } from "react";

import Navbar from "../layout/Navbar";
import BottomNavigation from "../layout/BottomNavigation";

import OrderCard from "./OrderCard";
import OrderFilters from "./OrderFilters";
import { orders } from "../../data/orders";

export default function OrderPage() {
  const [activeFilter, setActiveFilter] = useState("Semua");
  const [date, setDate] = useState("");
  const [openOrder, setOpenOrder] = useState(null);

  // ==========================================
  // FILTER PESANAN
  // ==========================================
  const filteredOrders = useMemo(() => {
    let result = [...orders];

    // ------------------------------------------
    // FILTER BERDASARKAN JENIS PESANAN
    // ------------------------------------------
    if (activeFilter !== "Semua") {
      result = result.filter(
        (order) => order.type === activeFilter
      );
    }

    // ------------------------------------------
    // FILTER BERDASARKAN TANGGAL
    // ------------------------------------------
    if (date) {
      result = result.filter(
        (order) => order.dateValue === date
      );
    }

    return result;
  }, [activeFilter, date]);

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
            <h1 className="text-[27px] font-extrabold tracking-[-0.03em] text-[#292825]">
              Pesanan
            </h1>

            <p className="mt-0.5 text-[14px] text-[#A3A09A]">
              {filteredOrders.length} pesanan ditemukan
            </p>
          </div>

          {/* ================================= */}
          {/* FILTER */}
          {/* ================================= */}
          <div className="mb-4">
            <OrderFilters
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
              date={date}
              setDate={setDate}
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
                  open={openOrder === order.id}
                  onToggle={() => toggleOrder(order.id)}
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