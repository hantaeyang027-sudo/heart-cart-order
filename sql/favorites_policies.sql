-- Supabase favorites 테이블 RLS/정책 스크립트
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'favorites'
      AND policyname = 'select_own_favorites'
  ) THEN
    CREATE POLICY select_own_favorites
      ON favorites
      FOR SELECT
      USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'favorites'
      AND policyname = 'insert_own_favorites'
  ) THEN
    CREATE POLICY insert_own_favorites
      ON favorites
      FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'favorites'
      AND policyname = 'delete_own_favorites'
  ) THEN
    CREATE POLICY delete_own_favorites
      ON favorites
      FOR DELETE
      USING (auth.uid() = user_id);
  END IF;
END $$;

