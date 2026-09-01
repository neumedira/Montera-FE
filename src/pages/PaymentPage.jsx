
import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
  useLocation,
} from "react-router-dom";

import {
  QrCode,
  Banknote,
  CreditCard,
  Building2,
  WalletCards,
  ArrowRight,
} from "lucide-react";

import {
  useCart,
} from "../context/CartContext";

import LoadingScreen from "../components/costumer/menu/LoadingScreen";

import axios from "axios";

// =========================================================
// BACKEND URL
// =========================================================

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// =========================================================
// IMAGE HELPER
// =========================================================

const getImageUrl = (
  photo
) => {
  if (!photo) {
    return "";
  }

  const value =
    String(photo).trim();

  if (!value) {
    return "";
  }

  if (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("blob:") ||
    value.startsWith("data:")
  ) {
    return value;
  }

  if (
    value.startsWith("/storage/")
  ) {
    return `${BACKEND_URL}${value}`;
  }

  if (
    value.startsWith("storage/")
  ) {
    return `${BACKEND_URL}/${value}`;
  }

  if (value.startsWith("/")) {
    return `${BACKEND_URL}${value}`;
  }

  return `${BACKEND_URL}/storage/${value}`;
};

// =========================================================
// NORMALIZE METHOD
// =========================================================

const normalizePaymentMethod = (
  method
) => {
  return String(
    method || ""
  )
    .trim()
    .toLowerCase();
};

// =========================================================
// PAYMENT CATEGORY
// =========================================================

const getPaymentCategory = (
  method
) => {
  const value =
    normalizePaymentMethod(
      method
    );

  if (
    value === "cash" ||
    value === "tunai"
  ) {
    return "cash";
  }

  if (
    value === "qris" ||
    value.startsWith("qris_")
  ) {
    return "qris";
  }

  if (
    value === "tf_bank" ||
    value.startsWith("tf_bank_")
  ) {
    return "bank";
  }

  if (
    value === "ewallet" ||
    value.startsWith(
      "ewallet_"
    )
  ) {
    return "ewallet";
  }

  if (
    value === "kartu" ||
    value.startsWith("kartu_")
  ) {
    return "card";
  }

  return "other";
};

// =========================================================
// HUMANIZE METHOD
// =========================================================

const humanizeMethod = (
  method
) => {
  if (!method) {
    return "PAYMENT";
  }

  const value =
    String(method)
      .replace(/_/g, " ")
      .trim();

  return value
    .replace(/\b\w/g, (char) =>
      char.toUpperCase()
    );
};

// =========================================================
// PAGE
// =========================================================

