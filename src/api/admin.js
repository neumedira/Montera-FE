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
// SETTINGS
// =========================================================

export const getSettings = async () => {
  const response = await api.get("/admin/settings");

  return response.data;
};

export const updateSettings = async (data) => {
  const formData = new FormData();

  // =======================================================
  // BUSINESS PROFILE
  // =======================================================

  if (data.business_profile) {
    formData.append(
      "business_profile[cafe_name]",
      data.business_profile.cafe_name ?? ""
    );

    formData.append(
      "business_profile[address]",
      data.business_profile.address ?? ""
    );

    formData.append(
      "business_profile[whatsapp_number]",
      data.business_profile.whatsapp_number ?? ""
    );

    formData.append(
      "business_profile[instagram]",
      data.business_profile.instagram ?? ""
    );

    formData.append(
      "business_profile[tiktok]",
      data.business_profile.tiktok ?? ""
    );
  }

  // =======================================================
  // TAX SETTING
  // =======================================================

  if (data.tax_setting) {
    formData.append(
      "tax_setting[tax_percentage]",
      data.tax_setting.tax_percentage ?? 0
    );

    formData.append(
      "tax_setting[service_charge_percentage]",
      data.tax_setting.service_charge_percentage ?? 0
    );
  }

  // =======================================================
  // PAYMENT SETTINGS
  // =======================================================

  if (Array.isArray(data.payment_settings)) {
    data.payment_settings.forEach((payment, index) => {
      formData.append(
        `payment_settings[${index}][method]`,
        payment.method ?? payment.type ?? ""
      );

      formData.append(
        `payment_settings[${index}][is_active]`,
        payment.is_active !== undefined
          ? payment.is_active
            ? "1"
            : "0"
          : payment.enabled
            ? "1"
            : "0"
      );

      formData.append(
        `payment_settings[${index}][provider_note]`,
        payment.provider_note ??
          payment.provider ??
          payment.description ??
          ""
      );

      // =====================================================
      // QR IMAGE
      // =====================================================

      if (payment.qr_image instanceof File) {
        formData.append(
          `payment_settings[${index}][qr_image]`,
          payment.qr_image
        );
      }
    });
  }

  const response = await api.post(
    "/admin/settings",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

// =========================================================
// MENU CATEGORIES
// =========================================================

export const getMenuCategories = async () => {
  const response = await api.get(
    "/admin/menu-categories"
  );

  return response.data;
};

export const createMenuCategory = async (data) => {
  const response = await api.post(
    "/admin/menu-categories",
    data
  );

  return response.data;
};

export const updateMenuCategory = async (id, data) => {
  const response = await api.put(
    `/admin/menu-categories/${id}`,
    data
  );

  return response.data;
};

export const deleteMenuCategory = async (id) => {
  const response = await api.delete(
    `/admin/menu-categories/${id}`
  );

  return response.data;
};

// =========================================================
// MENU ITEMS
// =========================================================

export const getMenuItems = async () => {
  const response = await api.get(
    "/admin/menu-items"
  );

  return response.data;
};

export const getMenuItem = async (id) => {
  const response = await api.get(
    `/admin/menu-items/${id}`
  );

  return response.data;
};

// =========================================================
// CREATE MENU ITEM
// =========================================================

export const createMenuItem = async (data) => {
  const formData = new FormData();

  formData.append(
    "name",
    data.name
  );

  formData.append(
    "price",
    data.price
  );

  if (data.category_id) {
    formData.append(
      "category_id",
      data.category_id
    );
  }

  if (data.label) {
    formData.append(
      "label",
      data.label
    );
  }

  if (data.description) {
    formData.append(
      "description",
      data.description
    );
  }

  // =======================================================
  // FOTO FILE
  // =======================================================

  if (data.photo) {
    formData.append(
      "photo",
      data.photo
    );
  }

  // =======================================================
  // FOTO URL
  // =======================================================

  if (data.photo_url) {
    formData.append(
      "photo_url",
      data.photo_url
    );
  }

  formData.append(
    "is_active",
    data.is_active ? "1" : "0"
  );

  const response = await api.post(
    "/admin/menu-items",
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  );

  return response.data;
};

// =========================================================
// UPDATE MENU ITEM
// =========================================================

export const updateMenuItem = async (
  id,
  data
) => {
  const formData = new FormData();

  formData.append(
    "name",
    data.name
  );

  formData.append(
    "price",
    data.price
  );

  if (data.category_id) {
    formData.append(
      "category_id",
      data.category_id
    );
  }

  if (data.label) {
    formData.append(
      "label",
      data.label
    );
  }

  if (data.description) {
    formData.append(
      "description",
      data.description
    );
  }

  // Foto file baru
  if (data.photo) {
    formData.append(
      "photo",
      data.photo
    );
  }

  // URL foto
  if (data.photo_url) {
    formData.append(
      "photo_url",
      data.photo_url
    );
  }

  formData.append(
    "is_active",
    data.is_active ? "1" : "0"
  );

  // Laravel method spoofing
  formData.append(
    "_method",
    "PUT"
  );

  const response = await api.post(
    `/admin/menu-items/${id}`,
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  );

  return response.data;
};

// =========================================================
// DELETE MENU ITEM
// =========================================================

export const deleteMenuItem = async (id) => {
  const response = await api.delete(
    `/admin/menu-items/${id}`
  );

  return response.data;
};

// =========================================================
// ADDONS
// =========================================================

export const getAddons = async () => {
  const response = await api.get(
    "/admin/addons"
  );

  return response.data;
};

export const createAddon = async (data) => {
  const response = await api.post(
    "/admin/addons",
    data
  );

  return response.data;
};

export const updateAddon = async (
  id,
  data
) => {
  const response = await api.put(
    `/admin/addons/${id}`,
    data
  );

  return response.data;
};

export const deleteAddon = async (id) => {
  const response = await api.delete(
    `/admin/addons/${id}`
  );

  return response.data;
};

// =========================================================
// BUNDLES
// =========================================================

export const getBundles = async () => {
  const response = await api.get(
    "/admin/bundles"
  );

  return response.data;
};

export const createBundle = async (data) => {
  const response = await api.post(
    "/admin/bundles",
    data
  );

  return response.data;
};

export const updateBundle = async (
  id,
  data
) => {
  const response = await api.put(
    `/admin/bundles/${id}`,
    data
  );

  return response.data;
};

export const deleteBundle = async (id) => {
  const response = await api.delete(
    `/admin/bundles/${id}`
  );

  return response.data;
};