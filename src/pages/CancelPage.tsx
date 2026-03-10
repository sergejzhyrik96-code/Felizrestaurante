import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import Footer from "@/components/Footer";
import { useReservationModal } from "@/components/ReservationModal";

export default function CancelPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const { openReservationModal } = useReservationModal();

  useEffect(() => {
    if (!token?.trim()) {
      setStatus("error");
      setMessage("Enlace inválido. Falta el token de cancelación.");
      return;
    }

    setStatus("loading");

    fetch(`/api/reservations/cancel?token=${encodeURIComponent(token)}`)
      .then((res) => {
        return res.json().then((data) => ({ ok: res.ok, data }));
      })
      .then(({ ok, data }) => {
        if (ok) {
          setStatus("success");
          setMessage("Reserva cancelada correctamente.");
        } else {
          setStatus("error");
          setMessage(data?.error || "No se pudo cancelar la reserva.");
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage("Error de conexión. Inténtalo de nuevo.");
      });
  }, [token]);

  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="mx-auto max-w-lg px-6 py-24 text-center">
        {status === "loading" && (
          <p className="text-muted-foreground">Cancelando reserva…</p>
        )}

        {status === "success" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <CheckCircle size={64} className="mx-auto mb-6 text-primary" />
            <h1 className="font-display text-2xl font-semibold text-foreground md:text-3xl">
              Reserva cancelada correctamente.
            </h1>
            <p className="mt-4 text-muted-foreground">
              Si fue un error, puedes hacer una nueva reserva desde la página de reservas.
            </p>
            <button
              type="button"
              onClick={openReservationModal}
              className="mt-8 inline-block rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition-all hover:bg-primary hover:text-primary-foreground"
            >
              Hacer otra reserva
            </button>
          </motion.div>
        )}

        {status === "error" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-destructive"
          >
            <h1 className="font-display text-2xl font-semibold">Error</h1>
            <p className="mt-4">{message}</p>
            <a
              href="/"
              className="mt-8 inline-block rounded-full border border-border px-6 py-3 text-sm font-semibold transition-all hover:bg-muted"
            >
              Volver al inicio
            </a>
          </motion.div>
        )}
      </div>
      <Footer />
    </div>
  );
}
