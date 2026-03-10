import { getSupabaseAdmin, getBaseUrl } from "../_lib/supabase";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const TELEGRAM_API = "https://api.telegram.org/bot";

function generateCancelToken(): string {
  const buf = new Uint8Array(24);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(buf);
  }
  return Array.from(buf, (b) => b.toString(16).padStart(2, "0")).join("");
}

type CreateBody = {
  name?: string;
  phone?: string;
  email?: string;
  date?: string;
  time?: string;
  people?: number;
  comment?: string;
};

function validate(body: CreateBody): { ok: true; data: Required<CreateBody> } | { ok: false; error: string } {
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const date = typeof body.date === "string" ? body.date.trim() : "";
  const time = typeof body.time === "string" ? body.time.trim() : "";
  const people = typeof body.people === "number" ? body.people : Number(body.people);
  const comment = typeof body.comment === "string" ? body.comment.trim() : "";

  if (!name || name.length < 2) return { ok: false, error: "name required" };
  if (!phone || phone.length < 5) return { ok: false, error: "phone required" };
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, error: "valid email required" };
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return { ok: false, error: "date required (YYYY-MM-DD)" };
  if (!time || time.length < 1) return { ok: false, error: "time required" };
  const p = Number(people);
  if (!Number.isInteger(p) || p < 1 || p > 20) return { ok: false, error: "people must be 1–20" };

  return { ok: true, data: { name, phone, email, date, time, people: p, comment } };
}

async function sendTelegram(name: string, people: number, date: string, time: string, phone: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  const text = `Nueva reserva 🍽

Nombre: ${name}
Personas: ${people}
Fecha: ${date}
Hora: ${time}
Telefono: ${phone}`;

  await fetch(`${TELEGRAM_API}${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
  });
}

async function sendConfirmationEmail(
  email: string,
  name: string,
  date: string,
  time: string,
  people: number,
  cancelToken: string
) {
  if (!process.env.RESEND_API_KEY) return;

  const baseUrl = getBaseUrl();
  const cancelLink = `${baseUrl}/cancel?token=${encodeURIComponent(cancelToken)}`;

  const html = `
    <p>Hola ${escapeHtml(name)},</p>
    <p>Tu reserva ha sido registrada.</p>
    <p><strong>Fecha:</strong> ${escapeHtml(date)}<br/>
    <strong>Hora:</strong> ${escapeHtml(time)}<br/>
    <strong>Personas:</strong> ${people}</p>
    <p><strong>Dirección:</strong><br/>Plaça Vanes 7, Valencia</p>
    <p>Si necesitas cancelar tu reserva puedes hacerlo aquí:</p>
    <p><a href="${cancelLink}">${cancelLink}</a></p>
  `;

  await resend.emails.send({
    from: process.env.RESEND_FROM || "FELIZ Valencia <onboarding@resend.dev>",
    to: email,
    subject: "Reserva confirmada — FELIZ Valencia",
    html,
  });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(request: Request) {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  let body: CreateBody;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const validated = validate(body);
  if (!validated.ok) {
    return new Response(JSON.stringify({ error: validated.error }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { name, phone, email, date, time, people, comment } = validated.data;
  const cancel_token = generateCancelToken();

  const supabase = getSupabaseAdmin();

  const { data: row, error: insertError } = await supabase
    .from("reservations")
    .insert({
      name,
      phone,
      email,
      date,
      time,
      people,
      comment: comment || "",
      status: "confirmed",
      cancel_token,
    })
    .select("id")
    .single();

  if (insertError || !row) {
    console.error("reservations insert error", insertError);
    return new Response(
      JSON.stringify({ error: "No se pudo crear la reserva. Inténtalo de nuevo." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    await sendTelegram(name, people, date, time, phone);
  } catch (e) {
    console.error("Telegram send error", e);
  }

  try {
    await sendConfirmationEmail(email, name, date, time, people, cancel_token);
  } catch (e) {
    console.error("Resend send error", e);
  }

  return new Response(
    JSON.stringify({ success: true, id: row.id }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}
