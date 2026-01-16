import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { reportsService } from "@/services/reports.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, ShoppingCart, Gift, TrendingUp, QrCode } from "lucide-react";

function StatCard({ title, value, icon: Icon, hint }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value ?? "—"}</div>
        {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await reportsService.summary();
        setSummary(data);
      } catch {
        // backend may not be ready yet; keep UI stable
        toast.message("Reportes aún no disponibles.");
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard title="Clientes" value={summary?.customersCount} icon={Users} />
        <StatCard title="Pedidos" value={summary?.ordersCount} icon={ShoppingCart} />
        <StatCard title="Canjes" value={summary?.redemptionsCount} icon={Gift} />
        <StatCard title="Puntos emitidos" value={summary?.pointsEarnedTotal} icon={TrendingUp} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Accesos rápidos</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button asChild>
            <Link to="/app/pos">
              <QrCode className="h-4 w-4 mr-2" /> POS (QR + puntos)
            </Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link to="/app/customers">Clientes</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link to="/app/reports">Reportes</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
