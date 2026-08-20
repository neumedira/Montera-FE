import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Laporan from "./pages/Laporan";
import KelolaMenu from "./pages/KelolaMenu";
import KelolaQR from "./pages/KelolaQR";

import NewOrderModal from "./components/modal/NewOrderModal";
import Settings from "./pages/Settings";

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
      <Routes>
        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Dashboard */}
        <Route path="/" element={<Dashboard />} />

        {/* Kelola Menu */}
        <Route path="/menu" element={<KelolaMenu />} />

        {/* Kelola QR */}
        <Route path="/qr" element={<KelolaQR />} />

        {/* Settings */}
        <Route path="/settings"
          element={<Settings />}
        />

        {/* Laporan */}
        <Route path="/laporan" element={<Laporan />} />
      </Routes>

      {/* Global New Order Notification */}
      <NewOrderModal
        isOpen={showNewOrder}
        onClose={() => setShowNewOrder(false)}
        orderId="MTR-1001"
      />
    </BrowserRouter>
  );
}

export default App;