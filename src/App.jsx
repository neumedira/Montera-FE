import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Laporan from "./pages/Laporan";

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
        <Route
          path="/login"
          element={<Login />}
        />

        {/* Dashboard */}
        <Route
          path="/"
          element={<Dashboard />}
        />

        {/* Laporan */}
        <Route
          path="/laporan"
          element={<Laporan />}
        />

        {/* Settings */}
        <Route
          path="/settings"
          element={<Settings />}
        />

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