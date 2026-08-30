
import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import { CartProvider } from "./context/CartContext";

import "./App.css";

// ==============================
// PROTECTED ROUTE
// ==============================
import ProtectedRoute from "./components/ProtectedRoute";

// ==============================
// CUSTOMER
// ==============================
import ScanPage from "./pages/ScanPage";

import Menu from "./pages/costumer/menu/Menu";
import MenuDetail from "./pages/costumer/menu/MenuDetail";
import BundleDetail from "./pages/costumer/menu/BundleDetail";
import LoadingScreen from "./components/costumer/menu/LoadingScreen";

// ==============================
// ADMIN
// ==============================
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import KelolaMenu from "./pages/KelolaMenu";
import KelolaQR from "./pages/KelolaQR";
import Settings from "./pages/Settings";
import OrderPage from "./pages/OrderPage";
import Laporan from "./pages/Laporan";

// ==============================
// CART / ORDER / PAYMENT
// ==============================
import CartPage from "./pages/CartPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import PaymentPage from "./pages/PaymentPage";

// =========================================================
// CUSTOMER MENU WRAPPER
// =========================================================

function CustomerMenuWrapper() {
  const [isLoading, setIsLoading] = useState(() => {
    return (
      sessionStorage.getItem(
        "montera_menu_loaded"
      ) !== "true"
    );
  });

  useEffect(() => {
    if (!isLoading) {
      return;
    }

    const timer = setTimeout(() => {
      setIsLoading(false);

      sessionStorage.setItem(
        "montera_menu_loaded",
        "true"
      );
    }, 1500);

    return () => {
      clearTimeout(timer);
    };
  }, [isLoading]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return <Menu />;
}

// =========================================================
// APP
// =========================================================

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>

          {/* ===============================================
              CUSTOMER SCAN QR TABLE
          =============================================== */}

          <Route
            path="/scan/:token"
            element={<ScanPage />}
          />

          {/* ===============================================
              CUSTOMER MENU
          =============================================== */}

          <Route
            path="/"
            element={
              <CustomerMenuWrapper />
            }
          />

          {/* ===============================================
              CUSTOMER MENU DETAIL
          =============================================== */}

          <Route
            path="/menu/:id"
            element={<MenuDetail />}
          />

          {/* ===============================================
              CUSTOMER BUNDLE DETAIL
          =============================================== */}

          <Route
            path="/menu/bundle/:id"
            element={
              <BundleDetail />
            }
          />

          {/* ===============================================
              ADMIN LOGIN
          =============================================== */}

          <Route
            path="/login"
            element={<Login />}
          />

          {/* ===============================================
              PROTECTED ADMIN ROUTES
          =============================================== */}

          <Route
            element={
              <ProtectedRoute />
            }
          >

            <Route
              path="/admin"
              element={<Dashboard />}
            />

            <Route
              path="/menu"
              element={<KelolaMenu />}
            />

            <Route
              path="/qr"
              element={<KelolaQR />}
            />

            <Route
              path="/settings"
              element={<Settings />}
            />

            <Route
              path="/pesanan"
              element={<OrderPage />}
            />

            <Route
              path="/laporan"
              element={<Laporan />}
            />

          </Route>

          {/* ===============================================
              CART
          =============================================== */}

          <Route
            path="/cart"
            element={<CartPage />}
          />

          {/* ===============================================
              ORDER DETAIL
          =============================================== */}

          <Route
            path="/order-details"
            element={
              <OrderDetailPage />
            }
          />

          {/* ===============================================
              GLOBAL PAYMENT
          =============================================== */}

          <Route
            path="/payment"
            element={<PaymentPage />}
          />

        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;

