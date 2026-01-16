import { useEffect, useState } from "react";
import { toast } from "sonner";
import { reportsService } from "@/services/reports.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

function Stat({ title, value }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold">{value ?? "—"}</div>
      </CardContent>
    </Card>
  );
}

export default function Reports() {
  const [summary, setSummary] = useState(null);
  const [topCustomers, setTopCustomers] = useState([]);
  const [rewardUsage, setRewardUsage] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const [s, t, u] = await Promise.all([
          reportsService.summary(),
          reportsService.topCustomers(),
          reportsService.rewardsUsage(),
        ]);
        setSummary(s);
        setTopCustomers(t || []);
        setRewardUsage(u || []);
      } catch {
        toast.error("No se pudieron cargar reportes.");
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-4">
        <Stat title="Clientes" value={summary?.customersCount} />
        <Stat title="Puntos emitidos" value={summary?.pointsEarnedTotal} />
        <Stat title="Puntos canjeados" value={summary?.pointsRedeemedTotal} />
        <Stat title="Pedidos" value={summary?.ordersCount} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead className="text-right">Saldo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topCustomers.map((c) => (
                  <TableRow key={c.customerId}>
                    <TableCell>{c.phone}</TableCell>
                    <TableCell className="text-right">{Number(c.balancePoints).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
                {topCustomers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={2} className="text-muted-foreground">
                      Sin datos.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Canjes por recompensa</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Recompensa</TableHead>
                  <TableHead className="text-right">Canjes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rewardUsage.map((r) => (
                  <TableRow key={r.rewardId}>
                    <TableCell>{r.name}</TableCell>
                    <TableCell className="text-right">{r.count}</TableCell>
                  </TableRow>
                ))}
                {rewardUsage.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={2} className="text-muted-foreground">
                      Sin datos.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
