import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.1.19:8000/api/v1/",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default api;