export default function PaymentPage() {
  const navigate =
    useNavigate();

  const location =
    useLocation();

  const {
    clearCart,
  } = useCart();

  // =======================================================
  // ORDER DATA
  // =======================================================

  const orderData =
    location.state?.orderData ||
    null;

  // =======================================================
  // ORDER INFO
  // =======================================================

  const customerName =
    orderData?.customer_name ||
    location.state?.customerName ||
    "Customer";

  const rawOrderType =
    orderData?.order_type ||
    location.state?.orderType ||
    "dine-in";

  const orderTypeDisplay =
    rawOrderType === "dine-in"
      ? "Dine In"
      : "Take Away";

  const orderNumber =
    orderData?.order_number ||
    "-";

  const displayTotal =
    Number(
      orderData?.total_amount ??
        0
    );

  // =======================================================
  // SELECTED PAYMENT METHOD
  // =======================================================

  const paymentMethod =
    normalizePaymentMethod(
      orderData?.payment_method ||
        location.state?.paymentMethod
    );

  // =======================================================
  // PAYMENT SETTINGS
  // =======================================================

  const [
    paymentSetting,
    setPaymentSetting,
  ] = useState(null);

  const [
    paymentLoading,
    setPaymentLoading,
  ] = useState(true);

  const [
    paymentError,
    setPaymentError,
  ] = useState("");

  // =======================================================
  // QR IMAGE
  // =======================================================

  const [
    qrImage,
    setQrImage,
  ] = useState("");

  // =======================================================
  // FINISH
  // =======================================================

  const [
    isFinishing,
    setIsFinishing,
  ] = useState(false);

  // =======================================================
  // TIMER
  // =======================================================

  const [
    timeLeft,
    setTimeLeft,
  ] = useState(299);

  // =======================================================
  // CATEGORY
  // =======================================================

  const paymentCategory =
    useMemo(() => {
      return getPaymentCategory(
        paymentMethod
      );
    }, [paymentMethod]);

  // =======================================================
  // FETCH PAYMENT SETTING
  // =======================================================

  useEffect(() => {
    let mounted = true;

    const fetchPaymentSetting =
      async () => {
        try {
          setPaymentLoading(
            true
          );

          setPaymentError("");

          const response =
            await axios.get(
              `${BACKEND_URL}/api/v1/customer/settings`
            );

          console.log(
            "PAYMENT CUSTOMER SETTINGS:",
            response.data
          );

          const settings =
            response.data?.data;

          const payments =
            Array.isArray(
              settings?.payment_settings
            )
              ? settings.payment_settings
              : [];

          const selectedPayment =
            payments.find(
              (payment) => {
                const method =
                  normalizePaymentMethod(
                    payment.method
                  );

                const active =
                  payment.is_active ===
                    true ||
                  payment.is_active ===
                    1 ||
                  payment.is_active ===
                    "1";

                if (!active) {
                  return false;
                }

                return (
                  method ===
                  paymentMethod
                );
              }
            );

          if (!mounted) {
            return;
          }

          if (!selectedPayment) {
            setPaymentSetting(
              null
            );

            setPaymentError(
              "Metode pembayaran yang dipilih tidak tersedia."
            );

            setQrImage("");

            return;
          }

          setPaymentSetting(
            selectedPayment
          );

          // =================================================
          // QR IMAGE
          // =================================================

          const imageUrl =
            getImageUrl(
              selectedPayment.qr_image_url
            );

          setQrImage(
            imageUrl
          );

          console.log(
            "SELECTED PAYMENT SETTING:",
            selectedPayment
          );

          console.log(
            "PAYMENT CATEGORY:",
            getPaymentCategory(
              selectedPayment.method
            )
          );
        } catch (error) {
          console.error(
            "Gagal mengambil payment settings:",
            error
          );

          if (mounted) {
            setPaymentSetting(
              null
            );

            setQrImage("");

            setPaymentError(
              "Gagal mengambil informasi pembayaran."
            );
          }
        } finally {
          if (mounted) {
            setPaymentLoading(
              false
            );
          }
        }
      };

    if (!paymentMethod) {
      setPaymentLoading(
        false
      );

      setPaymentError(
        "Metode pembayaran tidak ditemukan."
      );

      return;
    }

    fetchPaymentSetting();

    return () => {
      mounted = false;
    };
  }, [paymentMethod]);

  // =======================================================
  // TIMER
  // =======================================================

  useEffect(() => {
    // Timer hanya untuk QRIS.
    if (
      paymentCategory !==
      "qris"
    ) {
      return;
    }

    if (timeLeft <= 0) {
      return;
    }

    const timer =
      setInterval(() => {
        setTimeLeft(
          (prev) =>
            prev - 1
        );
      }, 1000);

    return () =>
      clearInterval(timer);
  }, [
    paymentCategory,
    timeLeft,
  ]);

  // =======================================================
  // FORMAT TIME
  // =======================================================

  const formatTime =
    (seconds) => {
      const mins =
        Math.floor(
          seconds / 60
        );

      const secs =
        seconds % 60;

      return `${String(
        mins
      ).padStart(
        2,
        "0"
      )}:${String(
        secs
      ).padStart(
        2,
        "0"
      )}`;
    };

  // =======================================================
  // FORMAT PRICE
  // =======================================================

  const formatPrice =
    (price) => {
      return Number(
        price || 0
      ).toLocaleString(
        "id-ID"
      );
    };

  // =======================================================
  // PAYMENT TITLE
  // =======================================================

  const paymentTitle =
    humanizeMethod(
      paymentSetting?.method ||
        paymentMethod
    ).toUpperCase();

  // =======================================================
  // PAYMENT ICON
  // =======================================================

  const PaymentIcon =
    () => {
      if (
        paymentCategory ===
        "cash"
      ) {
        return (
          <Banknote
            size={24}
            strokeWidth={2}
          />
        );
      }

      if (
        paymentCategory ===
        "qris"
      ) {
        return (
          <QrCode
            size={24}
            strokeWidth={2}
          />
        );
      }

      if (
        paymentCategory ===
        "bank"
      ) {
        return (
          <Building2
            size={24}
            strokeWidth={2}
          />
        );
      }

      if (
        paymentCategory ===
        "ewallet"
      ) {
        return (
          <WalletCards
            size={24}
            strokeWidth={2}
          />
        );
      }

      if (
        paymentCategory ===
        "card"
      ) {
        return (
          <CreditCard
            size={24}
            strokeWidth={2}
          />
        );
      }

      return (
        <CreditCard
          size={24}
          strokeWidth={2}
        />
      );
    };

  // =======================================================
  // PAYMENT DESCRIPTION
  // =======================================================

  const paymentDescription =
    (() => {
      if (
        paymentCategory ===
        "cash"
      ) {
        return "Please prepare the exact amount or hand the cash to our cashier.";
      }

      if (
        paymentCategory ===
        "qris"
      ) {
        return "Scan the QR code with your e-wallet or mobile banking app.";
      }

      if (
        paymentCategory ===
        "bank"
      ) {
        return "Please transfer the payment according to the payment information below.";
      }

      if (
        paymentCategory ===
        "ewallet"
      ) {
        return "Complete the payment using the selected e-wallet.";
      }

      if (
        paymentCategory ===
        "card"
      ) {
        return "Complete the payment using your card.";
      }

      return "Please complete your payment using the selected method.";
    })();

  // =======================================================
  // PAYMENT NOTE
  // =======================================================

  const paymentNote =
    String(
      paymentSetting?.provider_note ||
        ""
    ).trim();

  // =======================================================
  // DONE
  // =======================================================

  const handleDone =
    async () => {
      if (!orderData) {
        return;
      }

      try {
        setIsFinishing(
          true
        );

        console.log(
          "PAYMENT DONE:",
          {
            orderNumber,
            paymentMethod,
            paymentCategory,
          }
        );

        clearCart();

        navigate("/", {
          state: {
            skipLoading: true,
          },
        });
      } catch (error) {
        console.error(
          "Gagal menyelesaikan pembayaran:",
          error
        );

        setIsFinishing(
          false
        );

        alert(
          "Terjadi kesalahan. Silakan coba lagi."
        );
      }
    };

  // =======================================================
  // LOADING
  // =======================================================

  if (
    isFinishing
  ) {
    return (
      <LoadingScreen />
    );
  }

  // =======================================================
  // PAGE
  // =======================================================

  return (
    <div
      className="
        min-h-screen
        bg-[#FAF7F2]
        dark:bg-[#121212]
        max-w-md
        mx-auto
        p-4
        flex
        flex-col
        justify-between
        transition-colors
        duration-300
      "
    >

      <div>

        {/* =================================================
            HEADER
        ================================================= */}

        <div
          className="
            mb-6
            flex
            items-center
            gap-2
            text-gray-900
            dark:text-white
          "
        >

          <PaymentIcon />

          <h1
            className="
              text-lg
              font-bold
              uppercase
              tracking-wider
            "
          >
            {paymentTitle}
          </h1>

        </div>

        {/* =================================================
            LOADING / ERROR
        ================================================= */}

        {paymentLoading ? (

          <div
            className="
              mb-6
              rounded-2xl
              border
              border-gray-200
              bg-white
              p-6
              text-center
              text-sm
              font-medium
              text-gray-400
              dark:border-[#333333]
              dark:bg-[#1e1e1e]
            "
          >
            Loading payment information...
          </div>

        ) : paymentError ? (

          <div
            className="
              mb-6
              rounded-2xl
              border
              border-red-200
              bg-white
              p-6
              text-center
              text-sm
              font-medium
              text-red-500
              dark:border-red-900
              dark:bg-[#1e1e1e]
            "
          >
            {paymentError}
          </div>

        ) : (

          <>
            {/* =============================================
                QRIS
            ============================================= */}

            {paymentCategory ===
              "qris" && (
              <>
                <div
                  className="
                    mb-6
                    text-center
                  "
                >

                  <p
                    className="
                      mb-1
                      text-sm
                      font-bold
                      text-gray-900
                      dark:text-gray-200
                    "
                  >
                    Complete the payment within the timeframe
                  </p>

                  <span
                    className="
                      font-display
                      text-4xl
                      tracking-wider
                      text-gray-900
                      dark:text-white
                    "
                  >
                    {formatTime(
                      timeLeft
                    )}
                  </span>

                </div>

                <div
                  className="
                    mb-6
                    flex
                    aspect-square
                    w-full
                    items-center
                    justify-center
                    overflow-hidden
                    rounded-2xl
                    border
                    border-gray-200/50
                    bg-[#D9D9D9]
                    shadow-inner
                    dark:border-[#333333]
                    dark:bg-[#1e1e1e]
                  "
                >

                  {qrImage ? (

                    <img
                      src={qrImage}
                      alt="QRIS Store Code"
                      className="
                        h-full
                        w-full
                        bg-white
                        object-contain
                        p-4
                      "
                      onError={() => {
                        setQrImage(
                          ""
                        );

                        setPaymentError(
                          "QRIS image tidak dapat ditampilkan."
                        );
                      }}
                    />

                  ) : (

                    <div
                      className="
                        p-6
                        text-center
                      "
                    >

                      <QrCode
                        size={48}
                        className="
                          mx-auto
                          mb-3
                          text-gray-400
                          dark:text-gray-500
                        "
                      />

                      <p
                        className="
                          text-xs
                          font-medium
                          text-gray-400
                          dark:text-gray-500
                        "
                      >
                        QRIS image belum tersedia.
                      </p>

                    </div>

                  )}

                </div>
              </>
            )}

            {/* =============================================
                CASH
            ============================================= */}

            {paymentCategory ===
              "cash" && (
              <div
                className="
                  mb-6
                  rounded-2xl
                  border
                  border-gray-100
                  bg-white
                  p-6
                  text-center
                  shadow-sm
                  dark:border-[#333333]
                  dark:bg-[#1e1e1e]
                "
              >

                <div
                  className="
                    mx-auto
                    mb-4
                    flex
                    h-16
                    w-16
                    items-center
                    justify-center
                    rounded-full
                    bg-gray-100
                    text-gray-800
                    dark:bg-[#2d2d2d]
                    dark:text-white
                  "
                >

                  <Banknote
                    size={30}
                  />

                </div>

                <p
                  className="
                    text-sm
                    font-bold
                    text-gray-900
                    dark:text-white
                  "
                >
                  CASH PAYMENT
                </p>

                <p
                  className="
                    mt-2
                    text-xs
                    leading-relaxed
                    text-gray-500
                    dark:text-gray-400
                  "
                >
                  {paymentDescription}
                </p>

              </div>
            )}

            {/* =============================================
                OTHER PAYMENT
            ============================================= */}

            {paymentCategory !==
              "qris" &&
              paymentCategory !==
                "cash" && (
              <div
                className="
                  mb-6
                  rounded-2xl
                  border
                  border-gray-100
                  bg-white
                  p-6
                  text-center
                  shadow-sm
                  dark:border-[#333333]
                  dark:bg-[#1e1e1e]
                "
              >

                <div
                  className="
                    mx-auto
                    mb-4
                    flex
                    h-16
                    w-16
                    items-center
                    justify-center
                    rounded-full
                    bg-gray-100
                    text-gray-800
                    dark:bg-[#2d2d2d]
                    dark:text-white
                  "
                >

                  <PaymentIcon />

                </div>

                <p
                  className="
                    text-sm
                    font-bold
                    uppercase
                    text-gray-900
                    dark:text-white
                  "
                >
                  {paymentTitle}
                </p>

                <p
                  className="
                    mt-2
                    text-xs
                    leading-relaxed
                    text-gray-500
                    dark:text-gray-400
                  "
                >
                  {paymentDescription}
                </p>

              </div>
            )}

            {/* =============================================
                PAYMENT NOTE
            ============================================= */}

            {paymentNote && (
              <div
                className="
                  mb-6
                  rounded-xl
                  bg-gray-50
                  px-4
                  py-3
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
                  {paymentNote}
                </p>

              </div>
            )}

            {/* =============================================
                ORDER INFO
            ============================================= */}

            <div
              className="
                mb-6
                rounded-xl
                border
                border-gray-100
                bg-white
                p-4
                shadow-sm
                dark:border-[#333333]
                dark:bg-[#1e1e1e]
              "
            >

              <div
                className="
                  flex
                  items-center
                  justify-between
                  gap-4
                "
              >

                <div
                  className="
                    min-w-0
                  "
                >

                  <span
                    className="
                      block
                      truncate
                      text-sm
                      font-bold
                      text-gray-900
                      dark:text-white
                    "
                  >
                    {customerName}
                  </span>

                  <span
                    className="
                      mt-0.5
                      block
                      text-[11px]
                      text-gray-500
                      dark:text-gray-400
                    "
                  >
                    {orderNumber}
                  </span>

                </div>

                <span
                  className="
                    shrink-0
                    rounded-full
                    bg-gray-100
                    px-3
                    py-1.5
                    text-xs
                    font-bold
                    uppercase
                    tracking-wider
                    text-gray-800
                    dark:bg-[#2d2d2d]
                    dark:text-gray-200
                  "
                >
                  {orderTypeDisplay}
                </span>

              </div>

            </div>

          </>
        )}

      </div>

      {/* =================================================
          BOTTOM
      ================================================= */}

      <div>

        {/* TOTAL */}

        <div
          className="
            mt-6
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
              text-base
              font-bold
              text-gray-900
              dark:text-gray-200
            "
          >
            Total
          </span>

          <p
            className="
              font-display
              text-3xl
              text-gray-900
              dark:text-white
            "
          >
            Rp{" "}
            {formatPrice(
              displayTotal
            )}
          </p>

        </div>

        {/* DONE */}

        <button
          type="button"
          onClick={
            handleDone
          }
          disabled={
            isFinishing ||
            paymentLoading ||
            !paymentSetting ||
            !orderData
          }
          className="
            mt-6
            flex
            w-full
            items-center
            justify-between
            rounded-2xl
            bg-zinc-900
            px-6
            py-4
            text-sm
            font-bold
            uppercase
            tracking-wider
            text-white
            shadow-lg
            transition-colors
            duration-300
            hover:bg-black
            active:scale-[0.98]
            disabled:cursor-not-allowed
            disabled:opacity-50
            dark:bg-white
            dark:text-[#111]
            dark:hover:bg-gray-200
          "
        >

          <span>
            DONE
          </span>

          <ArrowRight
            size={20}
          />

        </button>

      </div>

    </div>
  );
}
