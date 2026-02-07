import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const EventSection = () => {
  const navigate = useNavigate();

  const goToMenu = () => navigate("/", { state: { scrollTo: "menu" } });
  const goToCart = () => navigate("/", { state: { scrollTo: "cart" } });

  return (
    <section id="events" className="py-16 bg-gradient-to-b from-secondary/40 to-background">
      <div className="container mx-auto px-4 max-w-4xl space-y-6 text-center">
        <p className="text-sm uppercase tracking-widest text-primary font-semibold">Review Event</p>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground">리뷰 이벤트 진행 중!</h2>
        <p className="text-lg text-muted-foreground leading-relaxed">
          주문 후 후기 마지막 줄에 <span className="font-semibold text-primary">#도윤아 피자빵먹어</span> 를 입력해 주세요.
          해시태그를 남겨주신 모든 분께 시원한 음료 서비스를 드립니다. 사랑 가득한 리뷰로 도윤이네 피자가게를 응원해 주세요!
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button variant="hero" size="lg" onClick={goToMenu}>
            메뉴 보러가기
          </Button>
          <Button variant="outline" size="lg" onClick={goToCart}>
            장바구니 확인
          </Button>
        </div>
      </div>
    </section>
  );
};

export default EventSection;

