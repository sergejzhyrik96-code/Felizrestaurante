/**
 * Check Supabase connection and list tables in public schema.
 * Run: node scripts/check-supabase.cjs
 */
const fs = require("fs");
const path = require("path");

function loadEnv() {
  const p = path.join(__dirname, "..", ".env");
  if (!fs.existsSync(p)) return {};
  const o = {};
  fs
    .readFileSync(p, "utf8")
    .split(/\r?\n/)
    .forEach((line) => {
      const m = line.match(/^([^#=]+)=(.*)$/);
      if (m) o[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, "");
    });
  return o;
}

async function main() {
  const env = loadEnv();
  const url = env.VITE_SUPABASE_URL;
  const key = env.VITE_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    console.error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY in .env");
    process.exit(1);
  }

  console.log("Supabase URL:", url);
  console.log("Anon key (first 24 chars):", key.substring(0, 24) + "...");
  console.log("");

  const headers = {
    apikey: key,
    Authorization: "Bearer " + key,
  };

  // 1. Test REST API root
  const rootRes = await fetch(url + "/rest/v1/", { method: "HEAD", headers });
  console.log("REST API (HEAD /rest/v1/):", rootRes.status, rootRes.statusText);

  if (!rootRes.ok) {
    console.error("Connection failed. Check URL and anon key in .env");
    process.exit(1);
  }

  // 2. Try to list tables via information_schema (may not be exposed with anon)
  const schemaRes = await fetch(
    url +
      "/rest/v1/information_schema.tables?table_schema=eq.public&select=table_name&order=table_name",
    {
      headers: {
        ...headers,
        "Accept-Profile": "information_schema",
        "Content-Profile": "information_schema",
      },
    }
  );

  if (schemaRes.ok) {
    const data = await schemaRes.json();
    const tables = Array.isArray(data) ? data.map((r) => r.table_name) : [];
    if (tables.length > 0) {
      console.log("Tables in public schema:", tables.length);
      tables.forEach((t) => console.log("  -", t));
    } else {
      console.log("Tables in public schema: (none or information_schema not exposed to anon)");
      console.log("Your Database types in src/integrations/supabase/types.ts show no tables defined.");
    }
  } else {
    console.log(
      "information_schema.tables:",
      schemaRes.status,
      "(anon key often cannot read information_schema)"
    );
    // Try OpenAPI schema for table paths
    const openApiRes = await fetch(url + "/rest/v1/", { headers: { ...headers, Accept: "application/json" } });
    if (openApiRes.ok) {
      const openApi = await openApiRes.json();
      const paths = openApi.paths || {};
      const tablePaths = Object.keys(paths).filter((p) => p.match(/^\/[a-zA-Z0-9_-]+$/) && p !== "/");
      const tableNames = tablePaths.map((p) => p.replace(/^\//, "")).filter(Boolean);
      if (tableNames.length > 0) {
        console.log("Tables in public schema (from OpenAPI):", tableNames.length);
        tableNames.forEach((t) => console.log("  -", t));
      } else {
        console.log("Tables in public schema: (use Supabase Dashboard to view/create tables)");
      }
    } else {
      console.log("Tables in public schema: (use Supabase Dashboard or service role to list)");
    }
  }

  // 3. Auth check (optional)
  const authRes = await fetch(url + "/auth/v1/health", { headers });
  console.log("");
  console.log("Auth health:", authRes.status === 200 ? "OK" : authRes.status);
}

main().catch((e) => {
  console.error("Error:", e.message);
  process.exit(1);
});
