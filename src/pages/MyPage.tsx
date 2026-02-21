import { useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import supabase from "@/lib/supabaseClient";
import type { OrderItemPayload, OrderRecord } from "@/types/order";
import LoginModal from "@/components/LoginModal";

const MyPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return;
      const nextUser = (data?.user as User | null) ?? null;
      setUser(nextUser);
      if (nextUser) {
        void fetchOrders(nextUser);
      } else {
        setLoading(false);
      }
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const nextUser = (session?.user as User | null) ?? null;
      setUser(nextUser);
      if (nextUser) {
        void fetchOrders(nextUser);
      } else {
        setOrders([]);
      }
    });

    return () => {
      mounted = false;
      sub.subscription?.unsubscribe?.();
    };
  }, []);

  const fetchOrders = async (currentUser: User) => {
    setLoading(true);
    setError(null);
    const { data, error: supabaseError } = await supabase
      .from("orders")
      .select("id, order_id, order_name, amount, status, items, payment_key, created_at, customer_name")
      .eq("user_id", currentUser.id)
      .order("created_at", { ascending: false });

    if (supabaseError) {
      setError(supabaseError.message || "주문 내역을 불러오지 못했습니다.");
      setOrders([]);
    } else {
      setOrders(
        (data ?? []).map((row) => ({
          id: row.id,
          orderId: row.order_id,
          orderName: row.order_name,
          amount: row.amount,
          status: row.status,
          paymentKey: row.payment_key,
          items: (row.items as OrderItemPayload[]) ?? [],
          customerName: row.customer_name ?? undefined,
          userId: currentUser.id,
          createdAt: row.created_at,
        })),
      );
    }
    setLoading(false);
  };

  const summary = useMemo(() => {
    const totalAmount = orders.reduce((sum, order) => sum + (order.amount || 0), 0);
    return {
      count: orders.length,
      totalAmount,
    };
  }, [orders]);

  const formatCurrency = (value: number) => new Intl.NumberFormat("ko-KR").format(value);
  const formatDate = (value: string) => new Date(value).toLocaleString("ko-KR");

  const renderOrders = () => {
    if (loading) {
      return <p className="text-center text-muted-foreground py-10">주문 내역을 불러오는 중입니다...</p>;
    }

    if (error) {
      return (
        <div className="text-center text-destructive font-medium py-10">
          {error}
          <div className="mt-4">
            <Button variant="outline" onClick={() => user && fetchOrders(user)}>
              다시 시도하기
            </Button>
          </div>
        </div>
      );
    }

    if (orders.length === 0) {
      return <p className="text-center text-muted-foreground py-10">아직 주문 내역이 없습니다.</p>;
    }

    return (
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="rounded-2xl border border-border bg-card p-6 shadow-warm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm text-muted-foreground">주문번호</p>
                <p className="text-lg font-semibold">{order.orderId}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">결제일시</p>
                <p className="font-semibold">{formatDate(order.createdAt)}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm text-muted-foreground">주문명</p>
                <p className="text-foreground font-semibold">{order.orderName}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">금액</p>
                <p className="text-2xl font-bold text-primary">{formatCurrency(order.amount)}원</p>
              </div>
            </div>
            <div className="rounded-xl bg-secondary/20 border border-border/60 p-4 space-y-2">
              <p className="text-sm text-muted-foreground">주문 상품</p>
              <ul className="list-disc pl-5 text-left text-sm space-y-1">
                {order.items.map((item, idx) => (
                  <li key={`${order.id}-${idx}`}>
                    {item.name} × {item.quantity}개 (
                    {formatCurrency(item.price * item.quantity)}
                    원)
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-wrap items-center justify-between text-sm text-muted-foreground">
              <span className="font-medium">
                상태: <span className="text-primary">{order.status}</span>
              </span>
              {order.paymentKey && (
                <span className="font-mono text-xs bg-card/80 px-2 py-1 rounded border border-border/60">
                  {order.paymentKey}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-warm">
      <Header />
      <main className="container mx-auto px-4 py-16 space-y-12">
        <section className="rounded-3xl bg-card shadow-warm-lg p-8 space-y-6 border border-border/60">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-primary">MY PAGE</p>
              <h1 className="text-3xl font-bold text-foreground">마이페이지</h1>
              <p className="text-muted-foreground mt-2">주문 내역과 기본 정보를 한눈에 확인하세요.</p>
            </div>
            <div className="text-right">
              {user ? (
                <>
                  <p className="font-semibold text-foreground">{user.email}</p>
                  <p className="text-sm text-muted-foreground">
                    {typeof user.user_metadata?.full_name === "string" ? user.user_metadata.full_name : "이름 미입력"}
                  </p>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">로그인 후 이용할 수 있습니다.</p>
              )}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-border/70 bg-secondary/20 p-5">
              <p className="text-sm text-muted-foreground">총 주문 건수</p>
              <p className="text-3xl font-bold text-foreground">{summary.count}건</p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-secondary/20 p-5">
              <p className="text-sm text-muted-foreground">총 결제 금액</p>
              <p className="text-3xl font-bold text-primary">{formatCurrency(summary.totalAmount)}원</p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-secondary/20 p-5 flex flex-col gap-3">
              <p className="text-sm text-muted-foreground">계정 관리</p>
              {user ? (
                <div className="flex gap-2 flex-wrap">
                  <Button size="sm" variant="outline" onClick={() => fetchOrders(user)}>
                    새로고침
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={async () => {
                      await supabase.auth.signOut();
                      setUser(null);
                      setOrders([]);
                    }}
                  >
                    로그아웃
                  </Button>
                </div>
              ) : (
                <Button size="sm" onClick={() => setShowLogin(true)}>
                  로그인하기
                </Button>
              )}
            </div>
          </div>
        </section>

        <section className="rounded-3xl bg-card shadow-warm-lg p-8 border border-border/60">
          <h2 className="text-2xl font-bold text-foreground mb-6">주문 내역</h2>
          {user ? renderOrders() : <p className="text-center text-muted-foreground py-10">로그인 후 확인할 수 있습니다.</p>}
        </section>
      </main>
      <Footer />
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} onSuccess={(u) => {
        setShowLogin(false);
        setUser(u);
        void fetchOrders(u as User);
      }} />
    </div>
  );
};

export default MyPage;


