
import api from "./axios";

// =========================================================
// CUSTOMER — SETTINGS CACHE
// =========================================================

let customerSettingsCache = null;

// =========================================================
// CUSTOMER — MENU CACHE
// =========================================================

let customerMenusCache = null;

// =========================================================
// CUSTOMER — BUNDLE CACHE
// =========================================================

let customerBundlesCache = null;


// =========================================================
// CUSTOMER — SETTINGS
// =========================================================

export const getCustomerSettings = async () => {
  if (customerSettingsCache) {
    return customerSettingsCache;
  }

  const response = await api.get(
    "/customer/settings"
  );

  customerSettingsCache = response.data;

  return customerSettingsCache;
};


// =========================================================
// CUSTOMER — MENU
// =========================================================

export const getCustomerMenus = async () => {
  if (customerMenusCache) {
    return customerMenusCache;
  }

  const response = await api.get(
    "/customer/menus"
  );

  customerMenusCache = response.data;

  return customerMenusCache;
};


// =========================================================
// CUSTOMER — BUNDLES
// =========================================================

export const getCustomerBundles = async () => {
  if (customerBundlesCache) {
    return customerBundlesCache;
  }

  const response = await api.get(
    "/customer/bundles"
  );

  customerBundlesCache = response.data;

  return customerBundlesCache;
};


// =========================================================
// CLEAR CUSTOMER SETTINGS CACHE
// =========================================================

export const clearCustomerSettingsCache = () => {
  customerSettingsCache = null;
};


// =========================================================
// CLEAR CUSTOMER MENU CACHE
// =========================================================

export const clearCustomerMenusCache = () => {
  customerMenusCache = null;
};


// =========================================================
// CLEAR CUSTOMER BUNDLE CACHE
// =========================================================

export const clearCustomerBundlesCache = () => {
  customerBundlesCache = null;
};


// =========================================================
// CLEAR ALL CUSTOMER CATALOG CACHE
// =========================================================

export const clearCustomerCatalogCache = () => {
  customerSettingsCache = null;
  customerMenusCache = null;
  customerBundlesCache = null;
};


// =========================================================
// CUSTOMER — ORDERS
// =========================================================

export const createCustomerOrder = async (data) => {
  const response = await api.post(
    "/customer/orders",
    data
  );

  return response.data;
};

