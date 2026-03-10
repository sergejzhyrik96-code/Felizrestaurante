import { useState, useMemo } from "react";
import { format, addDays, startOfDay } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingBag, X, CalendarIcon } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";
import {
  buildGastroOrderWhatsAppMessage,
  buildGastroOrderEmailBody,
  getWhatsAppUrl,
  getMailtoUrl,
} from "@/lib/notifications";

const GastroCart = () => {
  const { t, locale } = useLanguage();
  const { items, total, updateQuantity, removeItem, clearCart, itemCount } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    telefono: "",
    email: "",
    notas: "",
  });
  const [eventDate, setEventDate] = useState<Date | undefined>(undefined);

  const minDate = useMemo(() => addDays(startOfDay(new Date()), 3), []);

  const isValidFullName = form.nombre.trim().length > 0;
  const isValidPhone = (form.telefono.replace(/\D/g, "") ?? "").length >= 6;
  const isValidEmail = form.email.includes("@");
  const isValidDate = eventDate !== undefined;
  const isFormValid =
    isValidFullName && isValidPhone && isValidEmail && isValidDate && items.length > 0;

  const handlePlaceOrder = async () => {
    if (!isFormValid || !eventDate) return;

    const eventDateFormatted =
      locale === "ru"
        ? format(eventDate, "dd.MM.yyyy")
        : format(eventDate, "dd/MM/yyyy");
    const payload = {
      customerName: form.nombre.trim(),
      customerPhone: form.telefono.trim(),
      customerEmail: form.email.trim(),
      eventDate: eventDateFormatted,
      items: items.map((i) => ({ name: i.name, quantity: i.quantity, price: i.price })),
      totalPrice: total,
      notes: form.notas.trim(),
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
    } catch (_) {}

    toast.success(t("cart.orderRedirectMessage"));
    clearCart();
    setForm({ nombre: "", telefono: "", email: "", notas: "" });
    setEventDate(undefined);
    setMobileOpen(false);

    const whatsappMessage = buildGastroOrderWhatsAppMessage(payload);
    window.open(getWhatsAppUrl(whatsappMessage), "_blank", "noopener,noreferrer");

    const emailSubject = "Pedido Gastro Boxes – Feliz Valencia";
    const emailBody = buildGastroOrderEmailBody(payload);
    window.open(getMailtoUrl(emailSubject, emailBody), "_blank", "noopener,noreferrer");
  };

  const inputClass =
    "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary";

  const labelClass = "block text-sm font-medium text-foreground mb-1";

  const CartContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className="flex flex-col h-full">
      {!isMobile && (
        <h2 className="font-display text-xl font-semibold text-foreground">
          {t("gastroCart.title")}
        </h2>
      )}

      {items.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">{t("gastroCart.empty")}</p>
      ) : (
        <ul className="mt-4 space-y-3 overflow-auto flex-1 min-h-0">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
            >
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-12 w-12 shrink-0 rounded-lg object-cover"
                />
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                <p className="text-xs text-muted-foreground">€{item.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="rounded-full bg-secondary p-1.5 text-foreground transition-colors hover:bg-muted"
                >
                  <Minus size={12} />
                </button>
                <span className="w-5 text-center text-sm font-semibold text-foreground">
                  {item.quantity}
                </span>
                <button
                  type="button"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="rounded-full bg-secondary p-1.5 text-foreground transition-colors hover:bg-muted"
                >
                  <Plus size={12} />
                </button>
              </div>
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="shrink-0 text-muted-foreground hover:text-destructive transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 border-t border-border pt-4">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-foreground">{t("gastroCart.totalEstimate")}</span>
          <span className="font-display text-lg font-semibold text-foreground">
            €{total.toFixed(2)}
          </span>
        </div>

        {/* Notice */}
        <div className="mt-4 rounded-2xl border border-border bg-secondary/60 p-3">
          <p className="text-xs text-muted-foreground">{t("cart.notice")}</p>
        </div>

        <div className="mt-4 space-y-3">
          <div>
            <label className={labelClass}>{t("cart.fullName")} *</label>
            <input
              type="text"
              value={form.nombre}
              onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
              className={inputClass}
              placeholder={t("reservation.namePlaceholder")}
            />
          </div>
          <div>
            <label className={labelClass}>{t("reservation.phone")} *</label>
            <input
              type="tel"
              value={form.telefono}
              onChange={(e) => setForm((f) => ({ ...f, telefono: e.target.value }))}
              className={inputClass}
              placeholder={t("reservation.phonePlaceholder")}
            />
          </div>
          <div>
            <label className={labelClass}>{t("reservation.email")} *</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className={inputClass}
              placeholder={t("reservation.emailPlaceholder")}
            />
          </div>
          <div>
            <label className={labelClass}>{t("cart.eventDate")} *</label>
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
                      ? format(eventDate, locale === "ru" ? "dd.MM.yyyy" : "dd/MM/yyyy")
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
            <label className={labelClass}>{t("cart.notesLabel")}</label>
            <textarea
              value={form.notas}
              onChange={(e) => setForm((f) => ({ ...f, notas: e.target.value }))}
              rows={2}
              className={cn(inputClass, "resize-none")}
              placeholder={t("reservation.commentsPlaceholder")}
            />
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <button
            type="button"
            onClick={handlePlaceOrder}
            disabled={!isFormValid}
            className="w-full rounded-full bg-gradient-gold px-6 py-3 text-sm font-semibold text-white shadow-glow transition-all hover:shadow-lg hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none disabled:hover:scale-100"
          >
            {t("gastroCart.placeOrder")}
          </button>
          <button
            type="button"
            disabled
            className="w-full rounded-full border border-border bg-secondary px-6 py-3 text-sm font-medium text-muted-foreground"
          >
            {t("gastroCart.paymentSoon")}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop: sticky cart on the right */}
      <aside
        className={cn(
          "hidden lg:block w-[360px] shrink-0",
          "sticky top-[120px] self-start",
          "rounded-2xl border border-border bg-card p-6 shadow-card-hover",
          "max-h-[calc(100vh-140px)] overflow-hidden flex flex-col"
        )}
      >
        <CartContent />
      </aside>

      {/* Mobile: floating button */}
      <div className="lg:hidden fixed bottom-6 left-4 right-4 z-40">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="w-full rounded-full bg-foreground text-background shadow-luxury py-4 px-6 font-display text-lg font-semibold flex items-center justify-center gap-2 hover:bg-primary transition-colors"
        >
          <ShoppingBag size={22} />
          {t("gastroCart.viewCart")}
          {itemCount > 0 && (
            <span className="rounded-full bg-primary text-primary-foreground text-xs font-bold min-w-[22px] h-[22px] flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </button>
      </div>

      {/* Mobile: slide-up panel */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="lg:hidden fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl border border-border border-b-0 bg-card shadow-luxury max-h-[85vh] flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h2 className="font-display text-xl font-semibold text-foreground">
                  {t("gastroCart.title")}
                </h2>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="overflow-auto flex-1 p-4 pb-8">
                <CartContent isMobile />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default GastroCart;
