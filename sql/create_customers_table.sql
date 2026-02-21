-- Supabase(Postgres)용 customers 테이블 생성 스크립트
-- Supabase SQL Editor나 psql에 그대로 붙여넣어 실행하세요.
-- 이미 존재하는 테이블이 있어도 에러 없이 실행됩니다.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 고객 테이블 생성 (이미 존재하면 스킵)
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text UNIQUE,
  phone text,
  address text,
  postal_code text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 인덱스 생성 (이미 존재하면 스킵)
CREATE INDEX IF NOT EXISTS idx_customers_user_id ON customers(user_id);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_created_at ON customers(created_at DESC);

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
    WHERE tgname = 'update_customers_updated_at' 
    AND tgrelid = 'customers'::regclass
  ) THEN
    DROP TRIGGER update_customers_updated_at ON customers;
  END IF;
  
  CREATE TRIGGER update_customers_updated_at
    BEFORE UPDATE ON customers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
END $$;

