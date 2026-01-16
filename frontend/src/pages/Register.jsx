import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { authService } from "@/auth/auth.service";

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    businessName: "",
    fullName: "",
    email: "",
    password: "",
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.register(form);
      toast.success("Cuenta creada");
      navigate("/app/dashboard");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error al registrar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Crear cuenta</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-3" onSubmit={onSubmit}>
            <div className="space-y-1">
              <label className="text-sm">Nombre del negocio</label>
              <Input
                value={form.businessName}
                onChange={(e) =>
                  setForm((s) => ({ ...s, businessName: e.target.value }))
                }
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm">Nombre completo</label>
              <Input
                value={form.fullName}
                onChange={(e) =>
                  setForm((s) => ({ ...s, fullName: e.target.value }))
                }
                placeholder="Ej. Alan Burga"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm">Email</label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((s) => ({ ...s, email: e.target.value }))
                }
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm">Contraseña</label>
              <Input
                type="password"
                value={form.password}
                onChange={(e) =>
                  setForm((s) => ({ ...s, password: e.target.value }))
                }
                required
              />
            </div>

            <Button className="w-full" disabled={loading}>
              {loading ? "Creando..." : "Crear cuenta"}
            </Button>

            <p className="text-sm text-muted-foreground">
              ¿Ya tienes cuenta?{" "}
              <Link className="underline" to="/login">
                Inicia sesión
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
