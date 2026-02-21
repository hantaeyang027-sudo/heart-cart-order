-- Supabase(Postgres)용 payments 테이블 생성 스크립트
-- Supabase SQL Editor나 psql에 그대로 붙여넣어 실행하세요.

-- pgcrypto 확장 필요 (gen_random_uuid 사용)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 결제내역 테이블
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  amount bigint NOT NULL,
  status text NOT NULL DEFAULT 'paid',
  items jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 인덱스 (사용자별 조회 성능 향상)
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);

-- 예시: 테스트 레코드 삽입
-- INSERT INTO payments (user_id, amount, status, items) VALUES ('<user-uuid>', 25000, 'paid', '[{"id":"p1","name":"피자","price":12000,"quantity":2}]');


