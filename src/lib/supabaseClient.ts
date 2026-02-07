import { createClient } from "@supabase/supabase-js";

// 환경변수에서 Supabase 설정 가져오기
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error(
    "⚠️ Supabase 환경변수가 설정되지 않았습니다.\n" +
    "프로젝트 루트에 .env 파일을 생성하고 다음 변수들을 설정하세요:\n" +
    "- VITE_SUPABASE_URL\n" +
    "- VITE_SUPABASE_ANON_KEY"
  );
}

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("Supabase 환경변수가 필요합니다. .env 파일을 확인하세요.");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
export default supabase;


