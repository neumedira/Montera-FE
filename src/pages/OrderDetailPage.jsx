
import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  Banknote,
  QrCode,
  ArrowRight,
  Store,
  ShoppingBag,
  CreditCard,
  Building2,
  WalletCards,
} from "lucide-react";

import {
  useCart,
} from "../context/CartContext";

import axios from "axios";

// =========================================================
// BACKEND URL
// =========================================================

const BACKEND_URL =
  "http://10.174.91.209:8000";

// =========================================================
// NORMALIZE PAYMENT METHOD
// =========================================================

const normalizePaymentMethod = (
  method
) => {
  const value =
    String(method || "")
      .trim()
      .toLowerCase();

  if (
    value === "tunai" ||
    value === "cash"
  ) {
    return "cash";
  }

  if (value === "qris") {
    return "qris";
  }

  return value;
};

// =========================================================
// DEFAULT PAYMENT
// =========================================================

const DEFAULT_PAYMENT_SETTINGS = [
  {
    id: "default-cash",
    method: "tunai",
    is_active: 1,
    provider_note: null,
    qr_image_url: null,
  },
  {
    id: "default-qris",
    method: "qris",
    is_active: 1,
    provider_note: null,
    qr_image_url: null,
  },
];

// =========================================================
// COMPONENT
// =========================================================

