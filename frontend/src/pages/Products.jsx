import { useEffect, useState } from "react";
import { toast } from "sonner";
import { productsService } from "@/services/products.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function Products() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [pointsPerUnit, setPointsPerUnit] = useState("1");
  const [busy, setBusy] = useState(false);

  async function load() {
    setBusy(true);
    try {
      const data = await productsService.list();
      setItems(data || []);
    } catch {
      toast.error("No se pudo cargar productos.");
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function create() {
    const n = name.trim();
    const p = Number(pointsPerUnit);
    if (!n) return toast.warning("Nombre requerido.");
    if (Number.isNaN(p)) return toast.warning("Puntos inválidos.");
    setBusy(true);
    try {
      await productsService.create({ name: n, pointsPerUnit: p, active: true });
      toast.success("Producto creado.");
      setName("");
      setPointsPerUnit("1");
      load();
    } catch {
      toast.error("No se pudo crear producto.");
    } finally {
      setBusy(false);
    }
  }

  async function toggleActive(item) {
    setBusy(true);
    try {
      await productsService.update(item.id, { active: !item.active });
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
        <CardTitle>Productos</CardTitle>
        <div className="flex gap-2 w-full md:w-auto">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre" />
          <Input
            className="w-28"
            value={pointsPerUnit}
            onChange={(e) => setPointsPerUnit(e.target.value)}
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
              <TableHead className="text-right">Puntos/u</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Acción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.name}</TableCell>
                <TableCell className="text-right">{Number(p.pointsPerUnit).toFixed(2)}</TableCell>
                <TableCell>{p.active ? "Activo" : "Inactivo"}</TableCell>
                <TableCell>
                  <Button size="sm" variant="outline" disabled={busy} onClick={() => toggleActive(p)}>
                    {p.active ? "Desactivar" : "Activar"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-muted-foreground">
                  No hay productos.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
