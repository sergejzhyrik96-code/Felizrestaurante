import { adminCookieHeader, clearAdminCookieHeader } from "./auth";

export async function POST(request: Request) {
  let body: { password?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const password = typeof body.password === "string" ? body.password : "";

  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return new Response(JSON.stringify({ error: "Server config error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (password !== expected) {
    return new Response(
      JSON.stringify({ error: "Contraseña incorrecta" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": adminCookieHeader(password),
    },
  });
}

export async function DELETE(request: Request) {
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Set-Cookie": clearAdminCookieHeader() },
  });
}
