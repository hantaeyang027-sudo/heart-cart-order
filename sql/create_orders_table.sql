-- Supabase(Postgres)용 orders 테이블 생성 스크립트
-- Supabase SQL Editor나 psql에 그대로 붙여넣어 실행하세요.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id text UNIQUE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  order_name text NOT NULL,
  customer_name text,
  amount bigint NOT NULL,
  status text NOT NULL DEFAULT 'paid',
  payment_key text,
  items jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);