export default function OrderDetailPage() {
  const navigate =
    useNavigate();

  const location =
    useLocation();

  const {
    cart,
    totalPrice,
  } = useCart();

  // =========================================================
  // FORM
  // =========================================================

  const [
    customerName,
    setCustomerName,
  ] = useState("");

  const [
    orderType,
    setOrderType,
  ] = useState("");

  const [
    paymentMethod,
    setPaymentMethod,
  ] = useState("");

  const [
    isLoading,
    setIsLoading,
  ] = useState(false);

  // =========================================================
  // PAYMENT SETTINGS
  // =========================================================

  const [
    paymentSettings,
    setPaymentSettings,
  ] = useState(
    DEFAULT_PAYMENT_SETTINGS
  );

  const [
    paymentLoading,
    setPaymentLoading,
  ] = useState(true);

  // =========================================================
  // GLOBAL ORDER NOTE
  // =========================================================

  const orderNote =
    location.state?.orderNote || "";

  // =========================================================
  // CUSTOMER TABLE DARI QR
  // =========================================================

  const [
    customerTable,
    setCustomerTable,
  ] = useState(null);

  useEffect(() => {
    try {
      const storedTable =
        sessionStorage.getItem(
          "customer_table"
        );

      if (!storedTable) {
        console.log(
          "ℹ️ CUSTOMER TABLE: tidak ada data meja."
        );

        setCustomerTable(null);
        return;
      }

      const parsedTable =
        JSON.parse(storedTable);

      if (
        parsedTable &&
        parsedTable.table_id
      ) {
        setCustomerTable(
          parsedTable
        );

        console.log(
          "✅ CUSTOMER TABLE DARI QR:",
          parsedTable
        );
      } else {
        setCustomerTable(null);

        console.warn(
          "⚠️ Data customer_table tidak lengkap:",
          parsedTable
        );
      }
    } catch (error) {
      console.error(
        "❌ Gagal membaca customer_table:",
        error
      );

      setCustomerTable(null);
    }
  }, []);

  // =========================================================
  // TABLE ID
  // =========================================================

  const tableId =
    customerTable?.table_id ?? null;

  // =========================================================
  // TABLE NUMBER
  // =========================================================

  const tableNumber =
    customerTable?.table_number ?? null;

  // =========================================================
  // FETCH CUSTOMER PAYMENT SETTINGS
  // =========================================================

  useEffect(() => {
    let mounted = true;

    const fetchPaymentSettings =
      async () => {
        try {
          setPaymentLoading(true);

          const response =
            await axios.get(
              `${BACKEND_URL}/api/v1/customer/settings`
            );

          console.log(
            "CUSTOMER SETTINGS API:",
            response.data
          );

          const settings =
            response.data?.data;

          const rawPayments =
            settings?.payment_settings;

          if (
            mounted &&
            Array.isArray(
              rawPayments
            )
          ) {
            const activePayments =
              rawPayments.filter(
                (payment) =>
                  payment.is_active === true ||
                  payment.is_active === 1 ||
                  payment.is_active === "1"
              );

            setPaymentSettings(
              activePayments
            );

            console.log(
              "ACTIVE PAYMENT SETTINGS:",
              activePayments
            );
          }
        } catch (error) {
          console.error(
            "Gagal mengambil customer payment settings:",
            error
          );

          if (mounted) {
            setPaymentSettings(
              DEFAULT_PAYMENT_SETTINGS
            );
          }
        } finally {
          if (mounted) {
            setPaymentLoading(false);
          }
        }
      };

    fetchPaymentSettings();

    return () => {
      mounted = false;
    };
  }, []);

  // =========================================================
  // AVAILABLE PAYMENTS
  // =========================================================

  const availablePayments =
    useMemo(() => {
      return paymentSettings.map(
        (payment) => ({
          ...payment,

          normalizedMethod:
            normalizePaymentMethod(
              payment.method
            ),
        })
      );
    }, [paymentSettings]);

  // =========================================================
  // AUTO SELECT PAYMENT
  // =========================================================

  useEffect(() => {
    if (
      paymentLoading ||
      availablePayments.length === 0
    ) {
      return;
    }

    const currentStillAvailable =
      availablePayments.some(
        (payment) =>
          payment.normalizedMethod ===
          paymentMethod
      );

    if (!currentStillAvailable) {
      setPaymentMethod(
        availablePayments[0]
          .normalizedMethod
      );
    }
  }, [
    availablePayments,
    paymentLoading,
    paymentMethod,
  ]);

  // =========================================================
  // VALIDASI FORM
  // =========================================================

  const isFormValid =
    customerName.trim() !== "" &&
    orderType !== "" &&
    paymentMethod !== "" &&
    cart.length > 0;

  // =========================================================
  // FORMAT PRICE
  // =========================================================

  const formatPrice = (
    price
  ) => {
    return `Rp ${Number(
      price ?? 0
    ).toLocaleString("id-ID")}`;
  };

  // =========================================================
  // GET PAYMENT NOTE
  // =========================================================

  const getPaymentNote = (
    payment
  ) => {
    if (!payment) {
      return "";
    }

    return (
      payment.provider_note ||
      ""
    ).trim();
  };

  // =========================================================
  // PAYMENT ICON
  // =========================================================

  const getPaymentIcon = (
    method
  ) => {
    const value =
      String(
        method || ""
      )
        .trim()
        .toLowerCase();

    if (
      value === "cash" ||
      value === "tunai"
    ) {
      return (
        <Banknote size={18} />
      );
    }

    if (
      value === "qris" ||
      value.startsWith("qris_")
    ) {
      return (
        <QrCode size={18} />
      );
    }

    if (
      value === "tf_bank" ||
      value.startsWith("tf_bank_")
    ) {
      return (
        <Building2 size={18} />
      );
    }

    if (
      value === "ewallet" ||
      value.startsWith("ewallet_")
    ) {
      return (
        <WalletCards size={18} />
      );
    }

    if (
      value === "kartu" ||
      value.startsWith("kartu_")
    ) {
      return (
        <CreditCard size={18} />
      );
    }

    return (
      <CreditCard size={18} />
    );
  };

  // =========================================================
  // PAYMENT TITLE
  // =========================================================

  const getPaymentTitle = (
    payment
  ) => {
    const method =
      String(
        payment?.method || ""
      )
        .trim()
        .toLowerCase();

    if (
      method === "cash" ||
      method === "tunai"
    ) {
      return "CASH";
    }

    if (
      method === "qris" ||
      method.startsWith("qris_")
    ) {
      return "QRIS";
    }

    if (
      method === "tf_bank" ||
      method.startsWith("tf_bank_")
    ) {
      return "TRANSFER BANK";
    }

    if (
      method === "ewallet" ||
      method.startsWith("ewallet_")
    ) {
      return "E-WALLET";
    }

    if (
      method === "kartu" ||
      method.startsWith("kartu_")
    ) {
      return "KARTU";
    }

    return String(
      payment?.method ||
        "PAYMENT"
    ).toUpperCase();
  };

  // =========================================================
  // PAYMENT DESCRIPTION
  // =========================================================

  const getPaymentDescription = (
    payment
  ) => {
    const method =
      String(
        payment?.method || ""
      )
        .trim()
        .toLowerCase();

    const provider =
      String(
        payment?.provider_note ||
          ""
      ).trim();

    if (
      method === "cash" ||
      method === "tunai"
    ) {
      return "Please prepare the exact amount or hand the cash to our cashier.";
    }

    if (
      method === "qris" ||
      method.startsWith("qris_")
    ) {
      return "Scan the QR code with your e-wallet or mobile banking app.";
    }

    if (
      method === "tf_bank" ||
      method.startsWith("tf_bank_")
    ) {
      return provider
        ? `Transfer to ${provider}.`
        : "Please transfer the payment according to the provided details.";
    }

    if (
      method === "ewallet" ||
      method.startsWith("ewallet_")
    ) {
      return provider
        ? `Pay using ${provider}.`
        : "Complete payment using your e-wallet.";
    }

    if (
      method === "kartu" ||
      method.startsWith("kartu_")
    ) {
      return "Complete the payment using your card.";
    }

    return "Please complete your payment using this method.";
  };

  // =========================================================
  // SUBMIT ORDER
  // =========================================================

  const handleProceed =
    async () => {

      if (!isFormValid) {
        return;
      }

      setIsLoading(true);

      try {
        // ===================================================
        // FORMAT ITEM CART → BACKEND
        // ===================================================

        const formattedItems =
          cart.flatMap(
            (item) => {

              // =============================================
              // PRODUCT BIASA
              // =============================================

              if (
                item.type !== "bundle"
              ) {
                const addonIds =
                  Array.isArray(
                    item.addons
                  )
                    ? item.addons
                        .map(
                          (addon) =>
                            addon?.id
                        )
                        .filter(
                          (id) =>
                            id !== null &&
                            id !== undefined
                        )
                    : [];

                return [
                  {
                    menu_item_id:
                      item.id,

                    // Menu biasa tidak berasal dari bundle
                    bundle_id:
                      null,

                    quantity:
                      Number(
                        item.quantity ?? 1
                      ),

                    addon_ids:
                      addonIds,

                    notes:
                      item.notes?.trim() ||
                      null,
                  },
                ];
              }

              // =============================================
              // BUNDLE
              // =============================================

              if (
                item.type ===
                  "bundle" &&
                Array.isArray(
                  item.items
                )
              ) {
                return item.items
                  .filter(
                    (bundleItem) =>
                      bundleItem?.menu_item?.id
                  )
                  .map(
                    (bundleItem) => {

                      const menu =
                        bundleItem.menu_item;

                      // ===================================
                      // ADDON DARI MENU DALAM BUNDLE
                      // ===================================

                      const selectedAddons =
                        Array.isArray(
                          item.addons
                        )
                          ? item.addons.filter(
                              (addon) =>
                                Number(
                                  addon.menu_item_id
                                ) ===
                                Number(
                                  menu.id
                                )
                            )
                          : [];

                      const addonIds =
                        selectedAddons
                          .map(
                            (addon) =>
                              addon.id
                          )
                          .filter(
                            (id) =>
                              id !== null &&
                              id !== undefined
                          );

                      return {
                        menu_item_id:
                          menu.id,

                        // =================================
                        // INI YANG BARU
                        // =================================
                        //
                        // item.bundleId berasal dari:
                        //
                        // formatBundleItem()
                        //
                        // bundleId: item.id
                        //
                        // Jadi backend bisa tahu
                        // item ini bagian dari bundle mana.
                        //
                        bundle_id:
                          item.bundleId ??
                          null,

                        quantity:
                          Number(
                            bundleItem.quantity ??
                              1
                          ) *
                          Number(
                            item.quantity ??
                              1
                          ),

                        addon_ids:
                          addonIds,

                        notes:
                          item.notes?.trim() ||
                          null,
                      };
                    }
                  );
              }

              return [];
            }
          );

        // ===================================================
        // VALIDASI ITEM
        // ===================================================

        if (
          formattedItems.length ===
          0
        ) {
          alert(
            "Tidak ada item yang dapat diproses."
          );

          setIsLoading(false);

          return;
        }

        // ===================================================
        // TYPE ORDER
        // ===================================================

        const mappedOrderType =
          orderType ===
          "take-away"
            ? "takeaway"
            : "dine-in";

        // ===================================================
        // PAYMENT METHOD
        // ===================================================

        const backendPaymentMethod =
          paymentMethod ===
          "cash"
            ? "tunai"
            : paymentMethod;

        // ===================================================
        // PAYLOAD
        // ===================================================

        const payload = {
          // =================================================
          // TABLE DARI QR
          // =================================================

          table_id:
            tableId,

          customer_name:
            customerName.trim(),

          order_type:
            mappedOrderType,

          payment_method:
            backendPaymentMethod,

          // =================================================
          // ITEMS
          // =================================================

          items:
            formattedItems,

          // =================================================
          // GLOBAL NOTES
          // =================================================

          notes:
            orderNote.trim() ||
            null,
        };

        // ===================================================
        // DEBUG
        // ===================================================

        console.log(
          "CUSTOMER TABLE ID:",
          tableId
        );

        console.log(
          "CUSTOMER TABLE NUMBER:",
          tableNumber
        );

        console.log(
          "ORDER ITEMS:",
          formattedItems
        );

        console.log(
          "ORDER PAYLOAD:",
          payload
        );

        // ===================================================
        // POST API
        // ===================================================

        const response =
          await axios.post(
            `${BACKEND_URL}/api/v1/customer/orders`,
            payload
          );

        console.log(
          "ORDER RESPONSE:",
          response.data
        );

        // ===================================================
        // SUCCESS
        // ===================================================

        if (
          response.status === 200 ||
          response.status === 201
        ) {

          const createdOrder =
            response.data?.data;

          console.log(
            "CREATED ORDER:",
            createdOrder
          );

          navigate(
            "/payment",
            {
              state: {
                orderData:
                  createdOrder,
              },
            }
          );
        }

      } catch (error) {

        console.error(
          "Gagal membuat pesanan:",
          error
        );

        console.error(
          "Response error:",
          error.response?.data
        );

        // ===================================================
        // VALIDATION ERROR
        // ===================================================

        if (
          error.response?.status ===
          422
        ) {

          alert(
            "Validasi Gagal:\n" +
              JSON.stringify(
                error.response
                  .data?.errors ||
                  error.response
                    .data?.message,
                null,
                2
              )
          );

        } else {

          alert(
            "Terjadi kesalahan sistem saat memproses pesanan. Pastikan server backend menyala."
          );
        }

      } finally {

        setIsLoading(false);
      }
    };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div
      className="
        min-h-screen
        bg-[#FAF7F2]
        dark:bg-[#121212]
        max-w-md
        mx-auto
        flex
        flex-col
        justify-between
        transition-colors
        duration-300
      "
    >

      {/* =====================================================
          TOP
      ===================================================== */}

      <div className="p-4">

        <h1
          className="
            mb-4
            font-display
            text-4xl
            uppercase
            tracking-wide
            text-gray-900
            dark:text-white
          "
        >
          ORDER DETAILS
        </h1>

        {/* CUSTOMER NAME */}

        <div
          className="
            mb-6
            rounded-2xl
            border
            border-gray-100
            bg-white
            p-5
            shadow-sm
            dark:border-[#333333]
            dark:bg-[#1e1e1e]
          "
        >

          <label
            className="
              mb-2
              block
              text-xs
              font-bold
              text-gray-800
              dark:text-gray-200
            "
          >
            Customer Name
          </label>

          <input
            type="text"
            value={customerName}
            onChange={(e) =>
              setCustomerName(
                e.target.value
              )
            }
            placeholder="Enter your name"
            disabled={isLoading}
            className="
              w-full
              rounded-xl
              border
              border-gray-200
              bg-gray-50
              px-4
              py-3
              text-sm
              font-medium
              text-gray-900
              outline-none
              focus:border-zinc-800
              dark:border-[#444444]
              dark:bg-[#2d2d2d]
              dark:text-white
              dark:placeholder:text-[#888888]
              dark:focus:border-white
            "
          />

        </div>

      </div>

      {/* =====================================================
          CHECKERBOARD
      ===================================================== */}

      <div
        className="
          h-6
          w-full
          overflow-hidden
          dark:opacity-80
        "
        style={{
          backgroundImage:
            "conic-gradient(#18181b 90deg, #ffffff 90deg 180deg, #18181b 180deg 270deg, #ffffff 270deg)",
          backgroundSize:
            "24px 24px",
        }}
      />

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <div className="flex-1 p-4">

        {/* ===================================================
            ORDER SUMMARY
        =================================================== */}

        <div className="mb-8">

          <div
            className="
              mb-4
              inline-block
              border-b-2
              border-zinc-900
              pb-1
              dark:border-white
            "
          >

            <h2
              className="
                font-display
                text-2xl
                uppercase
                tracking-wide
                text-gray-900
                dark:text-white
              "
            >
              ORDER SUMMARY
            </h2>

          </div>

          {/* CART ITEMS */}

          <div className="space-y-4">

            {cart.length > 0 ? (
              cart.map(
                (item) => {

                  const addons =
                    Array.isArray(
                      item.addons
                    )
                      ? item.addons
                      : [];

                  const basePrice =
                    Number(
                      item.price ?? 0
                    );

                  const itemTotal =
                    basePrice *
                    Number(
                      item.quantity ?? 1
                    );

                  return (
                    <div
                      key={
                        item.cartKey ||
                        item.id
                      }
                      className="
                        rounded-2xl
                        border
                        border-gray-200
                        bg-white
                        p-4
                        dark:border-[#333333]
                        dark:bg-[#1e1e1e]
                      "
                    >

                      {/* ITEM HEADER */}

                      <div
                        className="
                          flex
                          items-start
                          justify-between
                          gap-3
                        "
                      >

                        <div
                          className="
                            flex
                            min-w-0
                            gap-3
                          "
                        >

                          {/* IMAGE */}

                          <div
                            className="
                              h-14
                              w-14
                              shrink-0
                              overflow-hidden
                              rounded-xl
                              bg-gray-50
                              dark:bg-[#2d2d2d]
                            "
                          >

                            {(
                              item.image ||
                              item.img ||
                              item.photo_url
                            ) ? (

                              <img
                                src={
                                  item.image ||
                                  item.img ||
                                  item.photo_url
                                }
                                alt={
                                  item.name
                                }
                                className="
                                  h-full
                                  w-full
                                  object-cover
                                "
                              />

                            ) : (

                              <div
                                className="
                                  flex
                                  h-full
                                  items-center
                                  justify-center
                                  text-[9px]
                                  text-gray-400
                                "
                              >
                                No Image
                              </div>

                            )}

                          </div>

                          {/* NAME + QUANTITY */}

                          <div
                            className="
                              min-w-0
                            "
                          >

                            <div
                              className="
                                text-xs
                                font-black
                                uppercase
                                tracking-wider
                                text-gray-900
                                dark:text-white
                              "
                            >
                              {item.name}
                            </div>

                            <div
                              className="
                                mt-1
                                text-xs
                                font-medium
                                text-gray-400
                              "
                            >
                              {item.quantity}x{" "}
                              {formatPrice(
                                basePrice
                              )}
                            </div>

                          </div>

                        </div>

                        {/* TOTAL ITEM */}

                        <span
                          className="
                            shrink-0
                            text-sm
                            font-bold
                            text-gray-900
                            dark:text-white
                          "
                        >
                          {formatPrice(
                            itemTotal
                          )}
                        </span>

                      </div>

                      {/* ADDONS */}

                      {addons.length > 0 && (
                        <div
                          className="
                            mt-4
                            border-t
                            border-gray-100
                            pt-3
                            dark:border-[#333333]
                          "
                        >

                          <p
                            className="
                              mb-2
                              text-[10px]
                              font-black
                              uppercase
                              tracking-wider
                              text-gray-400
                            "
                          >
                            Add On
                          </p>

                          <div className="space-y-1.5">

                            {addons.map(
                              (
                                addon,
                                index
                              ) => (
                                <div
                                  key={`${item.cartKey || item.id}-addon-${addon.id ?? index}`}
                                  className="
                                    flex
                                    items-center
                                    justify-between
                                    gap-3
                                    text-xs
                                  "
                                >

                                  <span
                                    className="
                                      min-w-0
                                      text-gray-600
                                      dark:text-gray-300
                                    "
                                  >
                                    +{" "}
                                    {addon.name}
                                  </span>

                                  <span
                                    className="
                                      shrink-0
                                      font-semibold
                                      text-gray-800
                                      dark:text-gray-200
                                    "
                                  >
                                    {formatPrice(
                                      addon.price
                                    )}
                                  </span>

                                </div>
                              )
                            )}

                          </div>

                        </div>
                      )}

                      {/* PER ITEM NOTES */}

                      {item.notes?.trim() && (
                        <div
                          className="
                            mt-3
                            rounded-xl
                            bg-gray-50
                            px-3
                            py-2.5
                            dark:bg-[#292929]
                          "
                        >

                          <p
                            className="
                              text-[9px]
                              font-black
                              uppercase
                              tracking-wider
                              text-gray-400
                            "
                          >
                            Catatan
                          </p>

                          <p
                            className="
                              mt-1
                              text-xs
                              leading-relaxed
                              text-gray-700
                              dark:text-gray-300
                            "
                          >
                            {item.notes}
                          </p>

                        </div>
                      )}

                      {/* BUNDLE CONTENT */}

                      {item.type === "bundle" &&
                        Array.isArray(
                          item.items
                        ) &&
                        item.items.length > 0 && (
                          <div
                            className="
                              mt-4
                              border-t
                              border-gray-100
                              pt-3
                              dark:border-[#333333]
                            "
                          >

                            <p
                              className="
                                mb-2
                                text-[10px]
                                font-black
                                uppercase
                                tracking-wider
                                text-gray-400
                              "
                            >
                              Isi Bundle
                            </p>

                            <div className="space-y-2">

                              {item.items.map(
                                (
                                  bundleItem
                                ) => {

                                  const menu =
                                    bundleItem?.menu_item;

                                  if (
                                    !menu
                                  ) {
                                    return null;
                                  }

                                  return (
                                    <div
                                      key={
                                        bundleItem.id
                                      }
                                      className="
                                        flex
                                        items-center
                                        justify-between
                                        gap-3
                                        text-xs
                                      "
                                    >

                                      <span
                                        className="
                                          min-w-0
                                          text-gray-700
                                          dark:text-gray-300
                                        "
                                      >
                                        {menu.name}
                                      </span>

                                      <span
                                        className="
                                          shrink-0
                                          font-bold
                                          text-gray-800
                                          dark:text-gray-200
                                        "
                                      >
                                        {
                                          bundleItem.quantity
                                        }x
                                      </span>

                                    </div>
                                  );
                                }
                              )}

                            </div>

                          </div>
                        )}

                    </div>
                  );
                }
              )
            ) : (
              <p
                className="
                  py-2
                  text-sm
                  text-gray-500
                  dark:text-gray-400
                "
              >
                Tidak ada pesanan.
              </p>
            )}

          </div>

          {/* GLOBAL ORDER NOTE */}

          {orderNote.trim() && (
            <div
              className="
                mt-5
                rounded-xl
                bg-gray-50
                px-3
                py-2.5
                dark:bg-[#292929]
              "
            >

              <p
                className="
                  text-[9px]
                  font-black
                  uppercase
                  tracking-wider
                  text-gray-400
                "
              >
                Catatan Pesanan
              </p>

              <p
                className="
                  mt-1
                  text-xs
                  leading-relaxed
                  text-gray-700
                  dark:text-gray-300
                "
              >
                {orderNote}
              </p>

            </div>
          )}

          {/* TOTAL */}

          <div
            className="
              mt-5
              flex
              items-baseline
              justify-between
              border-t
              border-gray-200
              pt-5
              dark:border-[#333333]
            "
          >

            <span
              className="
                text-sm
                font-bold
                text-gray-800
                dark:text-gray-200
              "
            >
              Grand Total
            </span>

            <span
              className="
                font-display
                text-3xl
                text-gray-900
                dark:text-white
              "
            >
              {formatPrice(
                totalPrice
              )}
            </span>

          </div>

        </div>

        {/* ===================================================
            DINE IN / TAKE AWAY
        =================================================== */}

        <div className="mb-6">

          <h3
            className="
              mb-3
              text-sm
              font-bold
              tracking-wide
              text-gray-900
              dark:text-white
            "
          >
            Dine in Or Take Away
          </h3>

          <div className="space-y-3">

            {/* DINE IN */}

            <div
              onClick={() =>
                !isLoading &&
                setOrderType(
                  "dine-in"
                )
              }
              className={`flex cursor-pointer items-center gap-3 rounded-2xl border-2 bg-white p-4 transition-all dark:bg-[#1e1e1e] ${
                orderType === "dine-in"
                  ? "border-zinc-900 dark:border-white"
                  : "border-gray-200 dark:border-[#333333]"
              } ${
                isLoading
                  ? "cursor-not-allowed opacity-50"
                  : ""
              }`}
            >

              <div
                className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                  orderType === "dine-in"
                    ? "border-zinc-900 dark:border-white"
                    : "border-gray-300 dark:border-[#444444]"
                }`}
              >

                {orderType ===
                  "dine-in" && (
                  <div
                    className="
                      h-2.5
                      w-2.5
                      rounded-full
                      bg-zinc-900
                      dark:bg-white
                    "
                  />
                )}

              </div>

              <div
                className="
                  flex
                  items-center
                  gap-2
                  text-sm
                  font-black
                  tracking-wider
                  text-gray-900
                  dark:text-white
                "
              >

                <Store size={18} />

                <span>
                  DINE IN
                </span>

              </div>

            </div>

            {/* TAKE AWAY */}

            <div
              onClick={() =>
                !isLoading &&
                setOrderType(
                  "take-away"
                )
              }
              className={`flex cursor-pointer items-center gap-3 rounded-2xl border-2 bg-white p-4 transition-all dark:bg-[#1e1e1e] ${
                orderType === "take-away"
                  ? "border-zinc-900 dark:border-white"
                  : "border-gray-200 dark:border-[#333333]"
              } ${
                isLoading
                  ? "cursor-not-allowed opacity-50"
                  : ""
              }`}
            >

              <div
                className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                  orderType === "take-away"
                    ? "border-zinc-900 dark:border-white"
                    : "border-gray-300 dark:border-[#444444]"
                }`}
              >

                {orderType ===
                  "take-away" && (
                  <div
                    className="
                      h-2.5
                      w-2.5
                      rounded-full
                      bg-zinc-900
                      dark:bg-white
                    "
                  />
                )}

              </div>

              <div
                className="
                  flex
                  items-center
                  gap-2
                  text-sm
                  font-black
                  tracking-wider
                  text-gray-900
                  dark:text-white
                "
              >

                <ShoppingBag
                  size={18}
                />

                <span>
                  TAKE AWAY
                </span>

              </div>

            </div>

          </div>

        </div>

        {/* ===================================================
            PAYMENT
        =================================================== */}

        <div className="mb-6">

          <h3
            className="
              mb-3
              text-sm
              font-bold
              tracking-wide
              text-gray-900
              dark:text-white
            "
          >
            Choose Payment Method
          </h3>

          {paymentLoading ? (

            <div
              className="
                rounded-2xl
                border-2
                border-gray-200
                bg-white
                p-4
                text-sm
                font-medium
                text-gray-400
                dark:border-[#333333]
                dark:bg-[#1e1e1e]
              "
            >
              Loading payment method...
            </div>

          ) : availablePayments.length ===
            0 ? (

            <div
              className="
                rounded-2xl
                border-2
                border-red-200
                bg-white
                p-4
                text-sm
                font-medium
                text-red-500
                dark:border-red-900
                dark:bg-[#1e1e1e]
              "
            >
              Tidak ada metode pembayaran
              yang tersedia.
            </div>

          ) : (

            <div className="space-y-3">

              {availablePayments.map(
                (payment) => {

                  const method =
                    payment.normalizedMethod;

                  const note =
                    getPaymentNote(
                      payment
                    );

                  const selected =
                    paymentMethod ===
                    method;

                  return (
                    <div
                      key={
                        payment.id ??
                        method
                      }
                      onClick={() =>
                        !isLoading &&
                        setPaymentMethod(
                          method
                        )
                      }
                      className={`flex cursor-pointer items-start gap-3 rounded-2xl border-2 bg-white p-4 transition-all dark:bg-[#1e1e1e] ${
                        selected
                          ? "border-zinc-900 dark:border-white"
                          : "border-gray-200 dark:border-[#333333]"
                      } ${
                        isLoading
                          ? "cursor-not-allowed opacity-50"
                          : ""
                      }`}
                    >

                      {/* RADIO */}

                      <div className="mt-0.5">

                        <div
                          className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                            selected
                              ? "border-zinc-900 dark:border-white"
                              : "border-gray-300 dark:border-[#444444]"
                          }`}
                        >

                          {selected && (
                            <div
                              className="
                                h-2.5
                                w-2.5
                                rounded-full
                                bg-zinc-900
                                dark:bg-white
                              "
                            />
                          )}

                        </div>

                      </div>

                      {/* PAYMENT CONTENT */}

                      <div
                        className="
                          min-w-0
                          flex-1
                        "
                      >

                        <div
                          className="
                            flex
                            items-center
                            gap-2
                            text-sm
                            font-black
                            tracking-wider
                            text-gray-900
                            dark:text-white
                          "
                        >

                          {getPaymentIcon(
                            method
                          )}

                          <span>
                            {getPaymentTitle(
                              payment
                            )}
                          </span>

                        </div>

                        <p
                          className="
                            mt-1
                            text-[11px]
                            font-medium
                            leading-relaxed
                            text-gray-500
                            dark:text-gray-400
                          "
                        >
                          {getPaymentDescription(
                            payment
                          )}
                        </p>

                        {note && (
                          <div
                            className="
                              mt-3
                              rounded-xl
                              bg-gray-50
                              px-3
                              py-2.5
                              dark:bg-[#292929]
                            "
                          >

                            <p
                              className="
                                text-[9px]
                                font-black
                                uppercase
                                tracking-wider
                                text-gray-400
                              "
                            >
                              Note
                            </p>

                            <p
                              className="
                                mt-1
                                text-xs
                                font-semibold
                                leading-relaxed
                                text-gray-700
                                dark:text-gray-300
                              "
                            >
                              {note}
                            </p>

                          </div>
                        )}

                      </div>

                    </div>
                  );
                }
              )}

            </div>
          )}

        </div>

      </div>

      {/* =====================================================
          PROCEED BUTTON
      ===================================================== */}

      <div className="p-4 pt-0">

        <button
          type="button"
          onClick={handleProceed}
          disabled={
            !isFormValid ||
            isLoading ||
            paymentLoading ||
            availablePayments.length === 0
          }
          className={`flex w-full items-center justify-between rounded-2xl px-6 py-4 text-sm font-bold uppercase tracking-wider shadow-lg transition-colors ${
            isFormValid &&
            !isLoading &&
            !paymentLoading &&
            availablePayments.length > 0
              ? "cursor-pointer bg-zinc-900 text-white hover:bg-black dark:bg-white dark:text-[#111] dark:hover:bg-gray-200"
              : "cursor-not-allowed bg-[#CFCFCF] text-white dark:bg-[#333333] dark:text-[#777]"
          }`}
        >

          <span>
            {isLoading
              ? "MEMPROSES..."
              : "PROCEED TO PAYMENT"}
          </span>

          <ArrowRight size={20} />

        </button>

      </div>

    </div>
  );
}

