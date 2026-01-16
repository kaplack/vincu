import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import QRScanner from "@/components/qr/QRScanner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { customersService } from "@/services/customers.service";
import { productsService } from "@/services/products.service";
import { ordersService } from "@/services/orders.service";
import { rewardsService } from "@/services/rewards.service";
import { redemptionsService } from "@/services/redemptions.service";

export default function POS() {
  const [phone, setPhone] = useState("");
  const [customer, setCustomer] = useState(null);
  const [products, setProducts] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [cart, setCart] = useState([]); // {productId, name, qty, pointsPerUnit}
  const [busy, setBusy] = useState(false);

  const totalPoints = useMemo(() => {
    return cart.reduce((sum, it) => sum + Number(it.pointsPerUnit) * Number(it.qty), 0);
  }, [cart]);

  useEffect(() => {
    async function load() {
      try {
        const [p, r] = await Promise.all([productsService.list(), rewardsService.list()]);
        setProducts(p || []);
        setRewards(r || []);
      } catch (e) {
        toast.error("No se pudo cargar catálogo.");
      }
    }
    load();
  }, []);

  function addToCart(product) {
    setCart((prev) => {
      const idx = prev.findIndex((x) => x.productId === product.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty: Number(copy[idx].qty) + 1 };
        return copy;
      }
      return [
        ...prev,
        { productId: product.id, name: product.name, qty: 1, pointsPerUnit: product.pointsPerUnit },
      ];
    });
  }

  function updateQty(productId, qty) {
    const v = Number(qty);
    if (Number.isNaN(v) || v <= 0) {
      setCart((prev) => prev.filter((x) => x.productId !== productId));
      return;
    }
    setCart((prev) => prev.map((x) => (x.productId === productId ? { ...x, qty: v } : x)));
  }

  async function findOrCreate() {
    const p = phone.trim();
    if (!p) return toast.warning("Ingresa teléfono.");
    setBusy(true);
    try {
      const data = await customersService.findOrCreateByPhone(p);
      setCustomer(data);
      toast.success("Cliente listo.");
    } catch (e) {
      toast.error("No se pudo buscar/crear cliente.");
    } finally {
      setBusy(false);
    }
  }

  async function onQrResult(text) {
    setBusy(true);
    try {
      const data = await customersService.byQr(text);
      setCustomer(data);
      toast.success("Cliente identificado por QR.");
    } catch (e) {
      toast.error("QR no encontrado.");
    } finally {
      setBusy(false);
    }
  }

  async function quickAddOnePoint() {
    if (!customer?.id) return toast.warning("Primero identifica un cliente.");
    setBusy(true);
    try {
      const data = await ordersService.quickAddPoint({ customerId: customer.id });
      toast.success(`+1 punto. Nuevo saldo: ${data?.balance ?? ""}`);
    } catch (e) {
      toast.error("No se pudo sumar el punto.");
    } finally {
      setBusy(false);
    }
  }

  async function createOrder() {
    if (!customer?.id) return toast.warning("Primero identifica un cliente.");
    if (cart.length === 0) return toast.warning("Carrito vacío.");
    setBusy(true);
    try {
      const payload = {
        customerId: customer.id,
        items: cart.map((x) => ({ productId: x.productId, qty: x.qty })),
      };
      const data = await ordersService.create(payload);
      toast.success(`Pedido registrado. +${data?.earnedPoints ?? totalPoints} pts`);
      setCart([]);
    } catch (e) {
      toast.error("No se pudo registrar el pedido.");
    } finally {
      setBusy(false);
    }
  }

  async function redeemReward(rewardId) {
    if (!customer?.id) return toast.warning("Primero identifica un cliente.");
    setBusy(true);
    try {
      const data = await redemptionsService.create({ customerId: customer.id, rewardId });
      toast.success(`Canje confirmado. -${data?.pointsSpent ?? ""} pts`);
    } catch (e) {
      toast.error("No se pudo canjear.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Punto de venta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-2">
                <div className="text-sm font-medium">Buscar por teléfono</div>
                <div className="flex gap-2">
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ej: 999888777"
                  />
                  <Button disabled={busy} onClick={findOrCreate}>
                    Buscar/Crear
                  </Button>
                </div>

                <div className="text-xs text-muted-foreground">
                  Tip: si el cliente no existe, se crea automáticamente.
                </div>
              </div>

              <div>
                <QRScanner onResult={onQrResult} />
              </div>
            </div>

            <Separator />

            <div className="flex flex-wrap gap-2 items-center justify-between">
              <div className="text-sm">
                <span className="font-medium">Cliente:</span>{" "}
                {customer ? customer.phone : "—"}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" disabled={busy || !customer} onClick={quickAddOnePoint}>
                  +1 punto
                </Button>
                <Button disabled={busy || !customer} onClick={createOrder}>
                  Registrar pedido (+{totalPoints} pts)
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Productos (sumar puntos)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {products.map((p) => (
                <Button key={p.id} variant="secondary" onClick={() => addToCart(p)}>
                  {p.name} (+{p.pointsPerUnit})
                </Button>
              ))}
              {products.length === 0 && (
                <div className="text-sm text-muted-foreground">
                  No hay productos. Crea productos en Configuración → Productos.
                </div>
              )}
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="text-sm font-medium">Carrito</div>
              {cart.length === 0 ? (
                <div className="text-sm text-muted-foreground">Agrega productos para registrar el pedido.</div>
              ) : (
                <div className="space-y-2">
                  {cart.map((it) => (
                    <div key={it.productId} className="flex items-center justify-between gap-2">
                      <div className="text-sm">
                        {it.name} <span className="text-muted-foreground">({it.pointsPerUnit} pts/u)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          className="w-24"
                          type="number"
                          min="0"
                          step="1"
                          value={it.qty}
                          onChange={(e) => updateQty(it.productId, e.target.value)}
                        />
                        <div className="text-sm w-20 text-right">
                          {(Number(it.pointsPerUnit) * Number(it.qty)).toFixed(2)} pts
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-end text-sm font-medium">
                    Total: {totalPoints.toFixed(2)} pts
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Recompensas (canje)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {rewards.map((r) => (
              <div key={r.id} className="flex items-center justify-between gap-2">
                <div className="text-sm">
                  {r.name} <span className="text-muted-foreground">({r.costPoints} pts)</span>
                </div>
                <Button disabled={busy || !customer} onClick={() => redeemReward(r.id)}>
                  Canjear
                </Button>
              </div>
            ))}
            {rewards.length === 0 && (
              <div className="text-sm text-muted-foreground">
                No hay recompensas. Crea recompensas en Configuración → Recompensas.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
