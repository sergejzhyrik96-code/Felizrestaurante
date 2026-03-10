/**
 * Contact numbers and notification helpers.
 *
 * RESTAURANT (call only): 961 18 18 24 → tel:+34961181824
 *   - Footer contact section, "Llamar" button, table reservations
 *
 * EVENTS + GASTRO BOXES (WhatsApp): +34 633 52 23 63 → wa.me/34633522363
 *   - Gastro Boxes orders, Catering/Events requests, Event inquiry forms
 *
 * EMAIL: sergej.zhyrik96@gmail.com
 */

/** Restaurant phone – call only, no WhatsApp. */
export const RESTAURANT_PHONE = "+34961181824";
export const RESTAURANT_PHONE_DISPLAY = "961 18 18 24";

const WHATSAPP_PHONE = "34633522363";
/** Events/catering phone display. */
export const EVENT_PHONE_DISPLAY = "+34 633 52 23 63";
const NOTIFICATION_EMAIL = "sergej.zhyrik96@gmail.com";

/** Restaurant call link (for contact section, Llamar, reservations). */
export function getRestaurantCallUrl(): string {
  return `tel:${RESTAURANT_PHONE}`;
}

/** Events/catering call link (for catering pages). */
export function getEventCallUrl(): string {
  return `tel:+34${WHATSAPP_PHONE}`;
}

export type GastroOrderItem = { name: string; quantity: number; price: number };

export type GastroOrderPayload = {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  eventDate: string; // formatted e.g. dd/MM/yyyy
  items: GastroOrderItem[];
  totalPrice: number;
  notes: string;
};

export type EventInquiryPayload = {
  name: string;
  phone: string;
  email: string;
  eventType: string;
  eventDate: string;
  guests: string | number;
  message: string;
};

/** WhatsApp URL with pre-filled text (no spaces in phone). */
export function getWhatsAppUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}

/** WhatsApp URL for event/catering proposal request (default message). */
export function getWhatsAppProposalUrl(): string {
  return getWhatsAppUrl("Hola, me gustaría solicitar una propuesta para un evento.");
}

/** Mailto URL to send a copy to the notification email. */
export function getMailtoUrl(subject: string, body: string): string {
  return `mailto:${NOTIFICATION_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/** Build WhatsApp message for Gastro Boxes order (Spanish format). */
export function buildGastroOrderWhatsAppMessage(p: GastroOrderPayload): string {
  const lines: string[] = [
    "Pedido Gastro Boxes – Feliz Valencia",
    "",
    `Nombre: ${p.customerName}`,
    `Teléfono: ${p.customerPhone}`,
    `Email: ${p.customerEmail}`,
    `Fecha del evento: ${p.eventDate}`,
    "",
    "Pedido:",
    ...p.items.map((i) => `• ${i.name} × ${i.quantity}`),
    "",
    `Total: €${p.totalPrice.toFixed(2)}`,
    "",
    "Notas:",
    p.notes.trim() || "(ninguna)",
  ];
  return lines.join("\n");
}

/** Build plain text body for email notification (Gastro order). */
export function buildGastroOrderEmailBody(p: GastroOrderPayload): string {
  const lines: string[] = [
    "Pedido Gastro Boxes – Feliz Valencia",
    "",
    `Nombre: ${p.customerName}`,
    `Teléfono: ${p.customerPhone}`,
    `Email: ${p.customerEmail}`,
    `Fecha del evento: ${p.eventDate}`,
    "",
    "Pedido:",
    ...p.items.map((i) => `• ${i.name} × ${i.quantity} — €${(i.price * i.quantity).toFixed(2)}`),
    "",
    `Total: €${p.totalPrice.toFixed(2)}`,
    "",
    "Notas:",
    p.notes.trim() || "(ninguna)",
  ];
  return lines.join("\n");
}

/** Build WhatsApp message for event/catering inquiry. */
export function buildEventInquiryWhatsAppMessage(p: EventInquiryPayload): string {
  const lines: string[] = [
    "Solicitud de evento – Feliz Valencia",
    "",
    `Nombre: ${p.name}`,
    `Teléfono: ${p.phone}`,
    `Email: ${p.email}`,
    "",
    `Tipo de evento: ${p.eventType}`,
    `Fecha del evento: ${p.eventDate}`,
    `Número de invitados: ${p.guests}`,
    "",
    "Mensaje:",
    p.message.trim() || "(sin mensaje)",
  ];
  return lines.join("\n");
}

/** Build plain text body for email (event inquiry). */
export function buildEventInquiryEmailBody(p: EventInquiryPayload): string {
  const lines: string[] = [
    "Solicitud de evento – Feliz Valencia",
    "",
    `Nombre: ${p.name}`,
    `Teléfono: ${p.phone}`,
    `Email: ${p.email}`,
    `Tipo de evento: ${p.eventType}`,
    `Fecha del evento: ${p.eventDate}`,
    `Número de invitados: ${p.guests}`,
    "",
    "Mensaje:",
    p.message.trim() || "(sin mensaje)",
  ];
  return lines.join("\n");
}

export type ReservationPayload = {
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  guests: number;
  comments: string;
};

/** Build WhatsApp message for table reservation request. */
export function buildReservationWhatsAppMessage(p: ReservationPayload): string {
  const lines: string[] = [
    "Solicitud de reserva – Feliz Valencia",
    "",
    `Nombre: ${p.name}`,
    `Teléfono: ${p.phone}`,
    `Email: ${p.email}`,
    `Fecha: ${p.date}`,
    `Hora: ${p.time}`,
    `Comensales: ${p.guests}`,
    "",
    "Notas:",
    p.comments.trim() || "(ninguna)",
  ];
  return lines.join("\n");
}

/** Build plain text body for email (reservation). */
export function buildReservationEmailBody(p: ReservationPayload): string {
  const lines: string[] = [
    "Solicitud de reserva – Feliz Valencia",
    "",
    `Nombre: ${p.name}`,
    `Teléfono: ${p.phone}`,
    `Email: ${p.email}`,
    `Fecha: ${p.date}`,
    `Hora: ${p.time}`,
    `Comensales: ${p.guests}`,
    "",
    "Notas:",
    p.comments.trim() || "(ninguna)",
  ];
  return lines.join("\n");
}

/** Open WhatsApp in new tab and optionally open mailto for email copy. */
export function openWhatsAppAndEmail(message: string, subject?: string, body?: string): void {
  window.open(getWhatsAppUrl(message), "_blank", "noopener,noreferrer");
  if (subject != null && body != null) {
    window.open(getMailtoUrl(subject, body), "_blank", "noopener,noreferrer");
  }
}
