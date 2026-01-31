import { ShoppingCart, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState, MouseEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import supabase from "@/lib/supabaseClient";
import LoginModal from "./LoginModal";
import { useCart } from "@/context/CartContext";
import { smoothScrollToElement } from "@/lib/scroll";

const Header = () => {
  const { totalItems } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    let mounted = true;
    // 초기 사용자 정보 조회
    supabase.auth.getUser().then(({ data, error }) => {
      if (!mounted) return;
      if (!error) setUser(data.user ?? null);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      mounted = false;
      sub.subscription?.unsubscribe?.();
    };
  }, []);

  const navigateWithScroll = (target: "menu" | "cart") => {
    if (location.pathname === "/") {
      smoothScrollToElement(target, 80, 900);
    } else {
      navigate("/", { state: { scrollTo: target } });
    }
  };

  const handleMenuScroll = (event?: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    event?.preventDefault();
    navigateWithScroll("menu");
  };

  const handleEventNavigate = (event?: MouseEvent<HTMLAnchorElement>) => {
    event?.preventDefault();
    if (location.pathname === "/events") {
      smoothScrollToElement("events", 0, 600);
    } else {
      navigate("/events");
    }
  };

  const handleCartNavigate = () => {
    navigateWithScroll("cart");
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-card/95 backdrop-blur-md border-b border-border shadow-warm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 group">
          <span className="text-2xl font-bold text-primary transition-transform group-hover:scale-105">
            도윤이의
          </span>
          <span className="text-2xl font-bold text-foreground">
            피자가게
          </span>
          <span className="text-primary text-xl">♥</span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <a
            href="#menu"
            onClick={handleMenuScroll}
            className="text-foreground/80 hover:text-primary font-medium transition-colors"
          >
            메뉴
          </a>
          <a
            href="/events"
            onClick={handleEventNavigate}
            className="text-foreground/80 hover:text-primary font-medium transition-colors"
          >
            이벤트
          </a>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Button variant="ghost" size="sm" className="hidden md:flex" onClick={() => navigate("/mypage")}>
                마이페이지
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="hidden md:flex"
                onClick={async () => {
                  await supabase.auth.signOut();
                  setUser(null);
                  // optional: redirect to homepage
                  // location.href = "/";
                }}
              >
                로그아웃
              </Button>
            </>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="hidden md:flex"
              onClick={() => setShowLogin(true)}
            >
              로그인
            </Button>
          )}
          <Button variant="ghost" size="icon" className="relative" onClick={handleCartNavigate}>
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                {totalItems}
              </span>
            )}
          </Button>
          <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} onSuccess={(u) => setUser(u)} />
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
