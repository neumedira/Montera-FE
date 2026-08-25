import { useMemo, useState } from "react";

import {
  UsersRound,
  TrendingUp,
  WalletCards,
  QrCode,
  BarChart3,
  SlidersHorizontal,
} from "lucide-react";

import Navbar from "../components/layout/Navbar";
import BottomNavigation from "../components/layout/BottomNavigation";

import SummaryCard from "../components/laporan/SummaryCard";
import PaymentMethod from "../components/laporan/PaymentMethod";
import SoldItems from "../components/common/SoldItems";
import DatePicker from "../components/common/DatePicker";

// =====================================================
// DUMMY TRANSACTION DATA
// =====================================================
const transactions = [
  {
    id: 1,
    date: "2026-08-18",
    paymentMethod: "cash",
    total: 92000,
    items: [
      {
        name: "Soto Ayam Bening",
        quantity: 2,
        price: 44000,
      },
      {
        name: "Matcha Latte",
        quantity: 1,
        price: 28000,
      },
      {
        name: "Es Teh",
        quantity: 2,
        price: 20000,
      },
    ],
  },

  {
    id: 2,
    date: "2026-08-18",
    paymentMethod: "qris",
    total: 120000,
    items: [
      {
        name: "Paket Family Montera",
        quantity: 1,
        price: 120000,
      },
    ],
  },

  {
    id: 3,
    date: "2026-08-19",
    paymentMethod: "cash",
    total: 98000,
    items: [
      {
        name: "Ayam Bakar Kecap",
        quantity: 1,
        price: 70000,
      },
      {
        name: "Matcha Latte",
        quantity: 1,
        price: 28000,
      },
    ],
  },

  {
    id: 4,
    date: "2026-08-19",
    paymentMethod: "qris",
    total: 264000,
    items: [
      {
        name: "Soto Ayam Bening",
        quantity: 6,
        price: 264000,
      },
    ],
  },

  {
    id: 5,
    date: "2026-08-20",
    paymentMethod: "cash",
    total: 210000,
    items: [
      {
        name: "Ayam Bakar Kecap",
        quantity: 3,
        price: 210000,
      },
    ],
  },

  {
    id: 6,
    date: "2026-08-20",
    paymentMethod: "qris",
    total: 56000,
    items: [
      {
        name: "Matcha Latte",
        quantity: 2,
        price: 56000,
      },
    ],
  },

  {
    id: 7,
    date: "2026-08-21",
    paymentMethod: "cash",
    total: 192000,
    items: [
      {
        name: "Paket Family Montera",
        quantity: 1,
        price: 120000,
      },
      {
        name: "Soto Ayam Bening",
        quantity: 2,
        price: 44000,
      },
      {
        name: "Es Teh",
        quantity: 2,
        price: 28000,
      },
    ],
  },

  {
    id: 8,
    date: "2026-08-22",
    paymentMethod: "qris",
    total: 140000,
    items: [
      {
        name: "Ayam Bakar Kecap",
        quantity: 2,
        price: 140000,
      },
    ],
  },

  {
    id: 9,
    date: "2026-08-22",
    paymentMethod: "cash",
    total: 84000,
    items: [
      {
        name: "Matcha Latte",
        quantity: 3,
        price: 84000,
      },
    ],
  },

  {
    id: 10,
    date: "2026-08-23",
    paymentMethod: "cash",
    total: 142000,
    items: [
      {
        name: "Ayam Bakar Kecap",
        quantity: 1,
        price: 70000,
      },
      {
        name: "Soto Ayam Bening",
        quantity: 2,
        price: 44000,
      },
      {
        name: "Es Teh",
        quantity: 1,
        price: 28000,
      },
    ],
  },

  {
    id: 11,
    date: "2026-08-23",
    paymentMethod: "qris",
    total: 120000,
    items: [
      {
        name: "Paket Family Montera",
        quantity: 1,
        price: 120000,
      },
    ],
  },

  {
    id: 12,
    date: "2026-08-24",
    paymentMethod: "cash",
    total: 165000,
    items: [
      {
        name: "Ayam Bakar Kecap",
        quantity: 2,
        price: 140000,
      },
      {
        name: "Soto Ayam Bening",
        quantity: 1,
        price: 22000,
      },
      {
        name: "Es Teh",
        quantity: 1,
        price: 3000,
      },
    ],
  },

  {
    id: 13,
    date: "2026-08-24",
    paymentMethod: "qris",
    total: 113000,
    items: [
      {
        name: "Paket Family Montera",
        quantity: 1,
        price: 120000,
      },
    ],
  },
];

