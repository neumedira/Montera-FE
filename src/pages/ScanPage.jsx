
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import LoadingScreen from "../components/costumer/menu/LoadingScreen";
import api from "../api/axios";

// =========================================================
// SCAN QR TABLE
// =========================================================

export default function ScanPage() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [error, setError] = useState("");

  // =========================================================
  // SCAN QR
  // =========================================================

  useEffect(() => {
    let mounted = true;

    const scanTable = async () => {
      try {
        setError("");

        if (!token) {
          throw new Error(
            "Token QR meja tidak ditemukan."
          );
        }

        console.log(
          "🔎 SCAN QR TOKEN:",
          token
        );

        // =====================================================
        // REQUEST KE BACKEND
        // GET /api/v1/customer/scan/{token}
        // =====================================================

        const response = await api.get(
          `/customer/scan/${token}`
        );

        console.log(
          "🔎 SCAN TABLE RESPONSE:",
          response.data
        );

        const table =
          response.data?.data;

        // =====================================================
        // VALIDASI RESPONSE
        // =====================================================

        if (
          !table ||
          !table.table_id
        ) {
          throw new Error(
            "Data meja tidak ditemukan."
          );
        }

        // =====================================================
        // SIMPAN DATA MEJA
        // =====================================================

        const customerTable = {
          table_id: table.table_id,
          table_number: table.table_number,
          qr_token: table.qr_token,
        };

        sessionStorage.setItem(
          "customer_table",
          JSON.stringify(
            customerTable
          )
        );

        console.log(
          "✅ CUSTOMER TABLE:",
          customerTable
        );

        // =====================================================
        // MASUK CUSTOMER MENU
        // =====================================================

        if (mounted) {
          navigate("/", {
            replace: true,
          });
        }
      } catch (error) {
        console.error(
          "❌ Gagal scan QR meja:",
          error
        );

        console.error(
          "❌ Response error:",
          error.response?.data
        );

        if (!mounted) {
          return;
        }

        setError(
          error.response?.data?.message ||
            error.message ||
            "QR meja tidak valid."
        );
      }
    };

    scanTable();

    return () => {
      mounted = false;
    };
  }, [token, navigate]);

  // =========================================================
  // ERROR
  // =========================================================

  if (error) {
    return (
      <div
        className="
          fixed
          inset-0
          flex
          flex-col
          items-center
          justify-center
          bg-[#fffcf4]
          px-6
          text-center
          dark:bg-[#121212]
        "
      >
        <p
          className="
            text-[15px]
            font-semibold
            text-[#777]
            dark:text-[#aaa]
          "
        >
          {error}
        </p>

        <button
          type="button"
          onClick={() => {
            setError("");
            navigate("/");
          }}
          className="
            mt-3
            text-[13px]
            font-bold
            underline
            dark:text-white
          "
        >
          Kembali ke Menu
        </button>
      </div>
    );
  }

  // =========================================================
  // LOADING
  // =========================================================

  return <LoadingScreen />;
}

