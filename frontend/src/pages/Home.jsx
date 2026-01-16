import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { authStorage } from "@/auth/auth.storage";

export default function Home() {
  const isAuthed = !!authStorage.getToken();

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-12">
      {/* HERO */}
      <section className="grid gap-8 lg:grid-cols-2 items-center">
        <div className="space-y-5">
          <Badge variant="secondary">Sin app • Google Wallet</Badge>

          <h1 className="text-4xl font-bold tracking-tight">
            Tarjetas de lealtad modernas, en minutos.
          </h1>

          <p className="text-lg text-muted-foreground max-w-xl">
            VINCU te permite fidelizar clientes con una tarjeta en Google
            Wallet. Acumulan puntos automáticamente y canjean recompensas sin
            fricción.
          </p>

          <div className="flex gap-3">
            {isAuthed ? (
              <Button asChild>
                <Link to="/app/dashboard">Ir al panel</Link>
              </Button>
            ) : (
              <>
                <Button asChild>
                  <Link to="/register">Crear mi programa</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/login">Ingresar</Link>
                </Button>
              </>
            )}
          </div>

          <div className="text-sm text-muted-foreground">
            Ideal para delivery y negocios pequeños que quieren repetir
            clientes.
          </div>
        </div>

        {/* BLOQUE VISUAL (placeholder) */}
        <Card className="lg:justify-self-end w-full">
          <CardHeader>
            <CardTitle className="text-base">
              Así se ve para tu cliente
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>• Una tarjeta en Google Wallet con tu marca</p>
            <p>• Un QR único por cliente</p>
            <p>• Saldo de puntos siempre actualizado</p>
            <div className="mt-4 rounded-lg border bg-muted/30 p-4">
              (Aquí luego ponemos una imagen mock de tarjeta / screenshot)
            </div>
          </CardContent>
        </Card>
      </section>

      {/* BENEFICIOS */}
      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Cero fricción</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            El cliente no instala nada: guarda su tarjeta y listo.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Automático</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Cada compra actualiza puntos y saldo de forma inmediata.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recompensas flexibles</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Tú defines catálogo y costos en puntos. El cliente decide cuándo
            canjear.
          </CardContent>
        </Card>
      </section>

      {/* CTA FINAL */}
      <section className="rounded-xl border bg-muted/30 p-8 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">
            ¿Listo para fidelizar sin complicarte?
          </h2>
          <p className="text-sm text-muted-foreground">
            Crea tu programa y empieza con tu primera tarjeta.
          </p>
        </div>

        <Button asChild>
          <Link to={isAuthed ? "/app/dashboard" : "/register"}>
            {isAuthed ? "Ir al panel" : "Crear cuenta"}
          </Link>
        </Button>
      </section>
    </div>
  );
}