// =====================================================
// PERIOD TABS
// =====================================================
const periods = [
  {
    label: "Hari Ini",
    value: "Hari Ini",
  },
  {
    label: "7 Hari",
    value: "7 Hari",
  },
  {
    label: "30 Hari",
    value: "30 Hari",
  },
  {
    label: "Semua",
    value: "Semua",
  },
];

// =====================================================
// FORMAT DATE
// =====================================================
const formatDate = (date) => {
  if (!date) return "";

  return new Date(
    `${date}T00:00:00`
  ).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

// =====================================================
// GET TODAY
// =====================================================
const getToday = () => {
  return "2026-08-24";
};

// =====================================================
// GET START DATE BERDASARKAN PERIODE
// =====================================================
const getStartDate = (period) => {
  const today = new Date(
    `${getToday()}T00:00:00`
  );

  if (period === "Hari Ini") {
    return getToday();
  }

  if (period === "7 Hari") {
    const date = new Date(today);

    date.setDate(
      date.getDate() - 6
    );

    return date
      .toISOString()
      .split("T")[0];
  }

  if (period === "30 Hari") {
    const date = new Date(today);

    date.setDate(
      date.getDate() - 29
    );

    return date
      .toISOString()
      .split("T")[0];
  }

  return null;
};

// =====================================================
// LAPORAN PAGE
// =====================================================
export default function Laporan() {
  const [activePeriod, setActivePeriod] =
    useState("Hari Ini");

  const [startDate, setStartDate] =
    useState("");

  const [endDate, setEndDate] =
    useState("");

  // ===================================================
  // FILTER TRANSACTIONS
  // ===================================================
  const filteredTransactions = useMemo(() => {

    // -------------------------------------------------
    // CUSTOM DATE RANGE
    // -------------------------------------------------
    if (startDate && endDate) {
      return transactions.filter(
        (transaction) => {
          return (
            transaction.date >=
              startDate &&
            transaction.date <=
              endDate
          );
        }
      );
    }

    // -------------------------------------------------
    // SINGLE DATE
    // -------------------------------------------------
    if (startDate && !endDate) {
      return transactions.filter(
        (transaction) =>
          transaction.date ===
          startDate
      );
    }

    // -------------------------------------------------
    // PERIOD FILTER
    // -------------------------------------------------
    const periodStartDate =
      getStartDate(activePeriod);

    // Semua
    if (!periodStartDate) {
      return transactions;
    }

    return transactions.filter(
      (transaction) =>
        transaction.date >=
          periodStartDate &&
        transaction.date <=
          getToday()
    );

  }, [
    activePeriod,
    startDate,
    endDate,
  ]);

  // ===================================================
  // HITUNG LAPORAN
  // ===================================================
  const report = useMemo(() => {

    let totalSales = 0;
    let cash = 0;
    let qris = 0;

    const soldItemsMap = {};

    filteredTransactions.forEach(
      (transaction) => {

        totalSales +=
          transaction.total;

        if (
          transaction.paymentMethod ===
          "cash"
        ) {
          cash += transaction.total;
        }

        if (
          transaction.paymentMethod ===
          "qris"
        ) {
          qris += transaction.total;
        }

        transaction.items.forEach(
          (item) => {

            if (
              !soldItemsMap[item.name]
            ) {
              soldItemsMap[item.name] = {
                name: item.name,
                quantity: 0,
                price: 0,
              };
            }

            soldItemsMap[
              item.name
            ].quantity +=
              item.quantity;

            soldItemsMap[
              item.name
            ].price +=
              item.price;
          }
        );
      }
    );

    return {
      totalTransactions:
        filteredTransactions.length,

      totalSales,

      cash,

      qris,

      soldItems:
        Object.values(
          soldItemsMap
        ),
    };

  }, [filteredTransactions]);

  // ===================================================
  // HANDLE PERIOD
  // ===================================================
  const handlePeriodChange = (
    period
  ) => {

    setActivePeriod(period);

    setStartDate("");
    setEndDate("");
  };

  // ===================================================
  // HANDLE DATE RANGE
  // ===================================================
  const handleDateRangeChange = (
    start,
    end
  ) => {

    setStartDate(start);
    setEndDate(end);

    if (start || end) {
      setActivePeriod("");
    }
  };

  // ===================================================
  // FILTER AKTIF
  // ===================================================
  const hasDateFilter =
    startDate || endDate;

  // ===================================================
  // RENDER
  // ===================================================
  return (
    <div className="min-h-screen bg-[#f5f3ee] pb-[100px]">

      {/* ================= HEADER ================= */}
      <Navbar />


      {/* ================= MAIN ================= */}
      <main className="mx-auto max-w-[1000px] px-5 py-6 md:px-8">

        {/* ================= TITLE ================= */}
        <div className="mb-5">

          <div className="flex items-center gap-2">
            <h1 className="text-[24px] font-extrabold">
              Laporan
            </h1>

          </div>

          <p className="mt-[-2px] text-[13px] text-[#99958e]">
            Ringkasan penjualan
          </p>

        </div>


        {/* ================= FILTER ================= */}
        <div className="mb-5 space-y-4">

          {/* ================= PERIOD FILTER ================= */}
          <div className="flex items-center gap-2">

            <SlidersHorizontal
              size={18}
              strokeWidth={1.6}
              className="shrink-0 text-[#9B9A96]"
            />

            <div className="flex flex-wrap gap-2">

              {periods.map(
                (period) => {

                  const active =
                    activePeriod ===
                      period.value &&
                    !hasDateFilter;

                  return (
                    <button
                      key={
                        period.value
                      }
                      type="button"
                      onClick={() =>
                        handlePeriodChange(
                          period.value
                        )
                      }
                      className={`
                        rounded-full
                        px-5
                        py-2
                        text-sm
                        font-semibold
                        transition-all
                        duration-200
                        ${
                          active
                            ? "bg-[#272624] text-white shadow-sm"
                            : "bg-[#E6E3DE] text-[#2A2927] hover:bg-[#DCD9D3]"
                        }
                      `}
                    >
                      {
                        period.label
                      }
                    </button>
                  );
                }
              )}

            </div>

          </div>


          {/* ================= DATE RANGE ================= */}
          <DatePicker
            mode="range"
            startDate={startDate}
            endDate={endDate}
            onChange={
              handleDateRangeChange
            }
          />

        </div>


        {/* ================= ACTIVE DATE INFO ================= */}
        {hasDateFilter && (
          <div className="mb-5">

            <div
              className="
                rounded-xl
                bg-[#E9E5DC]
                px-4
                py-3
                text-sm
                text-[#5E5A54]
              "
            >

              {startDate &&
              endDate ? (
                <>
                  Menampilkan laporan
                  dari{" "}
                  <strong className="text-[#272624]">
                    {formatDate(
                      startDate
                    )}
                  </strong>{" "}
                  sampai{" "}
                  <strong className="text-[#272624]">
                    {formatDate(
                      endDate
                    )}
                  </strong>
                </>
              ) : (
                <>
                  Menampilkan laporan
                  tanggal{" "}
                  <strong className="text-[#272624]">
                    {formatDate(
                      startDate
                    )}
                  </strong>
                </>
              )}

            </div>

          </div>
        )}


        {/* ================= SUMMARY ================= */}
        <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-2">

          <SummaryCard
            title="Total Transaksi"
            value={
              report.totalTransactions
            }
            subtitle={
              hasDateFilter
                ? "Tanggal Dipilih"
                : activePeriod
            }
            icon={UsersRound}
            variant="dark"
          />


          <SummaryCard
            title="Total Penjualan"
            value={`Rp ${report.totalSales.toLocaleString(
              "id-ID"
            )}`}
            subtitle={
              hasDateFilter
                ? "Tanggal Dipilih"
                : activePeriod
            }
            icon={TrendingUp}
            variant="red"
          />


          <SummaryCard
            title="Cash"
            value={`Rp ${report.cash.toLocaleString(
              "id-ID"
            )}`}
            subtitle={
              hasDateFilter
                ? "Tanggal Dipilih"
                : activePeriod
            }
            icon={WalletCards}
            variant="orange"
          />


          <SummaryCard
            title="QRIS"
            value={`Rp ${report.qris.toLocaleString(
              "id-ID"
            )}`}
            subtitle={
              hasDateFilter
                ? "Tanggal Dipilih"
                : activePeriod
            }
            icon={QrCode}
            variant="light"
          />

        </div>


        {/* ================= PAYMENT METHOD ================= */}
        <div className="mb-5">

          <PaymentMethod
            cash={report.cash}
            qris={report.qris}
          />

        </div>


        {/* ================= SOLD ITEMS ================= */}
        <SoldItems
          items={
            report.soldItems
          }
        />

      </main>


      {/* ================= BOTTOM NAV ================= */}
      <BottomNavigation />

    </div>
  );
}