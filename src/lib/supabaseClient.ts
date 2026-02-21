import { createClient } from "@supabase/supabase-js";

// Supabase 설정 (하드코딩)
const SUPABASE_URL = "https://vokdtihuzdbcgylftrar.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_klGjzjvvb3yU-XXXNBu-4w_V_9X5Rbp";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
export default supabase;


