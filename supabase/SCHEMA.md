# Restaurant system schema

Overview of the Supabase schema for the restaurant app.

## Tables

| Table | Description |
|-------|-------------|
| **users** | User profiles; `id` = `auth.users.id`. Synced on signup via trigger. |
| **reservations** | Table reservations (date, time, party size, status). |
| **menu_items** | Dishes/drinks (name_es/name_ru, price_cents, category, image_url). |
| **orders** | Customer orders; `user_id` null for guest orders. |
| **order_items** | Line items: links orders to menu_items with `quantity` and `unit_price_cents` (snapshot). |

## Relations

```
auth.users (Supabase Auth)
    │
    └── users (id) ◄──────┬── reservations (user_id)
                          └── orders (user_id)

menu_items (id) ◄──── order_items (menu_item_id)
orders (id) ◄──────── order_items (order_id)
```

- **users** ← `reservations.user_id`, `orders.user_id`
- **orders** ← `order_items.order_id`
- **menu_items** ← `order_items.menu_item_id`

## Enums

- **reservation_status**: `pending`, `confirmed`, `cancelled`, `completed`, `no_show`
- **order_status**: `draft`, `pending`, `paid`, `preparing`, `ready`, `completed`, `cancelled`
- **menu_category**: `tapas`, `ensaladas`, `pescados`, `carnes`, `complementos`, `arroces`, `menu_infantil`, `postres`, `bebidas`, `desayunos`, `tostadas`, `croissants`, `sandwiches`, `combos`, `almuerzos`, `otros`

## Indexes

| Table | Index | Purpose |
|-------|-------|---------|
| users | `idx_users_email`, `idx_users_phone` | Lookup |
| reservations | `idx_reservations_user_id`, `idx_reservations_date`, `idx_reservations_status`, `idx_reservations_date_status` | List by user/date/status |
| menu_items | `idx_menu_items_category`, `idx_menu_items_available`, `idx_menu_items_sort` | Menu by category, available items, sort order |
| orders | `idx_orders_user_id`, `idx_orders_created_at`, `idx_orders_status` | List by user/date/status |
| order_items | `idx_order_items_order_id`, `idx_order_items_menu_item_id` | Join and analytics |

## RLS

- **users**: SELECT/UPDATE/INSERT own row only.
- **reservations**: SELECT/INSERT/UPDATE own rows (`user_id = auth.uid()`).
- **menu_items**: SELECT for all (anon + authenticated); no INSERT/UPDATE for anon.
- **orders**: SELECT/UPDATE own orders (`user_id = auth.uid()`); INSERT allows `user_id` null for guest.
- **order_items**: SELECT/INSERT only for orders owned by the user (or guest at insert).

## Applying the migration

**Option A – Supabase CLI (local or linked project)**

```bash
supabase db push
```

**Option B – Supabase Dashboard**

1. Project → SQL Editor.
2. Paste the contents of `supabase/migrations/20250308120000_restaurant_schema.sql`.
3. Run.

After applying, regenerate TypeScript types (if using Supabase CLI):

```bash
supabase gen types typescript --linked > src/integrations/supabase/types.ts
```

Then update `src/integrations/supabase/types.ts` so the `Database` type reflects the new tables and enums.
