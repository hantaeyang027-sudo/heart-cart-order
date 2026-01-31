import { createClient } from "@supabase/supabase-js";

// 개발 편의: 환경변수가 없으면 제공된 값을 fallback으로 사용합니다.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://vokdtihuzdbcgylftrar.supabase.co";
const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZva2R0aWh1emRiY2d5bGZ0cmFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwMDQzMjUsImV4cCI6MjA4MzU4MDMyNX0.Vm9aw8AlUvV49AU1iMXyi1jPMGH8EgDS-9V8KEg5BTQ";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
export default supabase;


