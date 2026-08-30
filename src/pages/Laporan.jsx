
import { useEffect, useMemo, useState } from "react";

import {
  UsersRound,
  TrendingUp,
  SlidersHorizontal,
} from "lucide-react";

import Navbar from "../components/layout/Navbar";
import BottomNavigation from "../components/layout/BottomNavigation";

import SummaryCard from "../components/laporan/SummaryCard";
import PaymentMethod from "../components/laporan/PaymentMethod";
import SoldItems from "../components/common/SoldItems";
import DatePicker from "../components/common/DatePicker";

import api from "../api/axios";

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
// GET LOCAL TODAY
// =====================================================

const getToday = () => {
  const now = new Date();

  const year = now.getFullYear();

  const month = String(
    now.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    now.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

// =====================================================
// GET START DATE
// =====================================================

const getStartDate = (period) => {
  const today = new Date();

  if (period === "Hari Ini") {
    return getToday();
  }

  if (period === "7 Hari") {
    const date = new Date(today);

    date.setDate(
      date.getDate() - 6
    );

    const year =
      date.getFullYear();

    const month = String(
      date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  if (period === "30 Hari") {
    const date = new Date(today);

    date.setDate(
      date.getDate() - 29
    );

    const year =
      date.getFullYear();

    const month = String(
      date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  return null;
};

// =====================================================
// FORMAT DATE
// =====================================================

const formatDate = (date) => {
  if (!date) {
    return "";
  }

  return new Date(
    `${date}T00:00:00`
  ).toLocaleDateString(
    "id-ID",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );
};

// =====================================================
// LAPORAN PAGE
// =====================================================

export default function Laporan() {
  // ===================================================
  // FILTER
  // ===================================================

  const [
    activePeriod,
    setActivePeriod,
  ] = useState("Hari Ini");

  const [
    startDate,
    setStartDate,
  ] = useState("");

  const [
    endDate,
    setEndDate,
  ] = useState("");

  // ===================================================
  // REPORT DATA
  // ===================================================

  const [
    reportData,
    setReportData,
  ] = useState({
    total_orders: 0,
    total_revenue: 0,
    today_orders: 0,
    today_revenue: 0,
    today_payment_methods: [],
    today_sold_items: [],
  });

  // ===================================================
  // STATE
  // ===================================================

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  // ===================================================
  // REQUEST PARAMS
  // ===================================================

  const requestParams = useMemo(() => {
    // -------------------------------------------------
    // CUSTOM RANGE
    // -------------------------------------------------

    if (startDate || endDate) {
      return {
        ...(startDate
          ? {
              start_date:
                startDate,
            }
          : {}),

        ...(endDate
          ? {
              end_date:
                endDate,
            }
          : {}),
      };
    }

    // -------------------------------------------------
    // SEMUA
    // -------------------------------------------------

    if (activePeriod === "Semua") {
      return {
        period: "all",
      };
    }

    // -------------------------------------------------
    // HARI INI / 7 HARI / 30 HARI
    // -------------------------------------------------

    const periodStart =
      getStartDate(
        activePeriod
      );

    return {
      start_date:
        periodStart,

      end_date:
        getToday(),
    };
  }, [
    activePeriod,
    startDate,
    endDate,
  ]);

  // ===================================================
  // FETCH REPORT
  // ===================================================

  const fetchReport = async () => {
    try {
      setLoading(true);
      setError("");

      console.log(
        "📊 FETCHING REPORT:",
        requestParams
      );

      const response =
        await api.get(
          "admin/dashboard",
          {
            params:
              requestParams,
          }
        );

      console.log(
        "📊 REPORT API:",
        response.data
      );

      const data =
        response.data?.data ||
        {};

      setReportData({
        total_orders:
          Number(
            data.total_orders ||
              0
          ),

        total_revenue:
          Number(
            data.total_revenue ||
              0
          ),

        today_orders:
          Number(
            data.today_orders ||
              0
          ),

        today_revenue:
          Number(
            data.today_revenue ||
              0
          ),

        today_payment_methods:
          Array.isArray(
            data.today_payment_methods
          )
            ? data.today_payment_methods
            : [],

        today_sold_items:
          Array.isArray(
            data.today_sold_items
          )
            ? data.today_sold_items
            : [],
      });

    } catch (err) {
      console.error(
        "❌ Gagal mengambil laporan:",
        err
      );

      console.error(
        "❌ Response error:",
        err.response?.data
      );

      setError(
        err.response?.data?.message ||
          "Gagal mengambil data laporan."
      );
    } finally {
      setLoading(false);
    }
  };

  // ===================================================
  // FETCH WHEN PARAMETER CHANGE
  // ===================================================

  useEffect(() => {
    fetchReport();
  }, [requestParams]);

  // ===================================================
  // PAYMENT METHODS
  // ===================================================

  const paymentMethods =
    useMemo(() => {
      if (
        !Array.isArray(
          reportData.today_payment_methods
        )
      ) {
        return [];
      }

      return reportData
        .today_payment_methods
        .map((item) => ({
          ...item,

          total_amount:
            Number(
              item.total_amount ||
                0
            ),

          order_count:
            Number(
              item.order_count ||
                0
            ),
        }))
        .filter(
          (item) =>
            item.total_amount >
            0
        );
    }, [
      reportData.today_payment_methods,
    ]);

  // ===================================================
  // SUBTITLE
  // ===================================================

  const hasDateFilter =
    Boolean(
      startDate ||
      endDate
    );

  const subtitle =
    hasDateFilter
      ? "TANGGAL DIPILIH"
      : activePeriod ||
        "SEMUA";

  // ===================================================
  // HANDLE PERIOD
  // ===================================================

  const handlePeriodChange =
    (period) => {
      setActivePeriod(
        period
      );

      setStartDate("");
      setEndDate("");
    };

  // ===================================================
  // HANDLE DATE RANGE
  // ===================================================

  const handleDateRangeChange =
    (
      start,
      end
    ) => {
      setStartDate(
        start || ""
      );

      setEndDate(
        end || ""
      );

      if (start || end) {
        setActivePeriod("");
      }
    };

  // ===================================================
  // LOADING
  // ===================================================

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
          <div className="mb-5">
            <h1 className="text-[24px] font-extrabold">
              Laporan
            </h1>

            <p
              className="
                mt-[-2px]
                text-[13px]
                text-[#99958e]
              "
            >
              Memuat laporan...
            </p>
          </div>
        </main>

        <BottomNavigation />
      </div>
    );
  }

  // ===================================================
  // ERROR
  // ===================================================

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
              Gagal memuat laporan
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
              onClick={fetchReport}
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

  // ===================================================
  // PAGE
  // ===================================================

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
        {/* =================================================
            TITLE
        ================================================= */}

        <div className="mb-5">
          <h1 className="text-[24px] font-extrabold">
            Laporan
          </h1>

          <p
            className="
              mt-[-2px]
              text-[13px]
              text-[#99958e]
            "
          >
            Ringkasan penjualan
          </p>
        </div>

        {/* =================================================
            FILTER
        ================================================= */}

        <div className="mb-5 space-y-4">
          <div
            className="
              flex
              items-center
              gap-2
            "
          >
            <SlidersHorizontal
              size={18}
              strokeWidth={1.6}
              className="
                shrink-0
                text-[#9B9A96]
              "
            />

            <div
              className="
                flex
                flex-wrap
                gap-2
              "
            >
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

          <DatePicker
            mode="range"
            startDate={
              startDate
            }
            endDate={
              endDate
            }
            onChange={
              handleDateRangeChange
            }
          />
        </div>

        {/* =================================================
            DATE INFO
        ================================================= */}

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

        {/* =================================================
            SUMMARY
        ================================================= */}

        <div
          className="
            mb-5
            grid
            grid-cols-1
            gap-3
            md:grid-cols-2
          "
        >
          {/* TOTAL TRANSAKSI */}

          <SummaryCard
            title="Total Transaksi"
            value={
              reportData.total_orders
            }
            subtitle={
              subtitle
            }
            icon={
              UsersRound
            }
            variant="dark"
          />

          {/* TOTAL PENJUALAN */}

          <SummaryCard
            title="Total Penjualan"
            value={`Rp ${reportData.total_revenue.toLocaleString(
              "id-ID"
            )}`}
            subtitle={
              subtitle
            }
            icon={
              TrendingUp
            }
            variant="red"
          />

          {/* PAYMENT METHODS */}

          {paymentMethods.map(
            (payment, index) => {
              const isCash =
                payment.payment_method ===
                "cash";

              const isQris =
                payment.payment_method ===
                "qris";

              const title =
                isCash
                  ? "Cash"
                  : isQris
                    ? "QRIS"
                    : String(
                        payment.payment_method ||
                          "Other"
                      )
                        .replace(
                          /_/g,
                          " "
                        )
                        .toUpperCase();

              return (
                <SummaryCard
                  key={`${payment.payment_method}-${index}`}
                  title={
                    title
                  }
                  value={`Rp ${Number(
                    payment.total_amount ||
                      0
                  ).toLocaleString(
                    "id-ID"
                  )}`}
                  subtitle={
                    subtitle
                  }
                  icon={
                    undefined
                  }
                  variant={
                    isCash
                      ? "orange"
                      : isQris
                        ? "light"
                        : "dark"
                  }
                />
              );
            }
          )}
        </div>

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

        <SoldItems
          items={
            reportData.today_sold_items
          }
        />
      </main>

      <BottomNavigation />
    </div>
  );
}

