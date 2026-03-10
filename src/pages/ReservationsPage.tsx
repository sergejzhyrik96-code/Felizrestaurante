import { useState } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { CalendarDays, Clock, Users, Check } from "lucide-react";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import Footer from "@/components/Footer";
import {
  buildReservationWhatsAppMessage,
  buildReservationEmailBody,
  getWhatsAppUrl,
  getMailtoUrl,
} from "@/lib/notifications";

const timeSlots = [
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00",
];

const ReservationsPage = () => {
  const { t, locale } = useLanguage();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState("");
  const [guests, setGuests] = useState(2);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [comments, setComments] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const canSubmit = date && time && name && phone && email;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || !date) return;
    setSubmitted(true);
    toast.success(locale === "ru" ? "Бронь подтверждена! 🎉" : "¡Reserva confirmada! 🎉");

    const dateFormatted = format(date, locale === "ru" ? "dd.MM.yyyy" : "dd/MM/yyyy");
    const payload = {
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      date: dateFormatted,
      time,
      guests,
      comments: comments.trim(),
    };
    const whatsappText = buildReservationWhatsAppMessage(payload);
    window.open(getWhatsAppUrl(whatsappText), "_blank", "noopener,noreferrer");
    const emailSubject = "Solicitud de reserva – Feliz Valencia";
    const emailBody = buildReservationEmailBody(payload);
    window.open(getMailtoUrl(emailSubject, emailBody), "_blank", "noopener,noreferrer");
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background pt-24">
        <div className="mx-auto max-w-lg px-6 py-24 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-gold"
          >
            <Check size={36} className="text-white" />
          </motion.div>
          <h1 className="font-display text-4xl font-semibold text-foreground">{t("reservation.thankYou")}</h1>
          <p className="mt-4 text-muted-foreground">{t("reservation.thankYouMessage")}</p>
          <button
            onClick={() => setSubmitted(false)}
            className="mt-8 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition-all hover:bg-primary hover:text-primary-foreground"
          >
            {t("reservation.makeAnother")}
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="mx-auto max-w-4xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <p className="text-sm font-medium tracking-[0.3em] uppercase text-primary">{t("reservation.title")}</p>
          <h1 className="mt-3 font-display text-5xl font-light text-foreground md:text-7xl">
            {t("reservation.subtitleMain")} <span className="italic font-semibold">{t("reservation.subtitleHighlight")}</span>
          </h1>
        </motion.div>

        <form onSubmit={handleSubmit} className="mt-12 pb-24">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Left: Calendar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="rounded-2xl border border-border bg-card p-6 shadow-card-hover"
            >
              <div className="flex items-center gap-2 mb-4">
                <CalendarDays size={20} className="text-primary" />
                <h3 className="font-display text-lg font-semibold text-foreground">{t("reservation.selectDate")}</h3>
              </div>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(d) => d < new Date()}
                className={cn("p-3 pointer-events-auto mx-auto")}
              />

              <div className="mt-6">
                <div className="flex items-center gap-2 mb-3">
                  <Clock size={20} className="text-primary" />
                  <h3 className="font-display text-lg font-semibold text-foreground">{t("reservation.selectTime")}</h3>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setTime(slot)}
                      className={`rounded-lg py-2 text-sm font-medium transition-all ${
                        time === slot
                          ? "bg-foreground text-background shadow-luxury"
                          : "bg-secondary text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-center gap-2 mb-3">
                  <Users size={20} className="text-primary" />
                  <h3 className="font-display text-lg font-semibold text-foreground">{t("reservation.guests")}</h3>
                </div>
                <div className="flex items-center gap-3">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setGuests(n)}
                      className={`h-10 w-10 rounded-full text-sm font-semibold transition-all ${
                        guests === n
                          ? "bg-foreground text-background"
                          : "bg-secondary text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right: Contact info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="rounded-2xl border border-border bg-card p-6 shadow-card-hover"
            >
              <h3 className="font-display text-lg font-semibold text-foreground mb-6">{t("reservation.yourDetails")}</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">{t("reservation.name")} *</label>
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
                  <label className="block text-sm font-medium text-foreground mb-1">{t("reservation.phone")} *</label>
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
                  <label className="block text-sm font-medium text-foreground mb-1">{t("reservation.email")} *</label>
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
                  <label className="block text-sm font-medium text-foreground mb-1">{t("reservation.specialRequests")}</label>
                  <textarea
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    rows={4}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                    placeholder={t("reservation.commentsPlaceholder")}
                  />
                </div>
              </div>

              {/* Summary */}
              {date && time && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 rounded-xl bg-secondary p-4"
                >
                  <h4 className="text-sm font-semibold text-foreground">{t("reservation.summary")}</h4>
                  <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                    <p>📅 {date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</p>
                    <p>🕐 {time}</p>
                    <p>👥 {guests} guest{guests > 1 ? "s" : ""}</p>
                  </div>
                </motion.div>
              )}

              <button
                type="submit"
                disabled={!canSubmit}
                className="mt-6 w-full rounded-full bg-gradient-gold px-8 py-4 text-sm font-semibold text-white shadow-glow transition-all hover:shadow-lg hover:scale-[1.01] disabled:opacity-50 disabled:hover:scale-100"
              >
                {t("reservation.confirm")}
              </button>
            </motion.div>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default ReservationsPage;
