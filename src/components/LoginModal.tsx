import React, { useState } from "react";
import supabase from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: any) => void;
}

const LoginModal = ({ isOpen, onClose, onSuccess }: LoginModalProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  async function handleSignIn() {
    setLoading(true);
    setMessage(null);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setMessage(error.message || "로그인 실패");
      return;
    }
    setMessage("로그인 성공");
    onSuccess(data.user ?? null);
    onClose();
  }

  async function handleSignUp() {
    setLoading(true);
    setMessage(null);
    const { data, error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) {
      setMessage(error.message || "회원가입 실패");
      return;
    }
    setMessage("회원가입 요청이 전송되었습니다. 이메일을 확인하세요.");
  }

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 60 }}>
      <div
        onClick={onClose}
        style={{ position: "absolute", inset: 0, background: "rgba(2,6,23,0.5)" }}
      />
      <div
        role="dialog"
        aria-modal="true"
        style={{
          position: "relative",
          maxWidth: 420,
          margin: "10vh auto",
          background: "#fff",
          padding: 20,
          borderRadius: 8,
          boxShadow: "0 10px 30px rgba(2,6,23,0.2)",
        }}
      >
        <h3 style={{ margin: 0, marginBottom: 12 }}>로그인</h3>
        <label style={{ display: "block", fontSize: 13, marginBottom: 6 }}>이메일</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="you@example.com"
          style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #e2e8f0" }}
        />

        <label style={{ display: "block", fontSize: 13, margin: "12px 0 6px" }}>비밀번호</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="비밀번호"
          style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #e2e8f0" }}
        />

        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <Button onClick={handleSignIn} disabled={loading}>
            {loading ? "로그인..." : "로그인"}
          </Button>
          <Button variant="secondary" onClick={handleSignUp} disabled={loading}>
            회원가입
          </Button>
        </div>
        {message && (
          <div style={{ marginTop: 10, color: message.includes("성공") ? "#065f46" : "#e11d48" }}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginModal;


