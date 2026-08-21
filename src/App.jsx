import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";

import "./App.css";

// ==============================
// CUSTOMER
// ==============================
import Pilihan from "./components/pilihan/Pilihan";
import Menu from "./pages/costumer/menu/Menu";
import MenuDetail from "./pages/costumer/menu/MenuDetail";

// ==============================
// ADMIN
// ==============================
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import KelolaMenu from "./pages/KelolaMenu";
import KelolaQR from "./pages/KelolaQR";
import Settings from "./pages/Settings";
import OrderPage from "./components/orders/OrderPage";
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

function App() {
  const [showNewOrder, setShowNewOrder] = useState(false);

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
          {/* =================================
              CUSTOMER
          ================================= */}

          {/* Pilihan Dine In / Take Away */}
          <Route
            path="/"
            element={<Pilihan />}
          />

          {/* Menu Customer */}
          <Route
            path="/costumer/menu"
            element={<Menu />}
          />

          {/* Detail Menu Customer */}
          <Route
            path="/costumer/menu/:id"
            element={<MenuDetail />}
          />

          {/* =================================
              ADMIN
          ================================= */}

          {/* Login Admin */}
          <Route
            path="/admin/login"
            element={<Login />}
          />

          {/* Dashboard Admin */}
          <Route
            path="/admin"
            element={<Dashboard />}
          />

          {/* Kelola Menu */}
          <Route
            path="/menu"
            element={<KelolaMenu />}
          />

          {/* Kelola QR */}
          <Route
            path="/qr"
            element={<KelolaQR />}
          />

          {/* Settings */}
          <Route
            path="/settings"
            element={<Settings />}
          />

          {/* Pesanan */}
          <Route
            path="/pesanan"
            element={<OrderPage />}
          />

          {/* Laporan */}
          <Route
            path="/laporan"
            element={<Laporan />}
          />

          {/* =================================
              CART / ORDER / PAYMENT
          ================================= */}

          {/* Cart */}
          <Route
            path="/cart"
            element={<CartPage />}
          />

          {/* Order Detail */}
          <Route
            path="/order-details"
            element={<OrderDetailPage />}
          />

          {/* Cash Payment */}
          <Route
            path="/cash-payment"
            element={<CashPaymentPage />}
          />

          {/* QRIS Payment */}
          <Route
            path="/qris-payment"
            element={<QrisPaymentPage />}
          />
        </Routes>

        {/* =================================
            GLOBAL NEW ORDER NOTIFICATION
        ================================= */}
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