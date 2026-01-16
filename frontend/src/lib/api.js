import axios from "axios";
import { authStorage } from "@/auth/auth.storage";

/**
 * Shared Axios client for VINCU.
 * - Adds Authorization header when token exists.
 * - Uses VITE_API_URL (should include /api), fallback http://localhost:4000/api
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
});

api.interceptors.request.use((config) => {
  const token = authStorage.getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
