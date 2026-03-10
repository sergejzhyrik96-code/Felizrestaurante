import { useState, useRef } from "react";
import { format } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import {
  buildEventInquiryWhatsAppMessage,
  buildEventInquiryEmailBody,
  getWhatsAppUrl,
  getMailtoUrl,
} from "@/lib/notifications";
import { cn } from "@/lib/utils";

const inputClass =
  "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary";

const EventInquiryForm = () => {
  const { t, locale } = useLanguage();
  const [eventType, setEventType] = useState("");
  const [eventDate, setEventDate] = useState<Date | undefined>(undefined);
  const [guests, setGuests] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const isValid =
    eventType.trim().length > 0 &&
    eventDate !== undefined &&
    guests.trim().length > 0 &&
    name.trim().length > 0 &&
    phone.replace(/\D/g, "").length >= 6 &&
    email.includes("@");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || !eventDate) return;

    const eventDateFormatted =
      locale === "ru" ? format(eventDate, "dd.MM.yyyy") : format(eventDate, "dd/MM/yyyy");

    const payload = {
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      eventType: eventType.trim(),
      eventDate: eventDateFormatted,
      guests: guests.trim(),
      message: message.trim(),
    };

    const whatsappMessage = buildEventInquiryWhatsAppMessage(payload);
    window.open(getWhatsAppUrl(whatsappMessage), "_blank", "noopener,noreferrer");

    const subject = "Solicitud de evento – Feliz Valencia";
    const body = buildEventInquiryEmailBody(payload);
    window.open(getMailtoUrl(subject, body), "_blank", "noopener,noreferrer");

    toast.success(t("cateringForm.submitSuccess"));
    setEventType("");
    setEventDate(undefined);
    setGuests("");
    setName("");
    setPhone("");
    setEmail("");
    setMessage("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">
          {t("cateringForm.eventType")} *
        </label>
        <input
          type="text"
          value={eventType}
          onChange={(e) => setEventType(e.target.value)}
          placeholder={t("cateringForm.eventTypePlaceholder")}
          className={inputClass}
          required
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">
          {t("cateringForm.eventDate")} *
        </label>
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className={cn(
                "flex w-full items-center gap-2 rounded-xl border border-border bg-background px-4 py-3 text-sm",
                !eventDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon size={16} />
              {eventDate
                ? format(eventDate, locale === "ru" ? "dd.MM.yyyy" : "dd/MM/yyyy")
                : t("cateringForm.eventDate")}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={eventDate}
              onSelect={setEventDate}
              disabled={(d) => d < new Date()}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">
          {t("cateringForm.guests")} *
        </label>
        <input
          type="text"
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
          placeholder={t("cateringForm.guestsPlaceholder")}
          className={inputClass}
          required
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">
          {t("cateringForm.name")} *
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t("reservation.namePlaceholder")}
          className={inputClass}
          required
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">
          {t("reservation.phone")} *
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder={t("reservation.phonePlaceholder")}
          className={inputClass}
          required
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">
          {t("reservation.email")} *
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("reservation.emailPlaceholder")}
          className={inputClass}
          required
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">
          {t("cateringForm.message")}
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={t("cateringForm.messagePlaceholder")}
          className={cn(inputClass, "min-h-[100px] resize-y")}
          rows={4}
        />
      </div>
      <button
        type="submit"
        disabled={!isValid}
        className="w-full rounded-full bg-gradient-gold px-6 py-4 text-sm font-semibold text-white shadow-glow transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {t("cateringForm.submit")}
      </button>
    </form>
  );
};

export default EventInquiryForm;
