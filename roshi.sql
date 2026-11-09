-- ============================================================
-- Wadan Electronics — Complete Supabase SQL Migration
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- ENUMS
-- ============================================================

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status') THEN
    CREATE TYPE order_status AS ENUM (
      'pending',
      'paid',
      'shipped',
      'delivered',
      'cancelled'
    );
  END IF;
END$$;

-- ============================================================
-- HELPER: updated_at trigger function
-- ============================================================

CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- TABLE: categories
-- ============================================================

CREATE TABLE IF NOT EXISTS categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url   TEXT,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_by  UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_categories_slug      ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_is_active ON categories(is_active);
CREATE INDEX IF NOT EXISTS idx_categories_sort_order ON categories(sort_order);

DROP TRIGGER IF EXISTS trg_categories_updated_at ON categories;
CREATE TRIGGER trg_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- ============================================================
-- TABLE: products
-- ============================================================

CREATE TABLE IF NOT EXISTS products (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id      UUID REFERENCES categories(id) ON DELETE SET NULL,
  name             TEXT NOT NULL,
  slug             TEXT NOT NULL UNIQUE,
  description      TEXT,
  price            NUMERIC(10, 2) NOT NULL,
  compare_at_price NUMERIC(10, 2),
  stock            INTEGER NOT NULL DEFAULT 0,
  is_active        BOOLEAN NOT NULL DEFAULT TRUE,
  created_by       UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  search_vector    TSVECTOR
);

CREATE INDEX IF NOT EXISTS idx_products_slug        ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_is_active   ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_price       ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_search      ON products USING GIN(search_vector);

DROP TRIGGER IF EXISTS trg_products_updated_at ON products;
CREATE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- ============================================================
-- TABLE: product_images
-- ============================================================

