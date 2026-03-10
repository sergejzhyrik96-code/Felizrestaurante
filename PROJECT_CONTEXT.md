# Project Context

This file provides context for AI-assisted development. It describes the current repository so that Cursor and MCP tools can work effectively without changing existing application behavior.

## Current Stack

| Layer        | Technology |
|-------------|------------|
| Build       | Vite 5     |
| Framework   | React 18    |
| Language    | TypeScript  |
| Styling     | TailwindCSS |
| Animation   | Framer Motion |
| UI components | Radix UI (via shadcn/ui) |
| Data / Auth | Supabase    |
| Routing     | React Router v6 |
| Testing     | Vitest, Testing Library |
| Deployment  | Vercel-ready (static/build output) |

**Note:** The project is currently Vite + React. AI rules and MCP are set up to support this stack and a possible future Next.js migration (TypeScript, Tailwind, Framer Motion, Supabase, Vercel remain the same).

## Repository Layout

```
├── public/           # Static assets, data (menu.json, gastroboxes.json), locales
├── src/
│   ├── components/   # Reusable UI (Navbar, Footer, Hero, etc.; ui/ = shadcn)
│   ├── contexts/     # React context (e.g. LanguageContext)
│   ├── hooks/        # Custom hooks (useCart, useToast, use-mobile)
│   ├── integrations/ # External services (e.g. supabase/client, types)
│   ├── lib/          # Utilities (e.g. utils.ts)
│   ├── pages/        # Route-level pages (MenuPage, CartPage, etc.)
│   ├── data/         # Mock data and local data helpers
│   ├── test/         # Test setup and examples
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── scripts/          # Build-time scripts (e.g. migrate-restaurant-data.cjs)
├── .cursor/          # Cursor rules and MCP config
├── AI_RULES.md       # Global AI behavior rules
├── PROJECT_CONTEXT.md # This file
└── SESSION_LOG.md    # Session log template
```

## Conventions

- **Components**: PascalCase. Presentational components in `components/`; primitives in `components/ui/`.
- **Hooks**: `use` prefix; camelCase.
- **Utils**: camelCase functions in `lib/` or next to the feature.
- **Styles**: Tailwind-first. Custom CSS in `index.css` or component-scoped when needed.
- **Env**: Supabase and other secrets via `.env`; do not commit secrets.

## Key Entry Points

- **App**: `src/App.tsx` (routing, layout), `src/main.tsx` (mount).
- **Data**: `public/data/menu.json`, `public/data/gastroboxes.json`; generated/updated by `scripts/migrate-restaurant-data.cjs`.
- **Supabase**: `src/integrations/supabase/client.ts`, `src/integrations/supabase/types.ts`.
- **Reservations**: `src/components/ReservationForm.tsx`, `src/pages/ReservationsPage.tsx`, `src/pages/CancelPage.tsx`, `src/pages/AdminPage.tsx`. API: `api/reservations/create.ts`, `api/reservations/cancel.ts`, `api/admin/login.ts`, `api/admin/reservations/index.ts`, `api/admin/reservations/[id].ts`. DB: table `reservations` (migration in `supabase/migrations/`). Env: see `.env.example` (Supabase service role, Telegram, Resend, ADMIN_PASSWORD).

## AI Infrastructure Files (Do Not Modify App Logic)

- `AI_RULES.md` — Global rules for AI-driven development.
- `PROJECT_CONTEXT.md` — This file; update when structure or stack changes.
- `SESSION_LOG.md` — Template for logging sessions and decisions.
- `.cursor/rules/` — Cursor-specific rules (see .cursor/rules/README.md if present).
- `.cursor/mcp.json` — MCP server configuration for this project (see .cursor/MCP_README.md).
- `.mcp.json` — Copy of MCP config in repo root for tools that read MCP from root.

## How the AI infrastructure works together

1. **AI_RULES.md** defines global behavior (modular design, clean code, performance, minimal deps, premium UI). AI assistants should follow it for every edit.
2. **PROJECT_CONTEXT.md** (this file) describes the repo layout, stack, and conventions so the AI can navigate and conform without changing existing logic.
3. **SESSION_LOG.md** is a template for logging session goals, decisions, and follow-ups.
4. **.cursor/rules/** provides Cursor-specific, persistent rules: `project-standards.mdc` (always on), `typescript-react.mdc` (for .ts/.tsx), `supabase.mdc` (for Supabase code). Cursor merges these with the current conversation.
5. **.cursor/mcp.json** (and root **.mcp.json**) configures MCP servers (context7, filesystem, playwright, supabase). Cursor starts these servers and exposes their tools to the AI, enabling documentation lookup, file operations, browser automation, and Supabase integration.
6. Together, the rules and context keep AI behavior consistent and safe; MCP extends what the AI can do (docs, files, browser, backend) without modifying application code unless requested.

## Target Capabilities

The repository is optimized for:

- **Autonomous AI coding**: Rules and context allow safe, consistent edits.
- **Automated refactoring**: Clear structure and types support incremental refactors.
- **AI debugging**: Clear boundaries and entry points aid fault isolation.
- **AI testing**: Test setup and conventions support adding/updating tests by AI.
