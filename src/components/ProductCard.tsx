import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart } from "lucide-react";
import type { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/hooks/useFavorites";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface ProductCardProps {
  product: Product;
  index: number;
}

const ProductCard = ({ product, index }: ProductCardProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR").format(price);
  };

  const { addItem } = useCart();
  const { toast } = useToast();
  const { isFavorite, toggleFavorite } = useFavorites();
  const navigate = useNavigate();

  const handleFavoriteClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const result = await toggleFavorite(product.id);
    if (result && "error" in result && result.error) {
      if (result.error === "LOGIN_REQUIRED") {
        toast({
          title: "로그인이 필요해요",
          description: "즐겨찾기는 로그인 후 이용할 수 있어요.",
        });
      } else {
        toast({
          title: "즐겨찾기 처리 실패",
          description: result.error,
          variant: "destructive",
        });
      }
    }
  };

  const favoriteActive = isFavorite(product.id);

  const handleNavigateDetail = () => {
    navigate(`/products/${product.id}`);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleNavigateDetail();
    }
  };

  return (
    <article
      className={`group relative bg-card rounded-2xl overflow-hidden shadow-warm hover:shadow-warm-hover transition-all duration-500 hover:-translate-y-2 animate-fade-in-up opacity-0 stagger-${(index % 6) + 1}`}
      onClick={handleNavigateDetail}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={product.image_url_main}
          alt={`${product.name} - ${product.description}`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Category Badge */}
        <span className="absolute top-4 left-4 px-3 py-1 bg-card/90 backdrop-blur-sm rounded-full text-xs font-medium text-foreground">
          {product.category}
        </span>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleFavoriteClick}
          aria-pressed={favoriteActive}
          className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-300 ${
            favoriteActive
              ? "bg-primary text-primary-foreground shadow-warm"
              : "bg-card/90 backdrop-blur-sm text-foreground/80 hover:bg-primary hover:text-primary-foreground"
          }`}
        >
          <Heart className={`h-4 w-4 ${favoriteActive ? "fill-current" : ""}`} />
        </button>

        {/* Quick Add Button */}
        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
          <Button
            variant="hero"
            className="w-full"
            size="default"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              addItem(product, 1);
              toast({
                title: "장바구니에 담았어요",
                description: `${product.name}을(를) 추가했습니다.`,
              });
            }}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            장바구니 담기
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <span className="px-2 py-0.5 bg-accent/10 text-accent text-xs font-medium rounded">
            {product.concept}
          </span>
        </div>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <p className="text-xl font-bold text-primary">
            {formatPrice(product.price)}
            <span className="text-sm font-normal text-muted-foreground">원</span>
          </p>
          <p className="text-xs text-muted-foreground">
            {product.marketing_point}
          </p>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
