-- Supabase(Postgres)용 products 테이블 생성 스크립트
-- Supabase SQL Editor나 psql에 그대로 붙여넣어 실행하세요.
-- 이미 존재하는 테이블이 있어도 에러 없이 실행됩니다.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 상품 테이블 생성 (이미 존재하면 스킵)
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  concept text,
  marketing_point text,
  price bigint NOT NULL,
  image_url_main text,
  category text NOT NULL,
  ingredients text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 인덱스 생성 (이미 존재하면 스킵)
CREATE INDEX IF NOT EXISTS idx_products_product_id ON products(product_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);

-- updated_at 자동 업데이트 트리거 함수 (이미 존재하면 업데이트)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- updated_at 트리거 생성 (이미 존재하면 재생성)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_products_updated_at' 
    AND tgrelid = 'products'::regclass
  ) THEN
    DROP TRIGGER update_products_updated_at ON products;
  END IF;
  
  CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
END $$;

