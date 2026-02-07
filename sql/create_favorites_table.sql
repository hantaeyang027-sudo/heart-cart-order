-- Supabase favorites 테이블 생성 스크립트
-- payments 테이블과 동일하게 SQL Editor에서 실행하세요.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_favorites_user_product ON favorites(user_id, product_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user_created_at ON favorites(user_id, created_at DESC);

