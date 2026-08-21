import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";

import "./App.css";

import Menu from "./pages/costumer/menu/Menu";
import MenuDetail from "./pages/costumer/menu/MenuDetail";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Laporan from "./pages/Laporan";
import OrderPage from "./components/orders/OrderPage";
import KelolaMenu from "./pages/KelolaMenu";
import KelolaQR from "./pages/KelolaQR";
import CartPage from "./pages/CartPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import Settings from "./pages/Settings";
import CashPaymentPage from "./pages/CashPaymentPage";
import QrisPaymentPage from "./pages/QrisPaymentPage";

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>

          {/* Costumer */}
          <Route path="/" element={<Menu />} />
          <Route path="/scan/:token" element={<Menu />} />
          <Route path="costumer/menu/:id" element={<MenuDetail />} />

          {/* Admin */}
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/menu" element={<KelolaMenu />} />
          <Route path="/qr" element={<KelolaQR />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/pesanan" element={<OrderPage />} />
          <Route path="/laporan" element={<Laporan />} />

          {/* Cart / Order */}
          <Route path="/cart" element={<CartPage />} />
          <Route path="/order-details" element={<OrderDetailPage />} />
          <Route path="/cash-payment" element={<CashPaymentPage />} />
          <Route path="/qris-payment" element={<QrisPaymentPage />} />

        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;