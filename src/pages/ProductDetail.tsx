import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { products } from "@/data/products";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import PurchaseButton from "@/components/PurchaseButton";
import { useToast } from "@/hooks/use-toast";

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);

  const product = useMemo(() => products.find((item) => item.id === productId), [productId]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-24 text-center space-y-6">
          <p className="text-2xl font-semibold text-foreground">상품을 찾을 수 없습니다.</p>
          <Button size="lg" onClick={() => navigate("/")}>
            메뉴로 돌아가기
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const increase = () => setQuantity((prev) => Math.min(prev + 1, 99));
  const decrease = () => setQuantity((prev) => Math.max(prev - 1, 1));

  const formattedPrice = new Intl.NumberFormat("ko-KR").format(product.price);
  const totalAmount = product.price * quantity;
  const totalFormatted = new Intl.NumberFormat("ko-KR").format(totalAmount);

  const handleAddToCart = () => {
    addItem(product, quantity);
    toast({
      title: "장바구니에 담았어요",
      description: `${product.name} x ${quantity}`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-warm">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="rounded-3xl overflow-hidden shadow-warm-lg bg-card">
            <img
              src={product.image_url_main}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-6 bg-card/90 rounded-3xl shadow-warm-lg p-8 border border-border/40">
            <div className="space-y-3">
              <p className="text-sm font-medium text-primary">{product.category}</p>
              <h1 className="text-4xl font-bold text-foreground">{product.name}</h1>
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
              <p className="text-sm text-accent font-semibold">{product.marketing_point}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">주요 재료</p>
              <p className="text-base font-medium text-foreground bg-secondary/30 rounded-2xl px-4 py-3">
                {product.ingredients}
              </p>
            </div>

            <div className="rounded-2xl bg-secondary/20 border border-border/60 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">단품 가격</span>
                <span className="text-2xl font-bold text-primary">{formattedPrice}원</span>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="icon" onClick={decrease} aria-label="수량 감소">
                    -
                  </Button>
                  <span className="text-2xl font-semibold w-12 text-center">{quantity}</span>
                  <Button variant="outline" size="icon" onClick={increase} aria-label="수량 증가">
                    +
                  </Button>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">총 결제 금액</p>
                  <p className="text-3xl font-bold text-foreground">
                    {totalFormatted}
                    <span className="text-base font-normal text-muted-foreground ml-1">원</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" size="lg" className="flex-1" onClick={handleAddToCart}>
                장바구니 담기
              </Button>
              <PurchaseButton
                size="lg"
                className="flex-1"
                amount={totalAmount}
                orderName={`${product.name} x ${quantity}`}
                items={[
                  {
                    productId: product.id,
                    name: product.name,
                    price: product.price,
                    quantity,
                  },
                ]}
              >
                구매하기
              </PurchaseButton>
            </div>

            <Button variant="ghost" onClick={() => navigate(-1)}>
              뒤로 가기
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;


