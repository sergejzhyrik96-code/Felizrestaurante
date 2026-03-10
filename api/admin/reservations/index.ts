import { getSupabaseAdmin } from "../../_lib/supabase";
import { isAdminAuthenticated } from "../auth";

function startOfDay(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export async function GET(request: Request) {
  if (!isAdminAuthenticated(request)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const today = startOfDay(new Date());

  const supabase = getSupabaseAdmin();

  const { data: all, error } = await supabase
    .from("reservations")
    .select("id, name, phone, email, date, time, people, status, created_at")
    .gte("date", today)
    .order("date", { ascending: true })
    .order("time", { ascending: true });

  if (error) {
    console.error("reservations list error", error);
    return new Response(JSON.stringify({ error: "Error al cargar reservas" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const todayReservations = (all || []).filter((r) => r.date === today);
  const upcomingReservations = (all || []).filter((r) => r.date !== today);

  return new Response(
    JSON.stringify({ today: todayReservations, upcoming: upcomingReservations }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}
