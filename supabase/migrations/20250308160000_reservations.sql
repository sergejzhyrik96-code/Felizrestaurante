-- Table reservations: restaurant table booking (create from API with service role; cancel via public link)
CREATE TABLE public.reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  date date NOT NULL,
  time text NOT NULL,
  people int NOT NULL CHECK (people >= 1 AND people <= 20),
  comment text DEFAULT '',
  status text NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled')),
  cancel_token text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.reservations IS 'Table reservations; cancel via cancel_token link.';

CREATE INDEX idx_reservations_date ON public.reservations (date);
CREATE INDEX idx_reservations_created_at ON public.reservations (created_at DESC);
CREATE UNIQUE INDEX idx_reservations_cancel_token ON public.reservations (cancel_token);

-- RLS: no direct anon access; only service role (API) can access (RLS bypass for service_role)
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

-- No permissive policies: anon cannot read/write; API uses service_role key and bypasses RLS
