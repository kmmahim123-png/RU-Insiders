-- ==============================================================================
-- RU INSIDERS - COMPLETE SUPABASE DATABASE & STORAGE SCHEMA
-- Run this script in the Supabase Dashboard -> SQL Editor -> Click 'Run'
-- ==============================================================================

-- 1. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  name_bn TEXT DEFAULT '',
  category TEXT NOT NULL,
  description TEXT DEFAULT '',
  price NUMERIC NOT NULL DEFAULT 0,
  regular_price NUMERIC DEFAULT 0,
  cost_price NUMERIC DEFAULT 0,
  images JSONB DEFAULT '[]'::jsonb,
  colors JSONB DEFAULT '[]'::jsonb,
  sizes JSONB DEFAULT '["M", "L", "XL", "XXL"]'::jsonb,
  stock INTEGER DEFAULT 50,
  customizable BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  video TEXT DEFAULT '',
  badge TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for ordering and category lookup
CREATE INDEX IF NOT EXISTS idx_products_order ON public.products (order_index ASC);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products (category);

-- 2. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  order_number TEXT DEFAULT '',
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  delivery_method TEXT DEFAULT 'ru_campus_pickup',
  payment_method TEXT DEFAULT 'cash_on_delivery',
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  subtotal NUMERIC NOT NULL DEFAULT 0,
  delivery_fee NUMERIC DEFAULT 0,
  total NUMERIC NOT NULL DEFAULT 0,
  estimated_cost NUMERIC DEFAULT 0,
  net_profit NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'pending',
  cancelled_from TEXT DEFAULT '',
  rider_name TEXT DEFAULT '',
  steadfast_consignment_id TEXT DEFAULT '',
  steadfast_tracking_code TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders (status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON public.orders (created_at DESC);

-- 3. PRINT STATION JOBS TABLE
CREATE TABLE IF NOT EXISTS public.print_jobs (
  id TEXT PRIMARY KEY,
  token TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_notes TEXT DEFAULT '',
  file_name TEXT NOT NULL,
  file_size_mb NUMERIC DEFAULT 1,
  file_data_url TEXT DEFAULT '',
  page_count INTEGER DEFAULT 1,
  print_type TEXT DEFAULT 'bw',
  paper_type TEXT DEFAULT 'standard_80gsm',
  double_sided BOOLEAN DEFAULT false,
  copies INTEGER DEFAULT 1,
  price_per_page NUMERIC DEFAULT 2.5,
  total_amount NUMERIC NOT NULL DEFAULT 0,
  cost_amount NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'queued',
  payment_status TEXT DEFAULT 'unpaid',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_print_jobs_token ON public.print_jobs (token);
CREATE INDEX IF NOT EXISTS idx_print_jobs_status ON public.print_jobs (status);

-- 4. STEADFAST COURIER CONFIG TABLE
CREATE TABLE IF NOT EXISTS public.steadfast_config (
  id TEXT PRIMARY KEY DEFAULT 'primary',
  api_key TEXT DEFAULT '',
  secret_key TEXT DEFAULT '',
  base_url TEXT DEFAULT 'https://portal.steadfast.com.bd/api/v1',
  is_active BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default steadfast config if not present
INSERT INTO public.steadfast_config (id, api_key, secret_key, base_url, is_active)
VALUES ('primary', '', '', 'https://portal.steadfast.com.bd/api/v1', false)
ON CONFLICT (id) DO NOTHING;

-- 5. TOURIST SPOTS & LANDMARKS TABLE
CREATE TABLE IF NOT EXISTS public.tourist_spots (
  id TEXT PRIMARY KEY,
  name_bn TEXT NOT NULL,
  name_en TEXT DEFAULT '',
  district_id TEXT NOT NULL,
  district_bn TEXT DEFAULT '',
  description_bn TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  images JSONB DEFAULT '[]'::jsonb,
  location_bn TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tourist_spots_district ON public.tourist_spots (district_id);

-- 6. ENABLE ROW LEVEL SECURITY (RLS) & PUBLIC READ ACCESS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.print_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.steadfast_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tourist_spots ENABLE ROW LEVEL SECURITY;

-- Allow public read access to products
DROP POLICY IF EXISTS "Public read products" ON public.products;
CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);

-- Allow service role and anon to perform operations (RU Insiders uses server API routes with service/admin key)
DROP POLICY IF EXISTS "Full access for API" ON public.products;
CREATE POLICY "Full access for API" ON public.products FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Full access orders for API" ON public.orders;
CREATE POLICY "Full access orders for API" ON public.orders FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Full access print_jobs for API" ON public.print_jobs;
CREATE POLICY "Full access print_jobs for API" ON public.print_jobs FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Full access steadfast for API" ON public.steadfast_config;
CREATE POLICY "Full access steadfast for API" ON public.steadfast_config FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Full access tourist_spots for API" ON public.tourist_spots;
CREATE POLICY "Full access tourist_spots for API" ON public.tourist_spots FOR ALL USING (true) WITH CHECK (true);

-- 7. STORAGE BUCKETS SETUP
-- Insert public buckets for uploaded photos, videos, and PDFs
INSERT INTO storage.buckets (id, name, public)
VALUES ('ru-uploads', 'ru-uploads', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('ru-prints', 'ru-prints', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read on storage
DROP POLICY IF EXISTS "Public storage read ru-uploads" ON storage.objects;
CREATE POLICY "Public storage read ru-uploads" ON storage.objects
FOR SELECT USING (bucket_id IN ('ru-uploads', 'ru-prints'));

-- Allow public/authenticated upload to storage
DROP POLICY IF EXISTS "Public storage insert ru-uploads" ON storage.objects;
CREATE POLICY "Public storage insert ru-uploads" ON storage.objects
FOR INSERT WITH CHECK (bucket_id IN ('ru-uploads', 'ru-prints'));

DROP POLICY IF EXISTS "Public storage update ru-uploads" ON storage.objects;
CREATE POLICY "Public storage update ru-uploads" ON storage.objects
FOR UPDATE USING (bucket_id IN ('ru-uploads', 'ru-prints'));
