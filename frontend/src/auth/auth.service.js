import axios from "axios";
import { authStorage } from "./auth.storage";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
});

api.interceptors.request.use((config) => {
  const token = authStorage.getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authService = {
  async login({ email, password }) {
    const { data } = await api.post("/auth/login", { email, password });
    // Esperado: { token, user }
    authStorage.setToken(data.token);
    authStorage.setUser(data.user);
    return data;
  },

  async register({ businessName, fullName, email, password }) {
    const { data } = await api.post("/auth/register", {
      businessName,
      fullName,
      email,
      password,
    });
    // Esperado: { token, user }
    authStorage.setToken(data.token);
    authStorage.setUser(data.user);
    return data;
  },

  logout() {
    authStorage.clearAll();
  },

  getMe() {
    return authStorage.getUser();
  },
};
