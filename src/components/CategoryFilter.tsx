import { Button } from "@/components/ui/button";
import type { Category } from "@/data/products";

interface CategoryFilterProps {
  categories: Category[];
  activeCategory: Category | null;
  onCategoryChange: (category: Category | null) => void;
}

const CategoryFilter = ({ categories, activeCategory, onCategoryChange }: CategoryFilterProps) => {
  return (
    <div className="flex flex-wrap justify-center gap-3 mb-10">
      <Button
        variant={activeCategory === null ? "categoryActive" : "category"}
        size="lg"
        onClick={() => onCategoryChange(null)}
      >
        전체
      </Button>
      {categories.map((category) => (
        <Button
          key={category}
          variant={activeCategory === category ? "categoryActive" : "category"}
          size="lg"
          onClick={() => onCategoryChange(category)}
        >
          {category}
        </Button>
      ))}
    </div>
  );
};

export default CategoryFilter;
