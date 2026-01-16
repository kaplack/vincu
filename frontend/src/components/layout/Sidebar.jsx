import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  QrCode,
  Gift,
  Package,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/app/pos", label: "POS", icon: QrCode },
  { to: "/app/customers", label: "Clientes", icon: Users },
  { to: "/app/products", label: "Productos", icon: Package },
  { to: "/app/rewards", label: "Recompensas", icon: Gift },
  { to: "/app/redemptions", label: "Canjes", icon: Gift },
  { to: "/app/reports", label: "Reportes", icon: BarChart3 },
];

export default function Sidebar() {
  return (
    <aside className="hidden md:block w-64 min-h-screen border-r bg-background">
      <div className="h-16 flex items-center px-6 border-b">
        <span className="text-lg font-semibold">VINCU</span>
      </div>

      <nav className="p-4 space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-muted font-medium text-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )
            }
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
