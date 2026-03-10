import { useState, useMemo } from "react";
import { addDays, startOfDay, format } from "date-fns";
import { motion } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingBag, CalendarIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import { useLanguage } from "@/contexts/LanguageContext";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import {
  buildGastroOrderWhatsAppMessage,
  buildGastroOrderEmailBody,
  getWhatsAppUrl,
  getMailtoUrl,
} from "@/lib/notifications";

const inputClass =
  "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary";
const labelClass = "block text-sm font-medium text-foreground mb-1";

const CartPage = () => {
  const { t, locale } = useLanguage();
  const { items, updateQuantity, removeItem, total, clearCart } = useCart();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [eventDate, setEventDate] = useState<Date | undefined>(undefined);
  const [notes, setNotes] = useState("");

  const minDate = useMemo(() => addDays(startOfDay(new Date()), 3), []);

  const isValidFullName = fullName.trim().length > 0;
  const isValidPhone = (phone.replace(/\D/g, "").length ?? 0) >= 6;
  const isValidEmail = email.includes("@");
  const isValidDate = eventDate !== undefined;

  const isFormValid =
    isValidFullName && isValidPhone && isValidEmail && isValidDate;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || !eventDate) return;

    const eventDateFormatted =
      locale === "ru"
        ? format(eventDate, "dd.MM.yyyy")
        : format(eventDate, "dd/MM/yyyy");
    const payload = {
      customerName: fullName.trim(),
      customerPhone: phone.trim(),
      customerEmail: email.trim(),
      eventDate: eventDateFormatted,
      items: items.map((i) => ({ name: i.name, quantity: i.quantity, price: i.price })),
      totalPrice: total,
      notes: notes.trim(),
    };

    try {
      await supabase.from("gastro_orders").insert({
        customer_name: payload.customerName,
        customer_phone: payload.customerPhone,
        customer_email: payload.customerEmail,
        event_date: format(eventDate, "yyyy-MM-dd"),
        items: payload.items,
        total_cents: Math.round(total * 100),
        notes: payload.notes || null,
      });
    } catch (_) {
      // Continue to WhatsApp even if Supabase fails (e.g. env not set)
    }

    toast.success(t("cart.orderRedirectMessage"));
    clearCart();
    setFullName("");
    setPhone("");
    setEmail("");
    setEventDate(undefined);
    setNotes("");

    const whatsappMessage = buildGastroOrderWhatsAppMessage(payload);
    window.open(getWhatsAppUrl(whatsappMessage), "_blank", "noopener,noreferrer");

    const emailSubject = "Pedido Gastro Boxes – Feliz Valencia";
    const emailBody = buildGastroOrderEmailBody(payload);
    window.open(getMailtoUrl(emailSubject, emailBody), "_blank", "noopener,noreferrer");
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background pt-24">
        <div className="mx-auto max-w-lg px-6 py-24 text-center">
          <ShoppingBag size={48} className="mx-auto text-muted-foreground" />
          <h1 className="mt-4 font-display text-3xl font-semibold text-foreground">
            {t("cart.empty")}
          </h1>
          <p className="mt-2 text-muted-foreground">{t("cart.emptyHint")}</p>
          <Link
            to="/menu"
            className="mt-6 inline-flex rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition-all hover:bg-primary hover:text-primary-foreground"
          >
            {t("common.browseMenu")}
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="mx-auto max-w-2xl px-6 pb-24">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-4xl font-semibold text-foreground"
        >
          {t("cart.title")}
        </motion.h1>

        <div className="mt-8 space-y-4">
          {items.map((item) => (
            <motion.div
              key={item.id}
              layout
              className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4"
            >
              <img
                src={item.image}
                alt={item.name}
                className="h-16 w-16 rounded-xl object-cover"
              />
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-foreground">
                  {item.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  €{item.price.toFixed(2)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    updateQuantity(item.id, item.quantity - 1)
                  }
                  className="rounded-full bg-secondary p-1.5"
                >
                  <Minus size={14} className="text-foreground" />
                </button>
                <span className="w-6 text-center text-sm font-semibold text-foreground">
                  {item.quantity}
                </span>
                <button
                  onClick={() =>
                    updateQuantity(item.id, item.quantity + 1)
                  }
                  className="rounded-full bg-secondary p-1.5"
                >
                  <Plus size={14} className="text-foreground" />
                </button>
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 size={16} />
              </button>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between text-lg">
            <span className="font-display font-semibold text-foreground">
              {t("cart.total")}
            </span>
            <span className="font-display text-2xl font-semibold text-foreground">
              €{total.toFixed(2)}
            </span>
          </div>

          {/* Notice */}
          <div className="mt-6 rounded-2xl border border-border bg-secondary/60 p-4">
            <p className="text-sm text-muted-foreground">{t("cart.notice")}</p>
          </div>

          {/* Form section */}
          <form onSubmit={handlePlaceOrder} className="mt-6">
            <h3 className="font-display text-lg font-semibold text-foreground mb-4">
              {t("cart.formSectionTitle")}
            </h3>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>
                  {t("cart.fullName")} *
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={inputClass}
                  placeholder={t("reservation.namePlaceholder")}
                  autoComplete="name"
                />
              </div>
              <div>
                <label className={labelClass}>
                  {t("reservation.phone")} *
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={inputClass}
                  placeholder={t("reservation.phonePlaceholder")}
                  autoComplete="tel"
                />
              </div>
              <div>
                <label className={labelClass}>
                  {t("reservation.email")} *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                  placeholder={t("reservation.emailPlaceholder")}
                  autoComplete="email"
                />
              </div>
              <div>
                <label className={labelClass}>
                  {t("cart.eventDate")} *
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className={cn(
                        inputClass,
                        "flex items-center justify-between text-left font-normal",
                        !eventDate && "text-muted-foreground"
                      )}
                    >
                      <span>
                        {eventDate
                          ? format(
                              eventDate,
                              locale === "ru" ? "dd.MM.yyyy" : "dd/MM/yyyy"
                            )
                          : t("reservation.selectDate")}
                      </span>
                      <CalendarIcon className="h-4 w-4 shrink-0 opacity-50" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={eventDate}
                      onSelect={setEventDate}
                      disabled={(d) => d < minDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <label className={labelClass}>
                  {t("cart.notesLabel")}
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className={cn(inputClass, "resize-none")}
                  placeholder={t("reservation.commentsPlaceholder")}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!isFormValid}
              className="mt-6 w-full rounded-full bg-gradient-gold py-4 text-sm font-semibold text-white shadow-glow transition-all hover:shadow-lg hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none disabled:hover:scale-100"
            >
              {t("cart.placeOrder")}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CartPage;
