import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FavoriteSection from "@/components/FavoriteSection";
import ProductGrid from "@/components/ProductGrid";
import CartSection from "@/components/CartSection";
import Footer from "@/components/Footer";
import { smoothScrollToElement } from "@/lib/scroll";

const Index = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const target = location.state?.scrollTo as "menu" | "cart" | undefined;
    if (target) {
      requestAnimationFrame(() => smoothScrollToElement(target, 80, 900));
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <FavoriteSection />
        <ProductGrid />
        <CartSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
