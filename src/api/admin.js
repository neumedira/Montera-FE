import api from "./axios";

export const loginAdmin = async (username, password) => {
  const response = await api.post("/admin/login", {
    login: username,
    password,
  });

  // Ambil token dari response backend
  const token = response.data?.data?.token;

  // Simpan token
  if (token) {
    localStorage.setItem("admin_token", token);
  }

  return response.data;
};