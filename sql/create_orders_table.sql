-- Supabase(Postgres)용 orders 테이블 생성 스크립트
-- Supabase SQL Editor나 psql에 그대로 붙여넣어 실행하세요.
-- 주의: products와 customers 테이블을 먼저 생성한 후 실행하세요.
-- 이미 존재하는 테이블이 있어도 에러 없이 실행됩니다.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 주문 테이블 생성 (이미 존재하면 스킵)
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id text UNIQUE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_id uuid REFERENCES customers(id) ON DELETE SET NULL,
  order_name text NOT NULL,
  customer_name text,
  amount bigint NOT NULL,
  status text NOT NULL DEFAULT 'paid',
  payment_key text,
  items jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 기존 테이블에 customer_id 컬럼이 없으면 추가
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' 
    AND column_name = 'customer_id'
  ) THEN
    ALTER TABLE orders 
    ADD COLUMN customer_id uuid REFERENCES customers(id) ON DELETE SET NULL;
  END IF;
END $$;

-- updated_at 컬럼이 없으면 추가
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' 
    AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE orders 
    ADD COLUMN updated_at timestamptz NOT NULL DEFAULT now();
  END IF;
END $$;

-- 인덱스 생성 (이미 존재하면 스킵)
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

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
    WHERE tgname = 'update_orders_updated_at' 
    AND tgrelid = 'orders'::regclass
  ) THEN
    DROP TRIGGER update_orders_updated_at ON orders;
  END IF;
  
  CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
END $$;


