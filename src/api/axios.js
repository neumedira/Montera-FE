import axios from "axios";

const api = axios.create({
  baseURL: "http://10.174.91.209:8000/api/v1",
  headers: {
    Accept: "application/json",
  },
});


// =========================================================
// TOKEN OTOMATIS
// =========================================================

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("admin_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Jangan paksa Content-Type JSON.
    // Kalau FormData, Axios akan menentukan multipart boundary sendiri.
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    } else {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;