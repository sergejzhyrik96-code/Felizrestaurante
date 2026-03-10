-- Gastro Boxes orders and event/catering inquiries (guest submissions, no auth required)

-- ---------------------------------------------------------------------------
-- gastro_orders
-- ---------------------------------------------------------------------------
CREATE TABLE public.gastro_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  customer_email text NOT NULL,
  event_date date NOT NULL,
  items jsonb NOT NULL DEFAULT '[]',
  total_cents int NOT NULL CHECK (total_cents >= 0),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.gastro_orders IS 'Gastro Boxes orders from cart; guest submissions';

CREATE INDEX idx_gastro_orders_created_at ON public.gastro_orders (created_at DESC);
CREATE INDEX idx_gastro_orders_event_date ON public.gastro_orders (event_date);

-- ---------------------------------------------------------------------------
-- event_inquiries
-- ---------------------------------------------------------------------------
CREATE TABLE public.event_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  event_type text NOT NULL,
  event_date text NOT NULL,
  guests text NOT NULL,
  message text,
  created_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.event_inquiries IS 'Event/catering inquiry form submissions';

CREATE INDEX idx_event_inquiries_created_at ON public.event_inquiries (created_at DESC);

-- ---------------------------------------------------------------------------
-- RLS: allow anonymous insert for both tables (no auth required)
-- ---------------------------------------------------------------------------
ALTER TABLE public.gastro_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "gastro_orders_insert_anon" ON public.gastro_orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "event_inquiries_insert_anon" ON public.event_inquiries
  FOR INSERT WITH CHECK (true);

-- Optional: restrict SELECT to service role / authenticated admin only
CREATE POLICY "gastro_orders_select_anon" ON public.gastro_orders
  FOR SELECT USING (true);

CREATE POLICY "event_inquiries_select_anon" ON public.event_inquiries
  FOR SELECT USING (true);
