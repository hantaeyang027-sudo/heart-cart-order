import { useState, useMemo } from "react";
import ProductCard from "@/components/ProductCard";
import CategoryFilter from "@/components/CategoryFilter";
import { products, type Category } from "@/data/products";

const ProductGrid = () => {
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);

  const categories: Category[] = ["베스트셀러", "트렌드", "매니아"];

  const filteredProducts = useMemo(() => {
    if (!activeCategory) return products;
    return products.filter((product) => product.category === activeCategory);
  }, [activeCategory]);

  return (
    <section id="menu" className="py-20 bg-gradient-warm">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <span className="inline-block px-4 py-1.5 bg-primary/10 rounded-full text-primary font-medium text-sm mb-4">
            MENU
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            도윤이네 <span className="text-primary">시그니처 피자</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            매일 아침 갓 반죽한 도우와 신선한 재료로 만든 
            도윤이네 피자를 만나보세요.
          </p>
        </div>

        {/* Category Filter */}
        <CategoryFilter
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        {/* Product Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground">해당 카테고리에 상품이 없습니다.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;
