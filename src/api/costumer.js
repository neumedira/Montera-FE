
import api from "./axios";

// =========================================================
// CUSTOMER — MENU CACHE
// =========================================================

let customerMenusCache = null;

// =========================================================
// CUSTOMER — MENU
// =========================================================

export const getCustomerMenus = async () => {
  // Kalau data sudah pernah diambil,
  // langsung gunakan cache tanpa request ulang.
  if (customerMenusCache) {
    return customerMenusCache;
  }

  const response = await api.get("/customer/menus");

  customerMenusCache = response.data;

  return customerMenusCache;
};

// =========================================================
// CLEAR CUSTOMER MENU CACHE
// =========================================================

export const clearCustomerMenusCache = () => {
  customerMenusCache = null;
};

// =========================================================
// CUSTOMER — ORDERS
// =========================================================

export const createCustomerOrder = async (data) => {
  const response = await api.post("/customer/orders", data);

  return response.data;
};

