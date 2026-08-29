import axios from "axios";

const api = axios.create({
baseURL: "http://localhost:8000/api/v1",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// =========================================================
// TAMBAHKAN TOKEN OTOMATIS KE SETIAP REQUEST
// =========================================================

export const createMenuCategory = async (payload) => {
  return await axios.post(`${BASE_URL}/categories`, payload); // Sesuaikan endpoint API Anda
};

export const updateMenuCategory = async (id, payload) => {
  return await axios.put(`${BASE_URL}/categories/${id}`, payload);
};

export const deleteMenuCategory = async (id) => {
  return await axios.delete(`${BASE_URL}/categories/${id}`);
};
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("admin_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;