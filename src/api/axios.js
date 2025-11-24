import axios from "axios";
import { store } from "@/store/store";
import { logout } from "@/store/authSlice";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/v1/",
});

// Attach token
api.interceptors.request.use((config) => {
  const state = store.getState();
  const token = state.auth.access;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Global error handling
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;
    if (status === 401) {
      store.dispatch(logout());
    }
    return Promise.reject(err);
  }
);

export default api;
