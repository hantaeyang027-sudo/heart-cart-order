import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import pizzaCheese from "@/assets/pizza-cheese.jpg";
import { smoothScrollToElement } from "@/lib/scroll";

const HeroSection = () => {
  const scrollToMenu = () => {
    smoothScrollToElement("menu", 80, 900);
  };

  return (
    <section className="relative min-h-[80vh] flex items-center bg-gradient-hero overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-6 animate-fade-in-up">
            <div className="inline-block px-4 py-1.5 bg-primary/10 rounded-full text-primary font-medium text-sm">
              🍕 정성 가득 수제 피자
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              <span className="text-primary">도윤이의</span>
              <br />
              피자가게에
              <br />
              오신 걸 환영해요!
            </h1>
            <p className="text-lg text-muted-foreground max-w-md">
              매일 아침 반죽부터 시작하는 정직한 피자.
              신선한 재료와 정성으로 만든 도윤이네 피자를 맛보세요.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button variant="hero" size="xl" onClick={scrollToMenu}>
                메뉴 보기
              </Button>
              <Button variant="outline" size="xl">
                주문하기
              </Button>
            </div>
            <div className="flex items-center gap-6 pt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="text-xl">🚗</span>
                <span>무료 배달</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl">⏱️</span>
                <span>30분 내 도착</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl">🔥</span>
                <span>화덕 피자</span>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative animate-fade-in-up stagger-2">
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-warm-lg transform hover:scale-[1.02] transition-transform duration-500">
              <img
                src={pizzaCheese}
                alt="도윤이의 피자가게 시그니처 치즈 피자"
                className="w-full h-[400px] lg:h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent" />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-4 -left-4 bg-card rounded-2xl p-4 shadow-warm-lg animate-float z-20">
              <div className="flex items-center gap-3">
                <span className="text-3xl">⭐</span>
                <div>
                  <p className="font-bold text-foreground">4.9점</p>
                  <p className="text-sm text-muted-foreground">1,234개 리뷰</p>
                </div>
              </div>
            </div>
            {/* Background decoration */}
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-accent/10 rounded-full blur-3xl" />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={scrollToMenu}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
      >
        <span className="text-sm">메뉴 보기</span>
        <ChevronDown className="h-5 w-5 animate-bounce" />
      </button>
    </section>
  );
};

export default HeroSection;