CREATE TABLE IF NOT EXISTS product_images (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url  TEXT NOT NULL,
  position   INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_position   ON product_images(position);

-- ============================================================
-- TABLE: carts
-- ============================================================

CREATE TABLE IF NOT EXISTS carts (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_carts_user_id ON carts(user_id);

-- ============================================================
-- TABLE: cart_items
-- ============================================================

CREATE TABLE IF NOT EXISTS cart_items (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id    UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity   INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id    ON cart_items(cart_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON cart_items(product_id);

-- ============================================================
-- TABLE: orders
-- ============================================================

CREATE TABLE IF NOT EXISTS orders (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  order_number   TEXT NOT NULL UNIQUE,
  status         order_status NOT NULL DEFAULT 'pending',
  customer_info  JSONB NOT NULL DEFAULT '{}',
  items          JSONB NOT NULL DEFAULT '[]',
  subtotal       NUMERIC(10, 2) NOT NULL,
  shipping       NUMERIC(10, 2) NOT NULL DEFAULT 0,
  total          NUMERIC(10, 2) GENERATED ALWAYS AS (subtotal + shipping) STORED,
  payment_method TEXT NOT NULL DEFAULT 'cod',
  notes          TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_user_id      ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status       ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_created_at   ON orders(created_at DESC);

-- ============================================================
-- TABLE: order_items
-- ============================================================

CREATE TABLE IF NOT EXISTS order_items (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id     UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id   UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  unit_price   NUMERIC(10, 2) NOT NULL,
  quantity     INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id   ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

-- ============================================================
-- TABLE: website_visits
-- ============================================================

CREATE TABLE IF NOT EXISTS website_visits (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id  TEXT NOT NULL,
  page_path   TEXT NOT NULL,
  device_type TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_website_visits_session_id ON website_visits(session_id);
CREATE INDEX IF NOT EXISTS idx_website_visits_created_at ON website_visits(created_at DESC);

-- ============================================================
-- TABLE: banners
-- ============================================================

CREATE TABLE IF NOT EXISTS banners (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  subtitle    TEXT,
  image_url   TEXT NOT NULL,
  link_href   TEXT,
  link_label  TEXT,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_banners_is_active   ON banners(is_active);
CREATE INDEX IF NOT EXISTS idx_banners_sort_order  ON banners(sort_order);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE categories     ENABLE ROW LEVEL SECURITY;
ALTER TABLE products       ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts          ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items     ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders         ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items    ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners        ENABLE ROW LEVEL SECURITY;

-- ── Helper: check admin flag ──────────────────────────────────
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT COALESCE(
    (auth.jwt() -> 'app_metadata' ->> 'admin')::boolean,
    FALSE
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- ── categories ───────────────────────────────────────────────
DROP POLICY IF EXISTS "Public read categories"  ON categories;
DROP POLICY IF EXISTS "Admin write categories"  ON categories;

CREATE POLICY "Public read categories"
  ON categories FOR SELECT USING (TRUE);

CREATE POLICY "Admin write categories"
  ON categories FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- ── products ─────────────────────────────────────────────────
DROP POLICY IF EXISTS "Public read products"  ON products;
DROP POLICY IF EXISTS "Admin write products"  ON products;

CREATE POLICY "Public read products"
  ON products FOR SELECT USING (TRUE);

CREATE POLICY "Admin write products"
  ON products FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- ── product_images ────────────────────────────────────────────
DROP POLICY IF EXISTS "Public read product_images"  ON product_images;
DROP POLICY IF EXISTS "Admin write product_images"  ON product_images;

CREATE POLICY "Public read product_images"
  ON product_images FOR SELECT USING (TRUE);

CREATE POLICY "Admin write product_images"
  ON product_images FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- ── banners ──────────────────────────────────────────────────
DROP POLICY IF EXISTS "Public read banners"  ON banners;
DROP POLICY IF EXISTS "Admin write banners"  ON banners;

CREATE POLICY "Public read banners"
  ON banners FOR SELECT USING (TRUE);

CREATE POLICY "Admin write banners"
  ON banners FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- ── carts / cart_items ────────────────────────────────────────
DROP POLICY IF EXISTS "Users manage own carts"      ON carts;
DROP POLICY IF EXISTS "Admin manage all carts"      ON carts;
DROP POLICY IF EXISTS "Users manage own cart_items" ON cart_items;
DROP POLICY IF EXISTS "Admin manage all cart_items" ON cart_items;

CREATE POLICY "Users manage own carts"
  ON carts FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin manage all carts"
  ON carts FOR ALL USING (is_admin());

CREATE POLICY "Users manage own cart_items"
  ON cart_items FOR ALL
  USING (EXISTS (SELECT 1 FROM carts WHERE carts.id = cart_items.cart_id AND carts.user_id = auth.uid()));

CREATE POLICY "Admin manage all cart_items"
  ON cart_items FOR ALL USING (is_admin());

-- ── orders / order_items ──────────────────────────────────────
DROP POLICY IF EXISTS "Users read own orders"   ON orders;
DROP POLICY IF EXISTS "Users create orders"     ON orders;
DROP POLICY IF EXISTS "Admin manage all orders" ON orders;
DROP POLICY IF EXISTS "Public insert orders"    ON orders;

-- Allow anyone to place an order (guests use null user_id)
CREATE POLICY "Public insert orders"
  ON orders FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Users read own orders"
  ON orders FOR SELECT USING (user_id = auth.uid() OR is_admin());

CREATE POLICY "Admin manage all orders"
  ON orders FOR ALL USING (is_admin());

DROP POLICY IF EXISTS "Users read own order_items"   ON order_items;
DROP POLICY IF EXISTS "Admin manage all order_items" ON order_items;
DROP POLICY IF EXISTS "Public insert order_items"    ON order_items;

CREATE POLICY "Public insert order_items"
  ON order_items FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Users read own order_items"
  ON order_items FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_items.order_id
      AND (orders.user_id = auth.uid() OR is_admin())
  ));

CREATE POLICY "Admin manage all order_items"
  ON order_items FOR ALL USING (is_admin());

-- ── website_visits ────────────────────────────────────────────
DROP POLICY IF EXISTS "Public insert visits" ON website_visits;
DROP POLICY IF EXISTS "Admin read visits"    ON website_visits;

CREATE POLICY "Public insert visits"
  ON website_visits FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Admin read visits"
  ON website_visits FOR SELECT USING (is_admin());

-- ============================================================
-- TABLE: popup_ads
-- ============================================================

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'popup_type') THEN
    CREATE TYPE popup_type AS ENUM (
      'promotional',
      'announcement',
      'newsletter',
      'discount',
      'new_arrival'
    );
  END IF;
END$$;

CREATE TABLE IF NOT EXISTS popup_ads (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  description TEXT,
  image_url   TEXT,
  popup_type  popup_type NOT NULL DEFAULT 'promotional',
  link_href   TEXT,
  link_label  TEXT,
  discount_code TEXT,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  start_date  TIMESTAMPTZ,
  end_date    TIMESTAMPTZ,
  show_delay_ms INTEGER NOT NULL DEFAULT 3000,
  show_once_per_session BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_popup_ads_is_active  ON popup_ads(is_active);
CREATE INDEX IF NOT EXISTS idx_popup_ads_popup_type ON popup_ads(popup_type);
CREATE INDEX IF NOT EXISTS idx_popup_ads_dates      ON popup_ads(start_date, end_date);

DROP TRIGGER IF EXISTS trg_popup_ads_updated_at ON popup_ads;
CREATE TRIGGER trg_popup_ads_updated_at
  BEFORE UPDATE ON popup_ads
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- ============================================================
-- TABLE: product_tags (new_arrival, hot, trending, etc.)
-- ============================================================

CREATE TABLE IF NOT EXISTS product_tags (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  tag        TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_product_tags_product_id ON product_tags(product_id);
CREATE INDEX IF NOT EXISTS idx_product_tags_tag        ON product_tags(tag);
CREATE UNIQUE INDEX IF NOT EXISTS idx_product_tags_unique ON product_tags(product_id, tag);

-- ============================================================
-- ALTER: products — add featured & upcoming flags
-- ============================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'is_featured'
  ) THEN
    ALTER TABLE products ADD COLUMN is_featured BOOLEAN NOT NULL DEFAULT FALSE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'is_upcoming'
  ) THEN
    ALTER TABLE products ADD COLUMN is_upcoming BOOLEAN NOT NULL DEFAULT FALSE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'featured_sort_order'
  ) THEN
    ALTER TABLE products ADD COLUMN featured_sort_order INTEGER NOT NULL DEFAULT 0;
  END IF;
END$$;

CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_is_upcoming ON products(is_upcoming);

-- ============================================================
-- RLS: popup_ads
-- ============================================================

ALTER TABLE popup_ads    ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_tags ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read popup_ads"  ON popup_ads;
DROP POLICY IF EXISTS "Admin write popup_ads"  ON popup_ads;

CREATE POLICY "Public read popup_ads"
  ON popup_ads FOR SELECT USING (TRUE);

CREATE POLICY "Admin write popup_ads"
  ON popup_ads FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- ── product_tags ─────────────────────────────────────────────
DROP POLICY IF EXISTS "Public read product_tags"  ON product_tags;
DROP POLICY IF EXISTS "Admin write product_tags"  ON product_tags;

CREATE POLICY "Public read product_tags"
  ON product_tags FOR SELECT USING (TRUE);

CREATE POLICY "Admin write product_tags"
  ON product_tags FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- ============================================================
-- STORAGE BUCKETS
-- ============================================================

INSERT INTO storage.buckets (id, name, public)
  VALUES ('category-images', 'category-images', true)
  ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
  VALUES ('product-images', 'product-images', true)
  ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
  VALUES ('banner-images', 'banner-images', true)
  ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
  VALUES ('popup-images', 'popup-images', true)
  ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
  VALUES ('project-images', 'project-images', true)
  ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- STORAGE RLS POLICIES
-- ============================================================

-- ── category-images ──────────────────────────────────────────
DROP POLICY IF EXISTS "Public read category-images"  ON storage.objects;
DROP POLICY IF EXISTS "Admin upload category-images"  ON storage.objects;
DROP POLICY IF EXISTS "Admin update category-images"  ON storage.objects;
DROP POLICY IF EXISTS "Admin delete category-images"  ON storage.objects;

CREATE POLICY "Public read category-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'category-images');

CREATE POLICY "Admin upload category-images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'category-images' AND is_admin());

CREATE POLICY "Admin update category-images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'category-images' AND is_admin());

CREATE POLICY "Admin delete category-images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'category-images' AND is_admin());

-- ── product-images ───────────────────────────────────────────
DROP POLICY IF EXISTS "Public read product-images"  ON storage.objects;
DROP POLICY IF EXISTS "Admin upload product-images"  ON storage.objects;
DROP POLICY IF EXISTS "Admin update product-images"  ON storage.objects;
DROP POLICY IF EXISTS "Admin delete product-images"  ON storage.objects;

CREATE POLICY "Public read product-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

CREATE POLICY "Admin upload product-images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'product-images' AND is_admin());

CREATE POLICY "Admin update product-images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'product-images' AND is_admin());

CREATE POLICY "Admin delete product-images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'product-images' AND is_admin());

-- ── banner-images ────────────────────────────────────────────
DROP POLICY IF EXISTS "Public read banner-images"  ON storage.objects;
DROP POLICY IF EXISTS "Admin upload banner-images"  ON storage.objects;
DROP POLICY IF EXISTS "Admin update banner-images"  ON storage.objects;
DROP POLICY IF EXISTS "Admin delete banner-images"  ON storage.objects;

CREATE POLICY "Public read banner-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'banner-images');

CREATE POLICY "Admin upload banner-images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'banner-images' AND is_admin());

CREATE POLICY "Admin update banner-images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'banner-images' AND is_admin());

CREATE POLICY "Admin delete banner-images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'banner-images' AND is_admin());

-- ── popup-images ─────────────────────────────────────────────
DROP POLICY IF EXISTS "Public read popup-images"  ON storage.objects;
DROP POLICY IF EXISTS "Admin upload popup-images"  ON storage.objects;
DROP POLICY IF EXISTS "Admin update popup-images"  ON storage.objects;
DROP POLICY IF EXISTS "Admin delete popup-images"  ON storage.objects;

CREATE POLICY "Public read popup-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'popup-images');

CREATE POLICY "Admin upload popup-images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'popup-images' AND is_admin());

CREATE POLICY "Admin update popup-images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'popup-images' AND is_admin());

CREATE POLICY "Admin delete popup-images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'popup-images' AND is_admin());

-- ── project-images ────────────────────────────────────────────
DROP POLICY IF EXISTS "Public read project-images"  ON storage.objects;
DROP POLICY IF EXISTS "Admin upload project-images"  ON storage.objects;
DROP POLICY IF EXISTS "Admin update project-images"  ON storage.objects;
DROP POLICY IF EXISTS "Admin delete project-images"  ON storage.objects;

CREATE POLICY "Public read project-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'project-images');

CREATE POLICY "Admin upload project-images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'project-images' AND is_admin());

CREATE POLICY "Admin update project-images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'project-images' AND is_admin());

CREATE POLICY "Admin delete project-images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'project-images' AND is_admin());

-- ============================================================
-- SAMPLE BANNER SEED DATA
-- ============================================================



-- ============================================================
-- TABLE: login_attempts (5 Attempts & 15m Cooldown Protection)
-- ============================================================

CREATE TABLE IF NOT EXISTS login_attempts (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT NOT NULL,
  ip_address    TEXT,
  attempt_count INTEGER NOT NULL DEFAULT 0,
  is_locked     BOOLEAN NOT NULL DEFAULT FALSE,
  locked_until  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_login_attempts_email        ON login_attempts(email);
CREATE INDEX IF NOT EXISTS idx_login_attempts_locked_until ON login_attempts(locked_until);
CREATE INDEX IF NOT EXISTS idx_login_attempts_created_at   ON login_attempts(created_at DESC);

DROP TRIGGER IF EXISTS trg_login_attempts_updated_at ON login_attempts;
CREATE TRIGGER trg_login_attempts_updated_at
  BEFORE UPDATE ON login_attempts
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

ALTER TABLE login_attempts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public insert login_attempts" ON login_attempts;
CREATE POLICY "Public insert login_attempts"
  ON login_attempts FOR INSERT WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Public update login_attempts" ON login_attempts;
CREATE POLICY "Public update login_attempts"
  ON login_attempts FOR UPDATE USING (TRUE);

DROP POLICY IF EXISTS "Admin read login_attempts" ON login_attempts;
CREATE POLICY "Admin read login_attempts"
  ON login_attempts FOR SELECT USING (is_admin());

-- ============================================================
-- FUNCTIONS: 5 Attempts & 15-Minute Cooldown Timer Queries
-- ============================================================

-- ── 1. Check if user is locked out (or if 15m timer expired) ──
CREATE OR REPLACE FUNCTION check_login_lockout(p_email TEXT)
RETURNS TABLE (
  is_locked         BOOLEAN,
  remaining_seconds INTEGER,
  attempt_count     INTEGER,
  locked_until      TIMESTAMPTZ
) AS $$
DECLARE
  v_rec RECORD;
BEGIN
  SELECT * INTO v_rec
  FROM login_attempts
  WHERE email = LOWER(TRIM(p_email))
  ORDER BY updated_at DESC
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN QUERY SELECT FALSE, 0, 0, NULL::TIMESTAMPTZ;
    RETURN;
  END IF;

  -- Case A: Still within 15-minute cooldown timer
  IF v_rec.is_locked AND v_rec.locked_until > NOW() THEN
    RETURN QUERY SELECT
      TRUE,
      GREATEST(0, EXTRACT(EPOCH FROM (v_rec.locked_until - NOW()))::INTEGER),
      v_rec.attempt_count,
      v_rec.locked_until;
    RETURN;
  END IF;

  -- Case B: 15-minute timer has expired -> automatically unlock
  IF v_rec.is_locked AND v_rec.locked_until <= NOW() THEN
    UPDATE login_attempts
    SET is_locked = FALSE,
        locked_until = NULL,
        attempt_count = 0,
        updated_at = NOW()
    WHERE id = v_rec.id;

    RETURN QUERY SELECT FALSE, 0, 0, NULL::TIMESTAMPTZ;
    RETURN;
  END IF;

  -- Case C: Not locked
  RETURN QUERY SELECT FALSE, 0, v_rec.attempt_count, NULL::TIMESTAMPTZ;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ── 2. Record failed login attempt (Locks for 15m on 5 attempts) ─
CREATE OR REPLACE FUNCTION record_failed_login(
  p_email            TEXT,
  p_ip               TEXT DEFAULT NULL,
  p_max_attempts     INTEGER DEFAULT 5,
  p_cooldown_minutes INTEGER DEFAULT 15
)
RETURNS TABLE (
  is_locked          BOOLEAN,
  attempts_made      INTEGER,
  attempts_remaining INTEGER,
  remaining_seconds  INTEGER,
  locked_until       TIMESTAMPTZ
) AS $$
DECLARE
  v_rec          RECORD;
  v_attempts     INTEGER;
  v_locked       BOOLEAN := FALSE;
  v_lock_until   TIMESTAMPTZ := NULL;
  v_rem_seconds  INTEGER := 0;
BEGIN
  p_email := LOWER(TRIM(p_email));

  SELECT * INTO v_rec
  FROM login_attempts
  WHERE email = p_email
  ORDER BY updated_at DESC
  LIMIT 1;

  -- If previously locked but cooldown elapsed, reset attempts to 1
  IF FOUND AND v_rec.is_locked AND v_rec.locked_until <= NOW() THEN
    v_attempts := 1;
  -- If currently locked and still in cooldown, maintain lock state
  ELSIF FOUND AND v_rec.is_locked AND v_rec.locked_until > NOW() THEN
    v_locked := TRUE;
    v_lock_until := v_rec.locked_until;
    v_attempts := v_rec.attempt_count;
    v_rem_seconds := GREATEST(0, EXTRACT(EPOCH FROM (v_lock_until - NOW()))::INTEGER);

    RETURN QUERY SELECT v_locked, v_attempts, 0, v_rem_seconds, v_lock_until;
    RETURN;
  -- Normal increment
  ELSIF FOUND THEN
    v_attempts := v_rec.attempt_count + 1;
  ELSE
    v_attempts := 1;
  END IF;

  -- Trigger 15-minute lock when 5 attempts are reached
  IF v_attempts >= p_max_attempts THEN
    v_locked := TRUE;
    v_lock_until := NOW() + (p_cooldown_minutes || ' minutes')::INTERVAL;
    v_rem_seconds := p_cooldown_minutes * 60;
  END IF;

  -- Save attempt
  IF FOUND THEN
    UPDATE login_attempts
    SET attempt_count = v_attempts,
        is_locked = v_locked,
        locked_until = v_lock_until,
        ip_address = COALESCE(p_ip, ip_address),
        updated_at = NOW()
    WHERE id = v_rec.id;
  ELSE
    INSERT INTO login_attempts (email, ip_address, attempt_count, is_locked, locked_until)
    VALUES (p_email, p_ip, v_attempts, v_locked, v_lock_until);
  END IF;

  RETURN QUERY SELECT
    v_locked,
    v_attempts,
    GREATEST(0, p_max_attempts - v_attempts),
    v_rem_seconds,
    v_lock_until;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ── 3. Reset failed attempts after successful login ──────────
CREATE OR REPLACE FUNCTION reset_login_attempts(p_email TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE login_attempts
  SET attempt_count = 0,
      is_locked = FALSE,
      locked_until = NULL,
      updated_at = NOW()
  WHERE email = LOWER(TRIM(p_email));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- ADMIN USER SETUP
-- ============================================================
-- Step 1: Create the user via Supabase Auth UI or the API:
--   Email:    wk@gmail.com
--   Password: 123456
--
-- Step 2: After the user is created, run this query to grant admin access:
--
-- UPDATE auth.users
--   SET raw_app_meta_data = raw_app_meta_data || '{"admin": true}'::jsonb
--   WHERE email = 'wk@gmail.com';
--
-- ============================================================

