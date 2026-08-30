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

    if (data.bannerImage instanceof File) {
      formData.append(
        "business_profile[banner_image]",
        data.bannerImage
      );
    }
  }

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

  if (Array.isArray(data.payment_settings)) {
    data.payment_settings.forEach((payment, index) => {
      formData.append(
        `payment_settings[${index}][method]`,
        payment.method ??
          payment.type ??
          ""
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

      if (payment.qr_image instanceof File) {
        formData.append(
          `payment_settings[${index}][qr_image]`,
          payment.qr_image
        );
      }
    });
  }

  console.log("UPDATE SETTINGS FORMDATA:");

  for (const [key, value] of formData.entries()) {
    console.log(
      key,
      value instanceof File
        ? {
            name: value.name,
            type: value.type,
            size: value.size,
          }
        : value
    );
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
// DELETE PAYMENT METHOD
// =========================================================

export const deletePaymentMethod = async (id) => {
  const response = await api.delete(
    `/admin/settings/payment-methods/${id}`
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
    data.name ?? ""
  );

  formData.append(
    "price",
    data.price ?? 0
  );

  if (
    data.category_id !== null &&
    data.category_id !== undefined &&
    data.category_id !== ""
  ) {
    formData.append(
      "category_id",
      data.category_id
    );
  }

  formData.append(
    "label",
    data.label ?? ""
  );

  formData.append(
    "description",
    data.description ?? ""
  );

  // =======================================================
  // FOTO BARU
  // =======================================================

  if (data.photo instanceof File) {
    formData.append(
      "photo",
      data.photo
    );
  }

  // =======================================================
  // FOTO URL
  // =======================================================

  if (
    data.photo_url &&
    typeof data.photo_url === "string"
  ) {
    formData.append(
      "photo_url",
      data.photo_url
    );
  }

  // =======================================================
  // STATUS MENU
  // =======================================================

  formData.append(
    "is_active",
    data.is_active ? "1" : "0"
  );

  // =======================================================
  // ADDONS
  // =======================================================

  if (Array.isArray(data.addon_ids)) {
    data.addon_ids.forEach((addonId) => {
      formData.append(
        "addon_ids[]",
        addonId
      );
    });
  }

  console.log("CREATE MENU FORMDATA:");

  for (const [key, value] of formData.entries()) {
    console.log(
      key,
      value instanceof File
        ? {
            name: value.name,
            type: value.type,
            size: value.size,
          }
        : value
    );
  }

  const response = await api.post(
    "/admin/menu-items",
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
// UPDATE MENU ITEM
// =========================================================

export const updateMenuItem = async (id, data) => {
  const formData = new FormData();

  formData.append(
    "name",
    data.name ?? ""
  );

  formData.append(
    "price",
    data.price ?? 0
  );

  if (
    data.category_id !== null &&
    data.category_id !== undefined &&
    data.category_id !== ""
  ) {
    formData.append(
      "category_id",
      data.category_id
    );
  }

  formData.append(
    "label",
    data.label ?? ""
  );

  formData.append(
    "description",
    data.description ?? ""
  );

  // =======================================================
  // FOTO BARU
  //
  // Kalau memilih foto baru, kirim File.
  // =======================================================

  if (data.photo instanceof File) {
    formData.append(
      "photo",
      data.photo
    );
  }

  // =======================================================
  // FOTO LAMA / URL
  //
  // Kalau tidak memilih foto baru tetapi masih memiliki
  // URL foto lama, kirim URL tersebut.
  // =======================================================

  if (
    !(data.photo instanceof File) &&
    data.photo_url &&
    typeof data.photo_url === "string"
  ) {
    formData.append(
      "photo_url",
      data.photo_url
    );
  }

  // =======================================================
  // STATUS MENU
  // =======================================================

  formData.append(
    "is_active",
    data.is_active ? "1" : "0"
  );

  // =======================================================
  // ADDONS
  //
  // PENTING:
  //
  // Jangan lagi menggunakan:
  //
  // addon_ids[]
  //
  // karena ketika array kosong tidak ada field yang
  // terkirim.
  //
  // Sekarang kita selalu kirim addon_ids sebagai JSON.
  //
  // Contoh:
  //
  // [1, 2] -> "[1,2]"
  // []     -> "[]"
  //
  // UpdateMenuItemRequest akan mengubah JSON tersebut
  // kembali menjadi array PHP.
  // =======================================================

  const addonIds = Array.isArray(data.addon_ids)
    ? data.addon_ids
    : [];

  formData.append(
    "addon_ids",
    JSON.stringify(addonIds)
  );

  // =======================================================
  // LARAVEL METHOD SPOOFING
  // =======================================================

  formData.append(
    "_method",
    "PUT"
  );

  // =======================================================
  // DEBUG
  // =======================================================

  console.log("UPDATE MENU FORMDATA:");

  for (const [key, value] of formData.entries()) {
    console.log(
      key,
      value instanceof File
        ? {
            name: value.name,
            type: value.type,
            size: value.size,
          }
        : value
    );
  }

  // =======================================================
  // REQUEST
  // =======================================================

  const response = await api.post(
    `/admin/menu-items/${id}`,
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

export const updateAddon = async (id, data) => {
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

// =========================================================
// CREATE BUNDLE
// =========================================================

export const createBundle = async (data) => {
  const formData = new FormData();

  formData.append(
    "name",
    data.name ?? ""
  );

  formData.append(
    "normal_price",
    data.normal_price ?? 0
  );

  formData.append(
    "bundle_price",
    data.bundle_price ?? 0
  );

  formData.append(
    "is_active",
    data.is_active ? "1" : "0"
  );

  // =======================================================
  // FOTO BARU
  // =======================================================

  if (data.photo instanceof File) {
    formData.append(
      "photo",
      data.photo
    );
  }

  // =======================================================
  // FOTO URL
  // =======================================================

  if (
    data.photo_url &&
    typeof data.photo_url === "string"
  ) {
    formData.append(
      "photo_url",
      data.photo_url
    );
  }

  // =======================================================
  // ITEMS
  // =======================================================

  if (Array.isArray(data.items)) {
    data.items.forEach((item, index) => {
      formData.append(
        `items[${index}][menu_item_id]`,
        item.menu_item_id
      );

      formData.append(
        `items[${index}][quantity]`,
        item.quantity ?? 1
      );
    });
  }

  console.log("CREATE BUNDLE FORMDATA:");

  for (const [key, value] of formData.entries()) {
    console.log(
      key,
      value instanceof File
        ? {
            name: value.name,
            type: value.type,
            size: value.size,
          }
        : value
    );
  }

  const response = await api.post(
    "/admin/bundles",
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
// UPDATE BUNDLE
// =========================================================

export const updateBundle = async (id, data) => {
  const formData = new FormData();

  formData.append(
    "name",
    data.name ?? ""
  );

  formData.append(
    "normal_price",
    data.normal_price ?? 0
  );

  formData.append(
    "bundle_price",
    data.bundle_price ?? 0
  );

  formData.append(
    "is_active",
    data.is_active ? "1" : "0"
  );

  // =======================================================
  // FOTO BARU
  // =======================================================

  if (data.photo instanceof File) {
    formData.append(
      "photo",
      data.photo
    );
  }

  // =======================================================
  // FOTO LAMA
  // =======================================================

  if (
    !(data.photo instanceof File) &&
    data.photo_url &&
    typeof data.photo_url === "string"
  ) {
    formData.append(
      "photo_url",
      data.photo_url
    );
  }

  // =======================================================
  // ITEMS
  // =======================================================

  if (Array.isArray(data.items)) {
    data.items.forEach((item, index) => {
      formData.append(
        `items[${index}][menu_item_id]`,
        item.menu_item_id
      );

      formData.append(
        `items[${index}][quantity]`,
        item.quantity ?? 1
      );
    });
  }

  // =======================================================
  // LARAVEL METHOD SPOOFING
  // =======================================================

  formData.append(
    "_method",
    "PUT"
  );

  console.log("UPDATE BUNDLE FORMDATA:");

  for (const [key, value] of formData.entries()) {
    console.log(
      key,
      value instanceof File
        ? {
            name: value.name,
            type: value.type,
            size: value.size,
          }
        : value
    );
  }

  const response = await api.post(
    `/admin/bundles/${id}`,
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
// DELETE BUNDLE
// =========================================================

export const deleteBundle = async (id) => {
  const response = await api.delete(
    `/admin/bundles/${id}`
  );

  return response.data;
};

// =========================================================
// TABLES / QR TABLE
// =========================================================

export const getTables = async () => {
  const response = await api.get("/admin/tables");

  return response.data;
};

export const createTable = async (data) => {
  const response = await api.post(
    "/admin/tables",
    data
  );

  return response.data;
};

export const updateTable = async (id, data) => {
  const response = await api.put(
    `/admin/tables/${id}`,
    data
  );

  return response.data;
};

export const deleteTable = async (id) => {
  const response = await api.delete(
    `/admin/tables/${id}`
  );

  return response.data;
};