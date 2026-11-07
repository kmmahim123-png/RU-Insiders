-- ==============================================================================
-- RU INSIDERS - COMPLETE DATABASE & STORAGE SETUP SCRIPT
-- Execute this script in Supabase SQL Editor for project skqtcsoovtnxxbhtracp
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
  sales_count INTEGER DEFAULT 0,
  customizable BOOLEAN DEFAULT false,
  is_story_highlight BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  video TEXT DEFAULT '',
  badge TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_order ON public.products (order_index ASC);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products (category);

-- 2. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  order_number TEXT DEFAULT '',
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT NOT NULL DEFAULT 'Rajshahi University Campus',
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
  delivered_at TIMESTAMPTZ,
  admin_notes TEXT DEFAULT '',
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

INSERT INTO public.steadfast_config (id, api_key, secret_key, base_url, is_active)
VALUES ('primary', 'DEMO_STEADFAST_KEY_RU_INSIDERS_2026', 'DEMO_STEADFAST_SECRET_SECURE_HASH', 'https://portal.steadfast.com.bd/api/v1', true)
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

-- 6. ROW LEVEL SECURITY (RLS) POLICIES FOR ALL TABLES
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.print_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.steadfast_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tourist_spots ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read products" ON public.products;
CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Full access products for API" ON public.products;
CREATE POLICY "Full access products for API" ON public.products FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Full access orders for API" ON public.orders;
CREATE POLICY "Full access orders for API" ON public.orders FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Full access print_jobs for API" ON public.print_jobs;
CREATE POLICY "Full access print_jobs for API" ON public.print_jobs FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Full access steadfast for API" ON public.steadfast_config;
CREATE POLICY "Full access steadfast for API" ON public.steadfast_config FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Full access tourist_spots for API" ON public.tourist_spots;
CREATE POLICY "Full access tourist_spots for API" ON public.tourist_spots FOR ALL USING (true) WITH CHECK (true);

