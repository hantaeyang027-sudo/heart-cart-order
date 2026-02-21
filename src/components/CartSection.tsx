import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { smoothScrollToElement } from "@/lib/scroll";
import PurchaseButton from "@/components/PurchaseButton";
import type { OrderItemPayload } from "@/types/order";

const CartSection = () => {
  const { items, updateQuantity, removeItem, totalItems, totalPrice, clear } = useCart();

  const orderItems: OrderItemPayload[] = items.map((it) => ({
    productId: it.product.id,
    name: it.product.name,
    price: it.product.price,
    quantity: it.quantity,
  }));

  const buildOrderName = () => {
    if (items.length === 0) return "장바구니가 비어있습니다";
    if (items.length === 1) {
      return `${items[0].product.name} x ${items[0].quantity}`;
    }
    return `${items[0].product.name} 외 ${items.length - 1}건`;
  };

  return (
    <section id="cart" className="py-16 bg-secondary/30 border-t border-border">
      <div className="container mx-auto px-4 space-y-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">내가 담은 피자</p>
            <h2 className="text-3xl font-bold text-foreground">장바구니 ({totalItems})</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="ghost" onClick={() => smoothScrollToElement("menu", 80, 900)}>
              메인 메뉴로 돌아가기
            </Button>
            <Button variant="secondary" onClick={() => smoothScrollToElement("menu", 80, 900)}>
              메뉴 담으러 가기
            </Button>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/60 bg-background/70 p-10 text-center space-y-4">
            <p className="text-lg text-muted-foreground">아직 담은 피자가 없어요.</p>
            <Button size="lg" onClick={() => smoothScrollToElement("menu", 80, 900)}>
              지금 인기 메뉴 보러가기
            </Button>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
            <div className="space-y-4">
              {items.map((it) => (
                <div
                  key={it.product.id}
                  className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl bg-card p-5 shadow-warm"
                >
                  <div className="flex-1 space-y-1">
                    <h3 className="text-lg font-semibold text-foreground">{it.product.name}</h3>
                    <p className="text-muted-foreground">
                      {new Intl.NumberFormat("ko-KR").format(it.product.price)}원
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" onClick={() => updateQuantity(it.product.id, it.quantity - 1)}>
                      -
                    </Button>
                    <span className="w-8 text-center font-semibold">{it.quantity}</span>
                    <Button variant="outline" size="sm" onClick={() => updateQuantity(it.product.id, it.quantity + 1)}>
                      +
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => removeItem(it.product.id)}>
                      삭제
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-2xl bg-card p-6 shadow-warm-lg space-y-4">
              <div className="flex items-center justify-between text-lg">
                <span>합계</span>
                <span className="text-2xl font-bold">
                  {new Intl.NumberFormat("ko-KR").format(totalPrice)}
                  <span className="text-base ml-1">원</span>
                </span>
              </div>
              <div className="flex flex-col gap-3">
                <Button variant="outline" onClick={clear}>
                  전체 비우기
                </Button>
                <PurchaseButton
                  amount={totalPrice}
                  orderName={buildOrderName()}
                  items={orderItems}
                  disabled={items.length === 0}
                >
                  구매하기
                </PurchaseButton>
              </div>
              <Button variant="ghost" onClick={() => smoothScrollToElement("menu", 80, 900)}>
                메인 화면으로
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CartSection;

