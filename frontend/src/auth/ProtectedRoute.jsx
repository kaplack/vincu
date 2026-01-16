import { Navigate, Outlet } from "react-router-dom";
import { authStorage } from "./auth.storage";

export default function ProtectedRoute() {
  const token = authStorage.getToken();

  // 👇 por si alguna vez se guardó "undefined" o "null" como string
  const validToken = token && token !== "undefined" && token !== "null";

  if (!validToken) return <Navigate to="/login" replace />;
  return <Outlet />;
}