-- 7. STORAGE BUCKET CREATION (ru-uploads & ru-prints)
INSERT INTO storage.buckets (id, name, public)
VALUES ('ru-uploads', 'ru-uploads', true)
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public)
VALUES ('ru-prints', 'ru-prints', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public storage read ru-uploads" ON storage.objects;
CREATE POLICY "Public storage read ru-uploads" ON storage.objects
FOR SELECT USING (bucket_id IN ('ru-uploads', 'ru-prints'));

DROP POLICY IF EXISTS "Public storage insert ru-uploads" ON storage.objects;
CREATE POLICY "Public storage insert ru-uploads" ON storage.objects
FOR INSERT WITH CHECK (bucket_id IN ('ru-uploads', 'ru-prints'));

DROP POLICY IF EXISTS "Public storage update ru-uploads" ON storage.objects;
CREATE POLICY "Public storage update ru-uploads" ON storage.objects
FOR UPDATE USING (bucket_id IN ('ru-uploads', 'ru-prints'));

DROP POLICY IF EXISTS "Public storage delete ru-uploads" ON storage.objects;
CREATE POLICY "Public storage delete ru-uploads" ON storage.objects
FOR DELETE USING (bucket_id IN ('ru-uploads', 'ru-prints'));

-- 8. SEED INITIAL OFFICIAL PRODUCTS
INSERT INTO public.products (id, slug, name, name_bn, category, description, price, regular_price, cost_price, images, colors, sizes, stock, sales_count, customizable, is_story_highlight, order_index, video, badge)
VALUES
(
  'prod-ru-hoodie-maroon',
  'ru-heritage-winter-hoodie-maroon',
  'RU Heritage Heavyweight Winter Hoodie',
  'রাবি হেরিটেজ উইন্টার হুডি (মেরুন)',
  'hoodies',
  'Premium 340+ GSM fleece hoodie featuring the embossed Rajshahi University emblem, kangaroo pocket, and thermal brushed interior. Built for cold Paris Road morning walks.',
  1150,
  1400,
  680,
  '["/mockups/hoodie-front.jpg", "/mockups/drop-shoulder-front.jpg", "/mockups/jersey-front.jpg", "/mockups/t-shirt-front.jpg"]'::jsonb,
  '[{"name": "Heritage Maroon", "hex": "#881337", "imageIndex": 0}, {"name": "Midnight Black", "hex": "#09090b", "imageIndex": 1}, {"name": "Campus Navy", "hex": "#1e3a8a", "imageIndex": 2}, {"name": "Pure White", "hex": "#ffffff", "imageIndex": 3}]'::jsonb,
  '["M", "L", "XL", "XXL"]'::jsonb,
  45,
  182,
  true,
  true,
  0,
  '',
  'Best Seller'
),
(
  'prod-ru-dropshoulder-paris',
  'paris-road-oversized-dropshoulder',
  'Paris Road Signature Drop Shoulder Tee',
  'প্যারিস রোড ওভারসাইজড ড্রপ শোল্ডার',
  'drop-shoulder',
  '220 GSM 100% combed compact cotton with relaxed drop-shoulder cut. Featuring minimalist RU Paris Road typographic screen print on back and subtle chest crest.',
  580,
  750,
  310,
  '["/mockups/drop-shoulder-front.jpg", "/mockups/t-shirt-front.jpg", "/mockups/hoodie-front.jpg", "/mockups/jersey-front.jpg"]'::jsonb,
  '[{"name": "Vintage Olive", "hex": "#3f6212", "imageIndex": 0}, {"name": "Charcoal Black", "hex": "#18181b", "imageIndex": 1}, {"name": "Off White", "hex": "#f8fafc", "imageIndex": 2}, {"name": "Heritage Maroon", "hex": "#881337", "imageIndex": 3}]'::jsonb,
  '["M", "L", "XL", "XXL"]'::jsonb,
  60,
  245,
  true,
  true,
  1,
  '',
  'Trending'
),
(
  'prod-ru-custom-jersey-2026',
  'ru-inter-dept-sports-jersey-2026',
  'RU Inter-Dept Custom Sports Jersey',
  'রাবি আন্তঃবিভাগ কাস্টম স্পোর্টস জার্সি',
  'jerseys',
  'High-breathability hexagonal micro-mesh poly dry-fit fabric. Fully customized with your department name, roll number, and nickname for tournament play.',
  650,
  850,
  340,
  '["/mockups/jersey-front.jpg", "/mockups/t-shirt-front.jpg", "/mockups/hoodie-front.jpg", "/mockups/drop-shoulder-front.jpg"]'::jsonb,
  '[{"name": "Motihar Green & Gold", "hex": "#047857", "imageIndex": 0}, {"name": "Padma Blue & White", "hex": "#0284c7", "imageIndex": 1}, {"name": "Crimson Pride", "hex": "#be123c", "imageIndex": 2}]'::jsonb,
  '["M", "L", "XL", "XXL"]'::jsonb,
  120,
  410,
  true,
  true,
  2,
  '',
  'Tournament Pick'
),
(
  'prod-ru-shabash-ganji',
  'shabash-bangladesh-classic-cotton-tee',
  'Shabash Bangladesh Classic Cotton Tee (গেঞ্জি)',
  'শাবাশ বাংলাদেশ ক্লাসিক কটন টি-শার্ট',
  't-shirts',
  '190 GSM 100% breathable organic ring-spun combed cotton. High-definition screen printed illustration of the iconic Nitun Kundu sculpture at Rajshahi University.',
  390,
  480,
  195,
  '["/mockups/t-shirt-front.jpg", "/mockups/drop-shoulder-front.jpg", "/mockups/jersey-front.jpg", "/mockups/hoodie-front.jpg"]'::jsonb,
  '[{"name": "Campus Heather Grey", "hex": "#64748b", "imageIndex": 0}, {"name": "Pure White", "hex": "#ffffff", "imageIndex": 1}, {"name": "Midnight Black", "hex": "#09090b", "imageIndex": 2}]'::jsonb,
  '["M", "L", "XL", "XXL"]'::jsonb,
  85,
  128,
  true,
  true,
  3,
  '',
  'Iconic'
),
(
  'prod-ru-varsity-jacket',
  'ru-insiders-leatherette-varsity-jacket',
  'RU Insiders Edition Leatherette Varsity Jacket',
  'রাবি ইনসাইডার্স লেদারেট ভার্সিটি জ্যাকেট',
  'hoodies',
  'Heavyweight wool blend torso with premium vegan leather sleeves, custom chenille RU chest crest, striped ribbed cuffs, and quilted insulated lining.',
  2200,
  2800,
  1350,
  '["/mockups/hoodie-front.jpg", "/mockups/drop-shoulder-front.jpg", "/mockups/jersey-front.jpg", "/mockups/t-shirt-front.jpg"]'::jsonb,
  '[{"name": "Navy & Bone White", "hex": "#0f172a", "imageIndex": 0}, {"name": "Forest Green & Cream", "hex": "#064e3b", "imageIndex": 1}]'::jsonb,
  '["M", "L", "XL"]'::jsonb,
  15,
  38,
  false,
  true,
  4,
  '',
  'Limited Edition'
),
(
  'prod-ru-totebag',
  'ru-campus-canvas-totebag',
  'Rajshahi University Campus Canvas Tote Bag',
  'রাজশাহী বিশ্ববিদ্যালয় ক্যাম্পাস ক্যানভাস টোটব্যাগ',
  'accessories',
  '14oz heavy eco-friendly organic cotton canvas tote. Perfect for carrying class notes, iPad, books, and everyday library essentials across campus.',
  280,
  350,
  120,
  '["/mockups/t-shirt-front.jpg", "/mockups/drop-shoulder-front.jpg"]'::jsonb,
  '[{"name": "Natural Off-White", "hex": "#fef3c7", "imageIndex": 0}, {"name": "Midnight Black", "hex": "#0f172a", "imageIndex": 1}]'::jsonb,
  '["Free Size"]'::jsonb,
  90,
  175,
  false,
  false,
  5,
  '',
  'Everyday'
)
ON CONFLICT (id) DO NOTHING;


-- ==============================================================================
-- 9. CAMPUS NEWS, LITERATURE & POETRY ARTICLES TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.campus_articles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT DEFAULT '',
  category TEXT NOT NULL DEFAULT 'poetry',
  category_bn TEXT DEFAULT 'সাহিত্য ও কবিতা',
  author_name TEXT NOT NULL,
  author_dept TEXT DEFAULT '',
  author_role TEXT DEFAULT 'শিক্ষার্থী',
  published_at TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  content TEXT NOT NULL,
  excerpt TEXT DEFAULT '',
  tags JSONB DEFAULT '[]'::jsonb,
  likes_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'published',
  external_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.campus_articles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read campus_articles" ON public.campus_articles;
CREATE POLICY "Public read campus_articles" ON public.campus_articles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Full access campus_articles for API" ON public.campus_articles;
CREATE POLICY "Full access campus_articles for API" ON public.campus_articles FOR ALL USING (true) WITH CHECK (true);
