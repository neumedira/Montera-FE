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

  const filteredOrders = useMemo(() => {
    let result = [...orders];

    // Filter Dine-In / Take Away
    if (activeFilter !== "Semua") {
      result = result.filter(
        (order) => order.type === activeFilter
      );
    }

    return result;
  }, [activeFilter]);

  const toggleOrder = (id) => {
    setOpenOrder((prev) =>
      prev === id ? null : id
    );
  };

  return (
    <div className="min-h-screen bg-[#F6F3ED]">

      {/* ================= NAVBAR / HEADER ================= */}
      <Navbar />

      {/* ================= CONTENT PESANAN ================= */}
      <main className="px-5 pb-28 pt-7 md:px-8 lg:px-10">
        <div className="mx-auto max-w-[1100px]">

          {/* Title */}
          <div className="mb-4">
            <h1 className="text-[27px] font-extrabold tracking-[-0.03em] text-[#292825]">
              Pesanan
            </h1>

            <p className="mt-0.5 text-[14px] text-[#A3A09A]">
              {filteredOrders.length} pesanan ditemukan
            </p>
          </div>

          {/* Filter */}
          <div className="mb-4">
            <OrderFilters
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
              date={date}
              setDate={setDate}
            />
          </div>

          {/* Order Cards */}
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
              <div className="rounded-2xl border border-[#E7E1D5] bg-[#FFFCF4] p-10 text-center">
                <p className="text-sm font-semibold text-[#57544F]">
                  Tidak ada pesanan
                </p>

                <p className="mt-1 text-xs text-[#AAA69F]">
                  Belum ada pesanan untuk filter yang dipilih.
                </p>
              </div>
            )}
          </div>

        </div>
      </main>

      {/* ================= BOTTOM NAVIGATION ================= */}
      <BottomNavigation />

    </div>
  );
}