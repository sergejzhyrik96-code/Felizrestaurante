-- Restaurant system schema: users, reservations, menu_items, orders, order_items
-- Relations and indexes included. Run with: supabase db push (or apply via Dashboard SQL)

-- Enums for status and category
CREATE TYPE public.reservation_status AS ENUM (
  'pending',
  'confirmed',
  'cancelled',
  'completed',
  'no_show'
);

CREATE TYPE public.order_status AS ENUM (
  'draft',
  'pending',
  'paid',
  'preparing',
  'ready',
  'completed',
  'cancelled'
);

CREATE TYPE public.menu_category AS ENUM (
  'tapas',
  'ensaladas',
  'pescados',
  'carnes',
  'complementos',
  'arroces',
  'menu_infantil',
  'postres',
  'bebidas',
  'desayunos',
  'tostadas',
  'croissants',
  'sandwiches',
  'combos',
  'almuerzos',
  'otros'
);

-- ---------------------------------------------------------------------------
-- users (profiles; id matches auth.users.id)
-- ---------------------------------------------------------------------------
CREATE TABLE public.users (
  id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  email text,
  full_name text,
  phone text,
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.users IS 'User profiles; id is auth.users.id';

CREATE INDEX idx_users_email ON public.users (email);
CREATE INDEX idx_users_phone ON public.users (phone);

-- ---------------------------------------------------------------------------
-- reservations
-- ---------------------------------------------------------------------------
CREATE TABLE public.reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users (id) ON DELETE CASCADE,
  reservation_date date NOT NULL,
  reservation_time time NOT NULL,
  party_size int NOT NULL CHECK (party_size > 0 AND party_size <= 20),
  status public.reservation_status NOT NULL DEFAULT 'pending',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.reservations IS 'Table reservations';

CREATE INDEX idx_reservations_user_id ON public.reservations (user_id);
CREATE INDEX idx_reservations_date ON public.reservations (reservation_date);
CREATE INDEX idx_reservations_status ON public.reservations (status);
CREATE INDEX idx_reservations_date_status ON public.reservations (reservation_date, status);

-- ---------------------------------------------------------------------------
-- menu_items
-- ---------------------------------------------------------------------------
CREATE TABLE public.menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_es text NOT NULL,
  name_ru text,
  description_es text,
  description_ru text,
  price_cents int NOT NULL CHECK (price_cents >= 0),
  category public.menu_category NOT NULL DEFAULT 'otros',
  image_url text,
  sort_order int NOT NULL DEFAULT 0,
  is_available boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.menu_items IS 'Menu items (dishes, drinks)';

CREATE INDEX idx_menu_items_category ON public.menu_items (category);
CREATE INDEX idx_menu_items_available ON public.menu_items (is_available) WHERE is_available = true;
CREATE INDEX idx_menu_items_sort ON public.menu_items (category, sort_order);

-- ---------------------------------------------------------------------------
-- orders
-- ---------------------------------------------------------------------------
CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users (id) ON DELETE SET NULL,
  status public.order_status NOT NULL DEFAULT 'draft',
  total_cents int NOT NULL DEFAULT 0 CHECK (total_cents >= 0),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.orders IS 'Customer orders; user_id null for guest orders';

CREATE INDEX idx_orders_user_id ON public.orders (user_id);
CREATE INDEX idx_orders_created_at ON public.orders (created_at DESC);
CREATE INDEX idx_orders_status ON public.orders (status);

-- ---------------------------------------------------------------------------
-- order_items (line items: order N : M menu_items with quantity and price snapshot)
-- ---------------------------------------------------------------------------
CREATE TABLE public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders (id) ON DELETE CASCADE,
  menu_item_id uuid NOT NULL REFERENCES public.menu_items (id) ON DELETE RESTRICT,
  quantity int NOT NULL CHECK (quantity > 0),
  unit_price_cents int NOT NULL CHECK (unit_price_cents >= 0),
  created_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.order_items IS 'Order line items; unit_price_cents snapshot at order time';

CREATE INDEX idx_order_items_order_id ON public.order_items (order_id);
CREATE INDEX idx_order_items_menu_item_id ON public.order_items (menu_item_id);

-- ---------------------------------------------------------------------------
-- updated_at trigger helper
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_reservations_updated_at
  BEFORE UPDATE ON public.reservations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_menu_items_updated_at
  BEFORE UPDATE ON public.menu_items
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- users: own row only
CREATE POLICY "users_select_own" ON public.users
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "users_update_own" ON public.users
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "users_insert_own" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- reservations: own rows
CREATE POLICY "reservations_select_own" ON public.reservations
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "reservations_insert_own" ON public.reservations
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "reservations_update_own" ON public.reservations
  FOR UPDATE USING (auth.uid() = user_id);

-- menu_items: read for all (anon + authenticated)
CREATE POLICY "menu_items_select_all" ON public.menu_items
  FOR SELECT USING (true);

-- orders: own rows (user_id = auth.uid(); guest orders have user_id null and need service role or token)
CREATE POLICY "orders_select_own" ON public.orders
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "orders_insert_own" ON public.orders
  FOR INSERT WITH CHECK (user_id = auth.uid() OR user_id IS NULL);
CREATE POLICY "orders_update_own" ON public.orders
  FOR UPDATE USING (user_id = auth.uid());

-- order_items: via order ownership (user can only see items for their own orders)
CREATE POLICY "order_items_select_via_order" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_items.order_id AND o.user_id = auth.uid()
    )
  );
CREATE POLICY "order_items_insert_via_order" ON public.order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_items.order_id AND (o.user_id = auth.uid() OR o.user_id IS NULL)
    )
  );

-- Optional: trigger to create user profile on signup (if using auth.users)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
