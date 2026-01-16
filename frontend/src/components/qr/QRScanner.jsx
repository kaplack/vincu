import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/**
 * QRScanner
 * Uses html5-qrcode if camera is available. Falls back to manual input.
 *
 * Props:
 * - onResult(text: string)
 */
export default function QRScanner({ onResult }) {
  const readerId = useMemo(() => `qr-reader-${Math.random().toString(16).slice(2)}`, []);
  const qrRef = useRef(null);
  const [status, setStatus] = useState("idle"); // idle | running | stopped | error
  const [manual, setManual] = useState("");

  useEffect(() => {
    let qr;
    let cancelled = false;

    async function start() {
      try {
        const mod = await import("html5-qrcode");
        const { Html5Qrcode } = mod;
        if (cancelled) return;

        qr = new Html5Qrcode(readerId);
        qrRef.current = qr;

        setStatus("running");
        await qr.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 220, height: 220 } },
          (decodedText) => {
            // Stop after first successful scan to prevent duplicates
            try {
              onResult?.(decodedText);
            } finally {
              stop();
            }
          }
        );
      } catch (e) {
        setStatus("error");
      }
    }

    async function stop() {
      try {
        if (!qrRef.current) return;
        const state = qrRef.current.getState?.();
        if (state === 2 /* SCANNING */ || status === "running") {
          await qrRef.current.stop();
        }
        await qrRef.current.clear?.();
      } catch {
        // ignore
      } finally {
        setStatus("stopped");
      }
    }

    // expose stop for cleanup
    QRScanner.__stop = stop;

    start();
    return () => {
      cancelled = true;
      stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [readerId]);

  async function stop() {
    try {
      await QRScanner.__stop?.();
    } catch {
      // ignore
    }
  }

  return (
    <div className="space-y-3">
      <div className="rounded-lg border bg-background p-3">
        <div className="text-sm font-medium mb-2">Escanear QR</div>

        <div className="grid gap-3 md:grid-cols-2 items-start">
          <div>
            <div id={readerId} className="w-full" />
            <p className="mt-2 text-xs text-muted-foreground">
              {status === "running"
                ? "Apunta la cámara al QR."
                : status === "error"
                ? "No se pudo acceder a la cámara. Usa el ingreso manual."
                : "Listo."}
            </p>
          </div>

          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">
              Alternativa: pega el texto del QR
            </div>
            <div className="flex gap-2">
              <Input
                value={manual}
                onChange={(e) => setManual(e.target.value)}
                placeholder="qrCodeValue..."
              />
              <Button
                type="button"
                onClick={() => manual.trim() && onResult?.(manual.trim())}
              >
                Usar
              </Button>
            </div>

            <Button type="button" variant="outline" onClick={stop}>
              Detener cámara
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
