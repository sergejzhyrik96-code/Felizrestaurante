import { useState } from "react";
import { format } from "date-fns";
import { CalendarDays, Clock, Users } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

const timeSlots = [
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00",
];

export type ReservationFormValues = {
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  people: number;
  comment: string;
};

type ReservationFormProps = {
  onSuccess?: () => void;
  className?: string;
};

export function ReservationForm({ onSuccess, className }: ReservationFormProps) {
  const { t } = useLanguage();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState("");
  const [guests, setGuests] = useState(2);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [comments, setComments] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = date && time && name.trim() && phone.trim() && email.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || !date) return;

    setLoading(true);
    setError(null);

    const payload = {
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      date: format(date, "yyyy-MM-dd"),
      time,
      people: guests,
      comment: comments.trim(),
    };

    try {
      const res = await fetch("/api/reservations/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || "Error al crear la reserva");
        return;
      }

      onSuccess?.();
    } catch (err) {
      setError("Error de conexión. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-6", className)}>
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card-hover">
          <div className="mb-4 flex items-center gap-2">
            <CalendarDays size={20} className="text-primary" />
            <h3 className="font-display text-lg font-semibold text-foreground">{t("reservation.selectDate")}</h3>
          </div>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            disabled={(d) => d < new Date()}
            className={cn("pointer-events-auto mx-auto p-3")}
          />

          <div className="mt-6">
            <div className="mb-3 flex items-center gap-2">
              <Clock size={20} className="text-primary" />
              <h3 className="font-display text-lg font-semibold text-foreground">{t("reservation.selectTime")}</h3>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {timeSlots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setTime(slot)}
                  className={cn(
                    "rounded-lg py-2 text-sm font-medium transition-all",
                    time === slot
                      ? "bg-foreground text-background shadow-luxury"
                      : "bg-secondary text-muted-foreground hover:bg-muted"
                  )}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <div className="mb-3 flex items-center gap-2">
              <Users size={20} className="text-primary" />
              <h3 className="font-display text-lg font-semibold text-foreground">{t("reservation.guests")}</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setGuests(n)}
                  className={cn(
                    "h-10 w-10 rounded-full text-sm font-semibold transition-all",
                    guests === n ? "bg-foreground text-background" : "bg-secondary text-muted-foreground hover:bg-muted"
                  )}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-card-hover">
          <h3 className="mb-6 font-display text-lg font-semibold text-foreground">{t("reservation.yourDetails")}</h3>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">{t("reservation.name")} *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder={t("reservation.namePlaceholder")}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">{t("reservation.phone")} *</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder={t("reservation.phonePlaceholder")}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">{t("reservation.email")} *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder={t("reservation.emailPlaceholder")}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">{t("reservation.specialRequests")}</label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={4}
                className="resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary w-full"
                placeholder={t("reservation.commentsPlaceholder")}
              />
            </div>
          </div>

          {date && time && (
            <div className="mt-6 rounded-xl bg-secondary p-4">
              <h4 className="text-sm font-semibold text-foreground">{t("reservation.summary")}</h4>
              <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                <p>📅 {date.toLocaleDateString("es-ES", { weekday: "long", month: "long", day: "numeric" })}</p>
                <p>🕐 {time}</p>
                <p>👥 {guests} {guests === 1 ? "persona" : "personas"}</p>
              </div>
            </div>
          )}

          {error && (
            <p className="mt-4 text-sm text-destructive">{error}</p>
          )}

          <button
            type="submit"
            disabled={!canSubmit || loading}
            className="mt-6 w-full rounded-full bg-gradient-gold px-8 py-4 text-sm font-semibold text-white shadow-glow transition-all hover:scale-[1.01] hover:shadow-lg disabled:opacity-50 disabled:hover:scale-100"
          >
            {loading ? "Enviando…" : t("reservation.confirm")}
          </button>
        </div>
      </div>
    </form>
  );
}
