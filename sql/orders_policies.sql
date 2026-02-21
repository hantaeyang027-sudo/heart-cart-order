-- orders 테이블 RLS 정책 설정 스크립트

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'orders'
      AND policyname = 'select_own_orders'
  ) THEN
    CREATE POLICY select_own_orders
      ON orders
      FOR SELECT
      USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'orders'
      AND policyname = 'insert_own_orders'
  ) THEN
    CREATE POLICY insert_own_orders
      ON orders
      FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;


