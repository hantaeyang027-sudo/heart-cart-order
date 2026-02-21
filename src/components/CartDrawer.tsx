import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import PurchaseButton from "@/components/PurchaseButton";
import type { OrderItemPayload } from "@/types/order";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer = ({ isOpen, onClose }: CartDrawerProps) => {
  const { items, updateQuantity, removeItem, totalItems, totalPrice, clear } = useCart();

  const orderItems: OrderItemPayload[] = items.map((it) => ({
    productId: it.product.id,
    name: it.product.name,
    price: it.product.price,
    quantity: it.quantity,
  }));

  const orderName = (() => {
    if (items.length === 0) return "장바구니가 비어있습니다";
    if (items.length === 1) return `${items[0].product.name} x ${items[0].quantity}`;
    return `${items[0].product.name} 외 ${items.length - 1}건`;
  })();

  if (!isOpen) return null;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 70 }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(2,6,23,0.4)" }} />
      <aside
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          height: "100%",
          width: 360,
          background: "#fff",
          boxShadow: "-10px 0 30px rgba(2,6,23,0.12)",
          padding: 16,
        }}
      >
        <h3 style={{ marginTop: 0 }}>장바구니 ({totalItems})</h3>
        {items.length === 0 ? (
          <div>장바구니가 비어있습니다.</div>
        ) : (
          <>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {items.map((it) => (
                <li key={it.product.id} style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>{it.product.name}</div>
                    <div style={{ color: "#666", fontSize: 13 }}>
                      {new Intl.NumberFormat("ko-KR").format(it.product.price)}원
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <button onClick={() => updateQuantity(it.product.id, it.quantity - 1)}>-</button>
                    <div>{it.quantity}</div>
                    <button onClick={() => updateQuantity(it.product.id, it.quantity + 1)}>+</button>
                    <button onClick={() => removeItem(it.product.id)}>삭제</button>
                  </div>
                </li>
              ))}
            </ul>
            <div style={{ marginTop: 12, borderTop: "1px solid #eee", paddingTop: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <div>합계</div>
                <div style={{ fontWeight: 700 }}>{new Intl.NumberFormat("ko-KR").format(totalPrice)}원</div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <Button onClick={() => { clear(); onClose(); }}>전체 비우기</Button>
                <PurchaseButton
                  amount={totalPrice}
                  orderName={orderName}
                  items={orderItems}
                  style={{ flex: 1 }}
                  disabled={items.length === 0}
                  onClick={(event) => {
                    // prevent closing drawer before Toss redirects
                    event.stopPropagation();
                  }}
                >
                  구매하기
                </PurchaseButton>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  );
};

export default CartDrawer;


