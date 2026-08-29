
import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
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
import Menu from "./pages/costumer/menu/Menu";
import MenuDetail from "./pages/costumer/menu/MenuDetail";
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
import CashPaymentPage from "./pages/CashPaymentPage";
import QrisPaymentPage from "./pages/QrisPaymentPage";

// ==============================
// MODAL
// ==============================
import NewOrderModal from "./components/modal/NewOrderModal";

// =========================================================
// CUSTOMER MENU WRAPPER
// =========================================================

function CustomerMenuWrapper() {
  const [isLoading, setIsLoading] = useState(() => {
    // Cek apakah loading customer menu
    // sudah pernah ditampilkan dalam sesi ini.
    return sessionStorage.getItem("montera_menu_loaded") !== "true";
  });

  useEffect(() => {
    if (!isLoading) return;

    const timer = setTimeout(() => {
      setIsLoading(false);

      // Tandai bahwa customer menu
      // sudah pernah selesai loading.
      sessionStorage.setItem(
        "montera_menu_loaded",
        "true"
      );
    }, 1500);

    return () => clearTimeout(timer);
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
  const [showNewOrder, setShowNewOrder] = useState(false);

  // =======================================================
  // GLOBAL NEW ORDER NOTIFICATION
  // =======================================================

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNewOrder(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>

          {/* ===============================================
              CUSTOMER MENU
          =============================================== */}

          <Route
            path="/"
            element={<CustomerMenuWrapper />}
          />

          {/* ===============================================
              CUSTOMER MENU DETAIL
          =============================================== */}

          <Route
            path="/menu/:id"
            element={<MenuDetail />}
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

          <Route element={<ProtectedRoute />}>

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
            element={<OrderDetailPage />}
          />

          {/* ===============================================
              PAYMENT
          =============================================== */}

          <Route
            path="/cash-payment"
            element={<CashPaymentPage />}
          />

          <Route
            path="/qris-payment"
            element={<QrisPaymentPage />}
          />

        </Routes>

        {/* ===============================================
            GLOBAL NEW ORDER MODAL
        =============================================== */}

        <NewOrderModal
          isOpen={showNewOrder}
          onClose={() => setShowNewOrder(false)}
          orderId="MTR-1001"
        />

      </CartProvider>
    </BrowserRouter>
  );
}

export default App;

