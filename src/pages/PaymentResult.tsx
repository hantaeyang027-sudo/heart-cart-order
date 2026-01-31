import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { getOrderSession, clearOrderSession } from "@/lib/orderStorage";
import supabase from "@/lib/supabaseClient";

type SaveStatus = "idle" | "saving" | "saved" | "error" | "missing" | "unauthenticated";

const PaymentResult = () => {
  const { status } = useParams<{ status: "success" | "fail" }>();
  const navigate = useNavigate();
  const search = useLocation().search;

  const query = useMemo(() => new URLSearchParams(search), [search]);
  const isSuccess = status === "success";
  const orderId = query.get("orderId") || "";
  const paymentKey = query.get("paymentKey") || "";
  const amountParam = query.get("amount");
  const amountNumber = amountParam ? Number(amountParam) : undefined;

  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isSuccess || !orderId) return;
    const orderSession = getOrderSession(orderId);
    if (!orderSession) {
      setSaveStatus("missing");
      setSaveMessage("주문 정보를 찾지 못해 DB에 저장하지 못했습니다.");
      return;
    }

    let mounted = true;

    const persistOrder = async () => {
      setSaveStatus("saving");
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (!mounted) return;
      const user = userData.user;
      if (userError || !user) {
        setSaveStatus("unauthenticated");
        setSaveMessage("다시 로그인 후 결제를 진행해 주세요.");
        return;
      }
      if (user.id !== orderSession.userId) {
        setSaveStatus("error");
        setSaveMessage("주문 정보와 사용자 정보가 일치하지 않습니다.");
        return;
      }

      const payload = {
        user_id: user.id,
        order_id: orderId,
        amount: orderSession.amount,
        status: "paid",
        payment_key: paymentKey || null,
        order_name: orderSession.orderName,
        items: orderSession.items,
        customer_name: orderSession.customerName || user.email,
      };

      const { error: insertError } = await supabase.from("orders").insert([payload]);

      if (insertError && insertError.code !== "23505") {
        setSaveStatus("error");
        setSaveMessage(insertError.message || "주문 정보를 저장하지 못했습니다.");
        return;
      }

      clearOrderSession(orderId);
      setSaveStatus("saved");
      setSaveMessage("주문 내역이 저장되었습니다. 마이페이지에서 확인하세요.");
    };

    void persistOrder();

    return () => {
      mounted = false;
    };
  }, [isSuccess, orderId, paymentKey]);

  const highlightKeys = isSuccess
    ? ["orderId", "paymentKey", "amount"]
    : ["code", "message"];

  const rows = highlightKeys
    .map((key) => {
      const value = query.get(key);
      if (!value) return null;
      return { key, value };
    })
    .filter(Boolean) as { key: string; value: string }[];

  const renderSaveStatus = () => {
    if (!isSuccess) return null;
    switch (saveStatus) {
      case "saving":
        return "주문 내역을 저장하는 중이에요...";
      case "saved":
        return saveMessage;
      case "missing":
      case "error":
      case "unauthenticated":
        return saveMessage;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto bg-card rounded-3xl shadow-warm-lg p-10 space-y-8 text-center">
          <div className="space-y-3">
            <p className="text-sm font-semibold text-primary">Toss Payments</p>
            <h1 className="text-3xl font-bold text-foreground">
              {isSuccess ? "결제가 완료되었어요" : "결제에 실패했어요"}
            </h1>
            <p className="text-muted-foreground">
              {isSuccess
                ? "주문이 정상적으로 접수되었습니다. 자세한 내용은 아래 정보를 참고해 주세요."
                : query.get("message") || "다시 시도하거나 다른 결제 수단을 사용해 주세요."}
            </p>
            {isSuccess && amountNumber && (
              <p className="text-lg font-semibold text-primary">
                총 결제 금액: {new Intl.NumberFormat("ko-KR").format(amountNumber)}원
              </p>
            )}
            {renderSaveStatus() && (
              <div className="text-sm text-primary font-medium bg-primary/5 rounded-xl px-3 py-2 border border-primary/20">
                {renderSaveStatus()}
              </div>
            )}
          </div>

          {rows.length > 0 && (
            <div className="rounded-2xl border border-border/60 bg-secondary/10 text-left divide-y divide-border/50">
              {rows.map((row) => (
                <div key={row.key} className="flex items-center justify-between px-6 py-4">
                  <span className="text-sm text-muted-foreground uppercase tracking-wide">{row.key}</span>
                  <span className="font-semibold text-foreground">{row.value}</span>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="flex-1" size="lg" onClick={() => navigate("/")}>
              메인으로 돌아가기
            </Button>
            <Button
              className="flex-1"
              size="lg"
              variant="outline"
              onClick={() => navigate("/", { state: { scrollTo: "cart" } })}
            >
              장바구니 확인하기
            </Button>
            <Button className="flex-1" size="lg" variant="secondary" onClick={() => navigate("/mypage")}>
              마이페이지 바로가기
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentResult;


