import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { customersService } from "@/services/customers.service";
import { movementsService } from "@/services/movements.service";
import { ordersService } from "@/services/orders.service";
import { redemptionsService } from "@/services/redemptions.service";
import { walletService } from "@/services/wallet.service";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function CustomerDetail() {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [balance, setBalance] = useState(null);
  const [movements, setMovements] = useState([]);
  const [orders, setOrders] = useState([]);
  const [redemptions, setRedemptions] = useState([]);
  const [busy, setBusy] = useState(false);

  async function loadAll() {
    setBusy(true);
    try {
      const [c, b, m, o, r] = await Promise.all([
        customersService.get(id),
        customersService.balance(id),
        movementsService.list({ customerId: id }),
        ordersService.list({ customerId: id }),
        redemptionsService.list({ customerId: id }),
      ]);
      setCustomer(c);
      setBalance(b);
      setMovements(m || []);
      setOrders(o || []);
      setRedemptions(r || []);
    } catch (e) {
      toast.error("No se pudo cargar detalle del cliente.");
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function createWalletLink() {
    setBusy(true);
    try {
      const data = await walletService.addLink(id);
      if (data?.addLink) {
        navigator.clipboard?.writeText(data.addLink);
        toast.success("Link copiado. Envíalo por WhatsApp.");
      } else {
        toast.message("Respuesta recibida.");
      }
    } catch {
      toast.error("No se pudo generar link de Wallet.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <CardTitle>Cliente</CardTitle>
          <div className="flex gap-2">
            <Button disabled={busy} variant="outline" onClick={createWalletLink}>
              Crear/Obtener link Wallet
            </Button>
            <Button disabled={busy} onClick={loadAll}>
              Refrescar
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-sm">
            <span className="font-medium">Teléfono:</span> {customer?.phone || "—"}
          </div>
          <div className="text-sm">
            <span className="font-medium">Saldo:</span>{" "}
            {balance?.balancePoints ?? "—"} pts
          </div>
          <div className="text-xs text-muted-foreground">
            El saldo se calcula desde el ledger (movimientos).
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Movimientos</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="text-right">Puntos</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {movements.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell>{new Date(m.createdAt).toLocaleString()}</TableCell>
                    <TableCell>{m.type}</TableCell>
                    <TableCell className="text-right">{Number(m.points).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
                {movements.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-muted-foreground">
                      Sin movimientos.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pedidos</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead className="text-right">Puntos</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((o) => (
                    <TableRow key={o.id}>
                      <TableCell>{new Date(o.createdAt).toLocaleString()}</TableCell>
                      <TableCell className="text-right">{Number(o.totalPoints).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                  {orders.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={2} className="text-muted-foreground">
                        Sin pedidos.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Canjes</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Recompensa</TableHead>
                    <TableHead className="text-right">Puntos</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {redemptions.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell>{new Date(r.createdAt).toLocaleString()}</TableCell>
                      <TableCell>{r.reward?.name || "—"}</TableCell>
                      <TableCell className="text-right">-{Number(r.pointsSpent).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                  {redemptions.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-muted-foreground">
                        Sin canjes.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator />
    </div>
  );
}
