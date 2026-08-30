
import { useEffect, useMemo, useState } from "react";

import Navbar from "../components/layout/Navbar";
import BottomNavigation from "../components/layout/BottomNavigation";

import OrderCard from "../components/orders/OrderCard";
import OrderFilters from "../components/orders/OrderFilters";

import api from "../api/axios";

export default function OrderPage() {
  // =========================================================
  // ORDERS
  // =========================================================

  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  const [loadingMore, setLoadingMore] =
    useState(false);

  const [error, setError] = useState("");

  // =========================================================
  // PAGINATION
  // =========================================================

  const [currentPage, setCurrentPage] =
    useState(1);

  const [lastPage, setLastPage] =
    useState(1);

  // =========================================================
  // FILTER
  // =========================================================

  const [activeFilter, setActiveFilter] =
    useState("Semua");

  const [startDate, setStartDate] =
    useState("");

  const [endDate, setEndDate] =
    useState("");

  // =========================================================
  // OPEN ORDER
  // =========================================================

  const [openOrder, setOpenOrder] =
    useState(null);

  // =========================================================
  // BUILD API PARAMS
  // =========================================================

  const buildParams = () => {
    const params = {};

    // -------------------------------------------------------
    // STATUS
    // -------------------------------------------------------

    if (
      activeFilter === "Done"
    ) {
      params.status = "done";
    }

    // -------------------------------------------------------
    // ORDER TYPE
    // -------------------------------------------------------

    else if (
      activeFilter === "Dine-In"
    ) {
      params.order_type = "dine-in";
    }

    else if (
      activeFilter === "Take Away"
    ) {
      params.order_type = "takeaway";
    }

    // -------------------------------------------------------
    // DATE
    // -------------------------------------------------------

    if (startDate) {
      params.start_date =
        startDate;
    }

    if (endDate) {
      params.end_date =
        endDate;
    }

    return params;
  };

  // =========================================================
  // MAP API ORDER
  // =========================================================

  const mapOrder = (order) => ({
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

    // Status backend
    status:
      order.status,
  });

  // =========================================================
  // FETCH ORDERS
  // =========================================================
  //
  // page = 1  → replace list
  // page > 1  → append list
  //
  // =========================================================

  const fetchOrders = async (
    page = 1,
    append = false
  ) => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      setError("");

      const params = {
        ...buildParams(),
        page,
      };

      console.log(
        "ORDER FETCH PARAMS:",
        params
      );

      const response =
        await api.get(
          "admin/orders",
          {
            params,
          }
        );

      console.log(
        "Response orders:",
        response.data
      );

      // =====================================================
      // PAGINATED DATA
      // =====================================================

      const pagination =
        response.data?.data || {};

      const apiOrders =
        Array.isArray(
          pagination?.data
        )
          ? pagination.data
          : [];

      // =====================================================
      // MAP DATA
      // =====================================================

      const mappedOrders =
        apiOrders.map(
          mapOrder
        );

      console.log(
        `Mapped orders page ${page}:`,
        mappedOrders
      );

      // =====================================================
      // SET ORDERS
      // =====================================================

      setOrders(
        (current) => {
          if (!append) {
            return mappedOrders;
          }

          // Hindari duplicate order
          const existingIds =
            new Set(
              current.map(
                (order) =>
                  Number(order.id)
              )
            );

          const newOrders =
            mappedOrders.filter(
              (order) =>
                !existingIds.has(
                  Number(order.id)
                )
            );

          return [
            ...current,
            ...newOrders,
          ];
        }
      );

      // =====================================================
      // PAGINATION META
      // =====================================================

      const current =
        Number(
          pagination?.current_page ??
          page
        );

      const last =
        Number(
          pagination?.last_page ??
          page
        );

      setCurrentPage(
        current
      );

      setLastPage(
        last
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
      if (append) {
        setLoadingMore(
          false
        );
      } else {
        setLoading(false);
      }
    }
  };

  // =========================================================
  // INITIAL / FILTER FETCH
  // =========================================================
  //
  // Setiap filter berubah:
  // kembali ke page 1.
  //
  // =========================================================

  useEffect(() => {
    setCurrentPage(1);
    setLastPage(1);
    setOpenOrder(null);

    fetchOrders(
      1,
      false
    );
  }, [
    activeFilter,
    startDate,
    endDate,
  ]);

  // =========================================================
  // LOAD MORE
  // =========================================================

  const handleLoadMore =
    async () => {
      if (loadingMore) {
        return;
      }

      if (
        currentPage >=
        lastPage
      ) {
        return;
      }

      const nextPage =
        currentPage + 1;

      await fetchOrders(
        nextPage,
        true
      );
    };

  // =========================================================
  // DATE RANGE
  // =========================================================

  const setDateRange = (
    start,
    end
  ) => {
    setStartDate(
      start
    );

    setEndDate(
      end
    );
  };

  // =========================================================
  // FRONTEND FILTER
  // =========================================================
  //
  // Backend sudah melakukan filter utama.
  // FE tetap filter ulang sebagai pengaman.
  //
  // =========================================================

  const filteredOrders =
    useMemo(() => {
      let result = [
        ...orders,
      ];

      // -----------------------------------------------------
      // DONE
      // -----------------------------------------------------

      if (
        activeFilter ===
        "Done"
      ) {
        result =
          result.filter(
            (order) =>
              order.status ===
              "done"
          );
      }

      // -----------------------------------------------------
      // DINE-IN
      // -----------------------------------------------------

      else if (
        activeFilter ===
        "Dine-In"
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

      // -----------------------------------------------------
      // TAKE AWAY
      // -----------------------------------------------------

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

      // -----------------------------------------------------
      // SEMUA
      // -----------------------------------------------------

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

      // -----------------------------------------------------
      // DATE RANGE
      // -----------------------------------------------------

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

  // =========================================================
  // TOGGLE ORDER
  // =========================================================

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

  // =========================================================
  // DONE ORDER
  // =========================================================

  const handleDoneOrder =
    async (id) => {
      try {
        console.log(
          "MARK ORDER AS DONE:",
          id
        );

        // ===================================================
        // UPDATE BACKEND
        // ===================================================

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

        // ===================================================
        // UPDATE STATE LOKAL
        // ===================================================

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

        // ===================================================
        // CLOSE DETAIL
        // ===================================================

        setOpenOrder(null);

        // ===================================================
        // MASUK TAB DONE
        // ===================================================

        setActiveFilter(
          "Done"
        );

        // ===================================================
        // RESET DATE
        // ===================================================

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

  // =========================================================
  // HAS MORE
  // =========================================================

  const hasMore =
    currentPage <
    lastPage;

  // =========================================================
  // LOADING
  // =========================================================

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

  // =========================================================
  // ERROR
  // =========================================================

  if (error) {
    return (
      <div className="min-h-screen bg-[#F6F3ED]">

        <Navbar />

        <main className="px-5 pb-28 pt-7 md:px-8 lg:px-10">

          <div className="mx-auto max-w-[1100px]">

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

              <p className="text-sm font-semibold text-red-500">
                Gagal mengambil pesanan
              </p>

              <p className="mt-1 text-xs text-[#AAA69F]">
                {error}
              </p>

              <button
                type="button"
                onClick={() =>
                  fetchOrders(
                    1,
                    false
                  )
                }
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

          </div>

        </main>

        <BottomNavigation />

      </div>
    );
  }

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <div className="min-h-screen bg-[#F6F3ED]">

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <Navbar />

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <main className="px-5 pb-28 pt-7 md:px-8 lg:px-10">

        <div className="mx-auto max-w-[1100px]">

          {/* =================================================
              TITLE
          ================================================= */}

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
              {filteredOrders.length} pesanan ditampilkan
            </p>

          </div>

          {/* =================================================
              FILTER
          ================================================= */}

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

          {/* =================================================
              LIST
          ================================================= */}

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
                  border
                  border-[#E7E1D5]
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

          {/* =================================================
              LOAD MORE
          ================================================= */}

          {hasMore && (
            <div
              className="
                mt-6
                flex
                justify-center
              "
            >

              <button
                type="button"
                onClick={
                  handleLoadMore
                }
                disabled={
                  loadingMore
                }
                className="
                  rounded-xl
                  bg-[#292825]
                  px-6
                  py-3
                  text-[12px]
                  font-bold
                  text-white
                  transition
                  hover:bg-[#1f1e1c]
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >

                {loadingMore
                  ? "Memuat..."
                  : "Muat Lebih Banyak"}

              </button>

            </div>
          )}

          {/* =================================================
              PAGINATION INFO
          ================================================= */}

          {orders.length > 0 && (
            <div
              className="
                mt-3
                text-center
                text-[10px]
                text-[#AAA69F]
              "
            >
              Halaman{" "}
              {currentPage}{" "}
              dari{" "}
              {lastPage}
            </div>
          )}

        </div>

      </main>

      {/* =====================================================
          BOTTOM NAVIGATION
      ===================================================== */}

      <BottomNavigation />

    </div>
  );
}
