import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { LogOut, RefreshCw, Check, X, Trash2 } from "lucide-react";

type ReservationRow = {
  id: string;
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  people: number;
  status: string;
  created_at: string;
};

type ListResponse = {
  today: ReservationRow[];
  upcoming: ReservationRow[];
};

const API_BASE = "/api/admin";

function fetchWithAuth(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  return fetch(input, { ...init, credentials: "include" });
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");
  const [today, setToday] = useState<ReservationRow[]>([]);
  const [upcoming, setUpcoming] = useState<ReservationRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadReservations = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchWithAuth(`${API_BASE}/reservations`);
      if (res.status === 401) {
        setIsAuthenticated(false);
        return;
      }
      if (!res.ok) return;
      const data: ListResponse = await res.json();
      setToday(data.today || []);
      setUpcoming(data.upcoming || []);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    const res = await fetchWithAuth(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      setIsAuthenticated(true);
      loadReservations();
    } else {
      setAuthError(data.error || "Contraseña incorrecta");
    }
  };

  const handleLogout = async () => {
    await fetchWithAuth(`${API_BASE}/login`, { method: "DELETE" });
    setIsAuthenticated(false);
    setToday([]);
    setUpcoming([]);
  };

  const updateStatus = async (id: string, status: "confirmed" | "cancelled") => {
    setActionLoading(id);
    try {
      const res = await fetchWithAuth(`${API_BASE}/reservations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) await loadReservations();
    } finally {
      setActionLoading(null);
    }
  };

  const deleteReservation = async (id: string) => {
    if (!confirm("¿Eliminar esta reserva?")) return;
    setActionLoading(id);
    try {
      const res = await fetchWithAuth(`${API_BASE}/reservations/${id}`, { method: "DELETE" });
      if (res.ok) await loadReservations();
    } finally {
      setActionLoading(null);
    }
  };

  useEffect(() => {
    if (isAuthenticated) loadReservations();
  }, [isAuthenticated, loadReservations]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background pt-24 flex items-center justify-center px-6">
        <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-card-hover">
          <h1 className="font-display text-2xl font-semibold text-foreground">Admin — Reservas</h1>
          <p className="mt-2 text-sm text-muted-foreground">Introduce la contraseña de administrador.</p>
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              autoFocus
            />
            {authError && <p className="text-sm text-destructive">{authError}</p>}
            <button
              type="submit"
              className="w-full rounded-full bg-foreground py-3 text-sm font-semibold text-background transition-all hover:bg-primary"
            >
              Entrar
            </button>
          </form>
          <Link to="/" className="mt-4 block text-center text-sm text-muted-foreground hover:text-foreground">
            ← Volver al sitio
          </Link>
        </div>
      </div>
    );
  }

  const columns = ["Nombre", "Teléfono", "Fecha", "Hora", "Personas", "Estado", "Acciones"];

  const TableSection = ({ title, rows }: { title: string; rows: ReservationRow[] }) => (
    <div className="mb-10">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold text-foreground">{title}</h2>
        <button
          type="button"
          onClick={loadReservations}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Actualizar
        </button>
      </div>
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              {columns.map((c) => (
                <th key={c} className="px-4 py-3 font-semibold text-foreground">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                  No hay reservas
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3">{r.name}</td>
                  <td className="px-4 py-3">{r.phone}</td>
                  <td className="px-4 py-3">{r.date}</td>
                  <td className="px-4 py-3">{r.time}</td>
                  <td className="px-4 py-3">{r.people}</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        r.status === "cancelled"
                          ? "text-destructive"
                          : "text-foreground"
                      }
                    >
                      {r.status === "confirmed" ? "Confirmada" : "Cancelada"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {r.status !== "confirmed" && (
                        <button
                          type="button"
                          onClick={() => updateStatus(r.id, "confirmed")}
                          disabled={actionLoading === r.id}
                          className="rounded p-1.5 text-foreground hover:bg-muted"
                          title="Confirmar"
                        >
                          <Check size={18} />
                        </button>
                      )}
                      {r.status !== "cancelled" && (
                        <button
                          type="button"
                          onClick={() => updateStatus(r.id, "cancelled")}
                          disabled={actionLoading === r.id}
                          className="rounded p-1.5 text-foreground hover:bg-muted"
                          title="Cancelar"
                        >
                          <X size={18} />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => deleteReservation(r.id)}
                        disabled={actionLoading === r.id}
                        className="rounded p-1.5 text-destructive hover:bg-muted"
                        title="Eliminar"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background pt-24 pb-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="font-display text-3xl font-semibold text-foreground">Panel de reservas</h1>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
          >
            <LogOut size={18} />
            Cerrar sesión
          </button>
        </div>

        <TableSection title="Reservas de hoy" rows={today} />
        <TableSection title="Próximas reservas" rows={upcoming} />

        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
          ← Volver al sitio
        </Link>
      </div>
    </div>
  );
}
