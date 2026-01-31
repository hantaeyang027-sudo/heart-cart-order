-- Supabase payments 테이블 RLS/정책 설정 스크립트
-- 기존 테이블 생성(create_payments_table.sql) 실행 후 아래 내용을 실행하세요.

-- Row Level Security 활성화
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- 사용자 본인 데이터만 조회 가능
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'payments'
      AND policyname = 'select_own_payments'
  ) THEN
    CREATE POLICY select_own_payments
      ON payments
      FOR SELECT
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- 사용자 본인 ID로만 결제 내역 기록 가능
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'payments'
      AND policyname = 'insert_own_payments'
  ) THEN
    CREATE POLICY insert_own_payments
      ON payments
      FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

