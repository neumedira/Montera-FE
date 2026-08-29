import api from "./axios";

// =========================================================
// CUSTOMER — MENU
// =========================================================

export const getCustomerMenus = async () => {
  const response = await api.get("/customer/menus");

  return response.data;
};

// =========================================================
// CUSTOMER — ORDERS
// =========================================================

export const createCustomerOrder = async (data) => {
  const response = await api.post("/customer/orders", data);

  return response.data;
};