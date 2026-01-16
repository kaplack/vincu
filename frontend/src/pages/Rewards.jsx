import { useEffect, useState } from "react";
import { toast } from "sonner";
import { rewardsService } from "@/services/rewards.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function Rewards() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [costPoints, setCostPoints] = useState("10");
  const [busy, setBusy] = useState(false);

  async function load() {
    setBusy(true);
    try {
      const data = await rewardsService.list();
      setItems(data || []);
    } catch {
      toast.error("No se pudo cargar recompensas.");
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function create() {
    const n = name.trim();
    const p = Number(costPoints);
    if (!n) return toast.warning("Nombre requerido.");
    if (Number.isNaN(p)) return toast.warning("Puntos inválidos.");
    setBusy(true);
    try {
      await rewardsService.create({ name: n, costPoints: p, active: true });
      toast.success("Recompensa creada.");
      setName("");
      setCostPoints("10");
      load();
    } catch {
      toast.error("No se pudo crear recompensa.");
    } finally {
      setBusy(false);
    }
  }

  async function toggleActive(item) {
    setBusy(true);
    try {
      await rewardsService.update(item.id, { active: !item.active });
      load();
    } catch {
      toast.error("No se pudo actualizar.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <CardTitle>Recompensas</CardTitle>
        <div className="flex gap-2 w-full md:w-auto">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre" />
          <Input
            className="w-28"
            value={costPoints}
            onChange={(e) => setCostPoints(e.target.value)}
            placeholder="Puntos"
            type="number"
            step="0.5"
          />
          <Button disabled={busy} onClick={create}>
            Crear
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead className="text-right">Costo</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Acción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-medium">{r.name}</TableCell>
                <TableCell className="text-right">{Number(r.costPoints).toFixed(2)}</TableCell>
                <TableCell>{r.active ? "Activo" : "Inactivo"}</TableCell>
                <TableCell>
                  <Button size="sm" variant="outline" disabled={busy} onClick={() => toggleActive(r)}>
                    {r.active ? "Desactivar" : "Activar"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-muted-foreground">
                  No hay recompensas.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
