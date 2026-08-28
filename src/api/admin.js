import api from "./axios";

// =========================================================
// AUTH
// =========================================================

export const loginAdmin = async (username, password) => {
  const response = await api.post("/admin/login", {
    login: username,
    password,
  });

  const token = response.data?.data?.token;

  if (token) {
    localStorage.setItem("admin_token", token);
  }

  return response.data;
};

export const logoutAdmin = async () => {
  const response = await api.post("/admin/logout");

  localStorage.removeItem("admin_token");

  return response.data;
};

// =========================================================
// MENU CATEGORIES
// =========================================================

export const getMenuCategories = async () => {
  const response = await api.get("/admin/menu-categories");

  return response.data;
};

export const createMenuCategory = async (data) => {
  const response = await api.post("/admin/menu-categories", data);

  return response.data;
};

export const updateMenuCategory = async (id, data) => {
  const response = await api.put(`/admin/menu-categories/${id}`, data);

  return response.data;
};

export const deleteMenuCategory = async (id) => {
  const response = await api.delete(`/admin/menu-categories/${id}`);

  return response.data;
};

// =========================================================
// MENU ITEMS
// =========================================================

export const getMenuItems = async () => {
  const response = await api.get("/admin/menu-items");

  return response.data;
};

export const getMenuItem = async (id) => {
  const response = await api.get(`/admin/menu-items/${id}`);

  return response.data;
};

export const createMenuItem = async (data) => {
  const response = await api.post("/admin/menu-items", data);

  return response.data;
};

export const updateMenuItem = async (id, data) => {
  const response = await api.put(`/admin/menu-items/${id}`, data);

  return response.data;
};

export const deleteMenuItem = async (id) => {
  const response = await api.delete(`/admin/menu-items/${id}`);

  return response.data;
};

// =========================================================
// ADDONS
// =========================================================

export const getAddons = async () => {
  const response = await api.get("/admin/addons");

  return response.data;
};

export const createAddon = async (data) => {
  const response = await api.post("/admin/addons", data);

  return response.data;
};

export const updateAddon = async (id, data) => {
  const response = await api.put(`/admin/addons/${id}`, data);

  return response.data;
};

export const deleteAddon = async (id) => {
  const response = await api.delete(`/admin/addons/${id}`);

  return response.data;
};

// =========================================================
// BUNDLES
// =========================================================

export const getBundles = async () => {
  const response = await api.get("/admin/bundles");

  return response.data;
};

export const createBundle = async (data) => {
  const response = await api.post("/admin/bundles", data);

  return response.data;
};

export const updateBundle = async (id, data) => {
  const response = await api.put(`/admin/bundles/${id}`, data);

  return response.data;
};

export const deleteBundle = async (id) => {
  const response = await api.delete(`/admin/bundles/${id}`);

  return response.data;
};