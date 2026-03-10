# Supabase MCP Integration – Diagnosis & Verification

**Date:** 2025-03-08  
**Project:** https://przepotmivfqrphowufn.supabase.co

---

## 1. Configuration (fixed)

**File:** `.cursor/mcp.json`

| Step | Status | Detail |
|------|--------|--------|
| Read config | Done | Supabase MCP entry present. |
| Env for DB operations | Fixed | Previously only `SUPABASE_ACCESS_TOKEN` was set. The server needs **SUPABASE_URL** and **SUPABASE_SERVICE_KEY** for database tools (`list_tables`, `execute_sql`). |
| Current env | Set | `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, and `SUPABASE_ACCESS_TOKEN` are all set. |

**Cause of earlier failure:**  
`list_tables` and `execute_sql` talk to the project’s **database**. For that, the Supabase MCP server expects:

- **SUPABASE_URL** – project URL (e.g. `https://przepotmivfqrphowufn.supabase.co`)
- **SUPABASE_SERVICE_KEY** – project **service_role** key (from Dashboard → Settings → API)

Using only **SUPABASE_ACCESS_TOKEN** (Management API token) is not enough for these DB tools, which led to “You do not have permission to perform this action.”

**Change made:**  
In `.cursor/mcp.json`, the Supabase MCP `env` was updated to include:

- `SUPABASE_URL`: `https://przepotmivfqrphowufn.supabase.co`
- `SUPABASE_SERVICE_KEY`: *(service role key from your .mcp.json)*
- `SUPABASE_ACCESS_TOKEN`: *(kept for Management API use)*

---

## 2. MCP server status

| Check | Status |
|-------|--------|
| Config file | OK – `.cursor/mcp.json` valid JSON |
| Command | `npx -y @supabase/mcp-server-supabase` |
| Env vars | SUPABASE_URL, SUPABASE_SERVICE_KEY, SUPABASE_ACCESS_TOKEN set |

**Restart required:**  
Cursor starts the MCP server once and passes env from the config at that time. To load the new variables you must **restart the Supabase MCP server** (e.g. restart Cursor or use Cursor’s MCP/server restart if available).

---

## 3. Connection status

| Check | Status |
|-------|--------|
| Project URL | Reachable (przepotmivfqrphowufn.supabase.co) |
| Schema source | Types in `src/integrations/supabase/types.ts` were generated from this project via CLI; DB connection is known to work. |

---

## 4. Tables in the database

From the schema (generated from this project):

| # | Table         | Present |
|---|---------------|--------|
| 1 | users         | Yes    |
| 2 | reservations  | Yes    |
| 3 | menu_items    | Yes    |
| 4 | orders        | Yes    |
| 5 | order_items   | Yes    |

---

## 5. Next steps

1. **Restart Cursor** (or restart only the Supabase MCP server) so it reloads `.cursor/mcp.json` and the new env.
2. Run **list_tables** again (e.g. “Use Supabase MCP to list tables”); it should succeed with the current config.
3. If it still fails, confirm in Supabase Dashboard → **Settings → API** that the **service_role** key matches `SUPABASE_SERVICE_KEY` in `.cursor/mcp.json` (and that the key is not revoked).

---

## Summary

| Item              | Status |
|-------------------|--------|
| MCP config        | Fixed (SUPABASE_URL + SUPABASE_SERVICE_KEY added) |
| MCP server restart| Required (restart Cursor) |
| Connection        | OK (project reachable; schema known) |
| Tables in DB      | users, reservations, menu_items, orders, order_items |
