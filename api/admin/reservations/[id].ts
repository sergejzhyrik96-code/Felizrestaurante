import { getSupabaseAdmin } from "../../_lib/supabase";
import { isAdminAuthenticated } from "../auth";

function getIdFromUrl(url: string): string | null {
  const match = url.match(/\/api\/admin\/reservations\/([^/?]+)/);
  return match ? match[1] : null;
}

export async function PATCH(request: Request) {
  if (!isAdminAuthenticated(request)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const id = getIdFromUrl(request.url);
  if (!id) {
    return new Response(JSON.stringify({ error: "ID required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  let body: { status?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const status = body.status === "confirmed" || body.status === "cancelled" ? body.status : null;
  if (!status) {
    return new Response(JSON.stringify({ error: "status must be confirmed or cancelled" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const supabase = getSupabaseAdmin();

  const { error } = await supabase.from("reservations").update({ status }).eq("id", id);

  if (error) {
    console.error("reservation update error", error);
    return new Response(JSON.stringify({ error: "Error al actualizar" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function DELETE(request: Request) {
  if (!isAdminAuthenticated(request)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const id = getIdFromUrl(request.url);
  if (!id) {
    return new Response(JSON.stringify({ error: "ID required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const supabase = getSupabaseAdmin();

  const { error } = await supabase.from("reservations").delete().eq("id", id);

  if (error) {
    console.error("reservation delete error", error);
    return new Response(JSON.stringify({ error: "Error al eliminar" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
