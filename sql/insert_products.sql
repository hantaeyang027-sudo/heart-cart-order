-- products.json 데이터를 products 테이블에 삽입하는 SQL 스크립트
-- Supabase SQL Editor나 psql에 그대로 붙여넣어 실행하세요.
-- 주의: create_products_table.sql을 먼저 실행한 후 이 스크립트를 실행하세요.

-- 기존 데이터 삭제 (선택사항 - 필요시 주석 해제)
-- DELETE FROM products;

-- 상품 데이터 삽입
INSERT INTO products (product_id, name, description, concept, marketing_point, price, image_url_main, category, ingredients)
VALUES
  ('1', '치즈 피자', '4가지 치즈가 듬뿍! 치즈 러버를 위한 피자', '클래식', '늘어나는 치즈의 향연', 18000, '@/assets/pizza-cheese.jpg', '베스트셀러', '모짜렐라, 체다, 고르곤졸라, 파마산 치즈'),
  ('2', '페퍼로니 피자', '바삭하게 구운 페퍼로니의 풍미', '클래식', '정통 아메리칸 스타일', 19000, '@/assets/pizza-pepperoni.jpg', '베스트셀러', '페퍼로니, 모짜렐라 치즈, 토마토 소스'),
  ('3', '불고기 피자', '달콤한 한식 불고기와 피자의 완벽한 조화', '퓨전', '한국인이 사랑하는 맛', 22000, '@/assets/pizza-bulgogi.jpg', '베스트셀러', '불고기, 양파, 파프리카, 모짜렐라 치즈'),
  ('4', '바질 크림 피자', '신선한 바질과 리코타 치즈의 프리미엄 조합', '프리미엄', '이탈리아 정통 레시피', 24000, '@/assets/pizza-basil.jpg', '트렌드', '바질 페스토, 리코타 치즈, 올리브 오일'),
  ('5', '트러플 버섯 피자', '향긋한 트러플 오일과 다양한 버섯의 깊은 맛', '프리미엄', '미식가를 위한 선택', 28000, '@/assets/pizza-mushroom.jpg', '매니아', '트러플 오일, 표고버섯, 양송이, 새송이'),
  ('6', '쉬림프 피자', '탱글탱글 새우와 크리미한 소스', '시푸드', '바다의 신선함', 25000, '@/assets/pizza-shrimp.jpg', '트렌드', '통새우, 마늘 크림소스, 모짜렐라 치즈'),
  ('7', '고구마 피자', '달콤한 고구마 무스와 베이컨의 조화', '스위트', '달콤함이 필요할 때', 21000, '@/assets/pizza-goguma.jpg', '베스트셀러', '고구마 무스, 베이컨, 마요네즈'),
  ('8', '옥수수 피자', '알알이 씹히는 달콤한 옥수수', '스위트', '아이들이 좋아하는', 18000, '@/assets/pizza-corn.jpg', '매니아', '스위트콘, 마요네즈, 모짜렐라 치즈'),
  ('9', '핫치킨 피자', '매콤한 치킨과 고소한 치즈의 만남', '스파이시', '매운맛 매니아를 위한', 23000, '@/assets/pizza-chicken.jpg', '트렌드', '양념치킨, 청양고추, 모짜렐라 치즈'),
  ('10', '하와이안 피자', '상큼한 파인애플과 베이컨의 클래식', '클래식', '달콤 짭짤의 조화', 20000, '@/assets/pizza-pineapple.jpg', '매니아', '파인애플, 베이컨, 모짜렐라 치즈')
ON CONFLICT (product_id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  concept = EXCLUDED.concept,
  marketing_point = EXCLUDED.marketing_point,
  price = EXCLUDED.price,
  image_url_main = EXCLUDED.image_url_main,
  category = EXCLUDED.category,
  ingredients = EXCLUDED.ingredients,
  updated_at = now();

