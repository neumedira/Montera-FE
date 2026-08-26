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
  const location = useLocation();

  const [isLoading, setIsLoading] = useState(
    !location.state?.skipLoading
  );

  useEffect(() => {
    // Kalau kembali dari detail menu,
    // langsung tampilkan menu tanpa loading
    if (location.state?.skipLoading) {
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

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
              
              Contoh:
              /menu/1
              /menu/2
              /menu/3
          =============================================== */}

          <Route
            path="/menu/:id"
            element={<MenuDetail />}
          />


          {/* ===============================================
              ADMIN
          =============================================== */}

          <Route
            path="/admin/login"
            element={<Login />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/admin"
            element={<Dashboard />}
          />

          <Route
            path="/menu-admin"
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