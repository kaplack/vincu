import { Routes, Route, Navigate } from "react-router-dom";

import PublicLayout from "@/components/layout/PublicLayout";
import ProtectedRoute from "@/auth/ProtectedRoute";
import AppShell from "@/components/layout/AppShell";

import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import POS from "@/pages/POS";
import Customers from "@/pages/Customers";
import CustomerDetail from "@/pages/CustomerDetail";
import Products from "@/pages/Products";
import Rewards from "@/pages/Rewards";
import Redemptions from "@/pages/Redemptions";
import Reports from "@/pages/Reports";

export default function AppRouter() {
  return (
    <Routes>
      {/* PUBLIC */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* PRIVATE */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route path="/app" element={<Navigate to="/app/dashboard" replace />} />
          <Route path="/app/dashboard" element={<Dashboard />} />
          <Route path="/app/pos" element={<POS />} />
          <Route path="/app/customers" element={<Customers />} />
          <Route path="/app/customers/:id" element={<CustomerDetail />} />
          <Route path="/app/products" element={<Products />} />
          <Route path="/app/rewards" element={<Rewards />} />
          <Route path="/app/redemptions" element={<Redemptions />} />
          <Route path="/app/reports" element={<Reports />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
