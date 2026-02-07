import { Button } from "@/components/ui/button";
import { useFavorites } from "@/hooks/useFavorites";
import { products } from "@/data/products";
import { useCart } from "@/context/CartContext";

const FavoriteSection = () => {
  const { favorites, loading, user } = useFavorites();
  const { addItem } = useCart();

  if (loading || !user) {
    return null;
  }

  const favoriteProducts = products.filter((product) => favorites.includes(product.id));

  return (
    <section className="py-12 bg-secondary/20 border-y border-border/60">
      <div className="container mx-auto px-4 space-y-6">
        <header className="flex flex-col gap-2">
          <p className="text-sm font-medium text-primary">나만의 즐겨찾기</p>
          <div className="flex flex-wrap items-center gap-3 justify-between">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">자주 찾는 피자 모음</h2>
            {favoriteProducts.length > 0 && (
              <p className="text-sm text-muted-foreground">
                총 <span className="font-semibold text-primary">{favoriteProducts.length}</span>개 피자를 저장했어요
              </p>
            )}
          </div>
        </header>

        {favoriteProducts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-primary/30 bg-card p-6 text-center space-y-3">
            <p className="text-lg font-semibold text-foreground">아직 즐겨찾기한 피자가 없어요.</p>
            <p className="text-sm text-muted-foreground">메뉴에서 하트를 눌러 나만의 피자 리스트를 만들어보세요!</p>
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-2">
            {favoriteProducts.map((product) => (
              <div
                key={product.id}
                className="min-w-[260px] bg-card rounded-2xl shadow-warm-lg border border-border/40 overflow-hidden"
              >
                <div className="h-40 overflow-hidden">
                  <img src={product.image_url_main} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-4 space-y-2">
                  <div>
                    <p className="text-xs text-muted-foreground">{product.category}</p>
                    <h3 className="text-lg font-semibold text-foreground line-clamp-1">{product.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-primary font-bold">
                      {new Intl.NumberFormat("ko-KR").format(product.price)}
                      <span className="text-sm text-muted-foreground font-normal ml-1">원</span>
                    </span>
                    <Button size="sm" onClick={() => addItem(product, 1)}>
                      바로 담기
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FavoriteSection;

