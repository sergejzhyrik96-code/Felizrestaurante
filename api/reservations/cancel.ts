import { getSupabaseAdmin } from "../_lib/supabase";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  if (!token || !token.trim()) {
    return new Response(
      JSON.stringify({ error: "Token requerido" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("reservations")
    .update({ status: "cancelled" })
    .eq("cancel_token", token.trim())
    .in("status", ["confirmed"])
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("cancel update error", error);
    return new Response(
      JSON.stringify({ error: "Error al cancelar" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  if (!data) {
    return new Response(
      JSON.stringify({ error: "Reserva no encontrada o ya cancelada" }),
      { status: 404, headers: { "Content-Type": "application/json" } }
    );
  }

  return new Response(
    JSON.stringify({ success: true }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}
