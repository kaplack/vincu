import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { authService } from "@/auth/auth.service";

export default function Topbar() {
  const navigate = useNavigate();

  const onLogout = () => {
    authService.logout();
    navigate("/login");
  };

  return (
    <header className="h-16 border-b bg-background flex items-center justify-between px-6">
      <h1 className="text-lg font-semibold">Panel de Gestión</h1>

      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">Cosa Nostra</span>
        <Button variant="outline" size="sm" onClick={onLogout}>
          Salir
        </Button>
      </div>
    </header>
  );
}
