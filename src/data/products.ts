import pizzaGoguma from "@/assets/pizza-goguma.jpg";
import pizzaBasil from "@/assets/pizza-basil.jpg";
import pizzaMushroom from "@/assets/pizza-mushroom.jpg";
import pizzaBulgogi from "@/assets/pizza-bulgogi.jpg";
import pizzaShrimp from "@/assets/pizza-shrimp.jpg";
import pizzaCorn from "@/assets/pizza-corn.jpg";
import pizzaCheese from "@/assets/pizza-cheese.jpg";
import pizzaChicken from "@/assets/pizza-chicken.jpg";
import pizzaPineapple from "@/assets/pizza-pineapple.jpg";
import pizzaPepperoni from "@/assets/pizza-pepperoni.jpg";

export type Category = "베스트셀러" | "트렌드" | "매니아";

export interface Product {
  id: string;
  name: string;
  description: string;
  concept: string;
  marketing_point: string;
  price: number;
  image_url_main: string;
  category: Category;
  ingredients: string;
}

export const products: Product[] = [
  {
    id: "1",
    name: "치즈 피자",
    description: "4가지 치즈가 듬뿍! 치즈 러버를 위한 피자",
    concept: "클래식",
    marketing_point: "늘어나는 치즈의 향연",
    price: 18000,
    image_url_main: pizzaCheese,
    category: "베스트셀러",
    ingredients: "모짜렐라, 체다, 고르곤졸라, 파마산 치즈",
  },
  {
    id: "2",
    name: "페퍼로니 피자",
    description: "바삭하게 구운 페퍼로니의 풍미",
    concept: "클래식",
    marketing_point: "정통 아메리칸 스타일",
    price: 19000,
    image_url_main: pizzaPepperoni,
    category: "베스트셀러",
    ingredients: "페퍼로니, 모짜렐라 치즈, 토마토 소스",
  },
  {
    id: "3",
    name: "불고기 피자",
    description: "달콤한 한식 불고기와 피자의 완벽한 조화",
    concept: "퓨전",
    marketing_point: "한국인이 사랑하는 맛",
    price: 22000,
    image_url_main: pizzaBulgogi,
    category: "베스트셀러",
    ingredients: "불고기, 양파, 파프리카, 모짜렐라 치즈",
  },
  {
    id: "4",
    name: "바질 크림 피자",
    description: "신선한 바질과 리코타 치즈의 프리미엄 조합",
    concept: "프리미엄",
    marketing_point: "이탈리아 정통 레시피",
    price: 24000,
    image_url_main: pizzaBasil,
    category: "트렌드",
    ingredients: "바질 페스토, 리코타 치즈, 올리브 오일",
  },
  {
    id: "5",
    name: "트러플 버섯 피자",
    description: "향긋한 트러플 오일과 다양한 버섯의 깊은 맛",
    concept: "프리미엄",
    marketing_point: "미식가를 위한 선택",
    price: 28000,
    image_url_main: pizzaMushroom,
    category: "매니아",
    ingredients: "트러플 오일, 표고버섯, 양송이, 새송이",
  },
  {
    id: "6",
    name: "쉬림프 피자",
    description: "탱글탱글 새우와 크리미한 소스",
    concept: "시푸드",
    marketing_point: "바다의 신선함",
    price: 25000,
    image_url_main: pizzaShrimp,
    category: "트렌드",
    ingredients: "통새우, 마늘 크림소스, 모짜렐라 치즈",
  },
  {
    id: "7",
    name: "고구마 피자",
    description: "달콤한 고구마 무스와 베이컨의 조화",
    concept: "스위트",
    marketing_point: "달콤함이 필요할 때",
    price: 21000,
    image_url_main: pizzaGoguma,
    category: "베스트셀러",
    ingredients: "고구마 무스, 베이컨, 마요네즈",
  },
  {
    id: "8",
    name: "옥수수 피자",
    description: "알알이 씹히는 달콤한 옥수수",
    concept: "스위트",
    marketing_point: "아이들이 좋아하는",
    price: 18000,
    image_url_main: pizzaCorn,
    category: "매니아",
    ingredients: "스위트콘, 마요네즈, 모짜렐라 치즈",
  },
  {
    id: "9",
    name: "핫치킨 피자",
    description: "매콤한 치킨과 고소한 치즈의 만남",
    concept: "스파이시",
    marketing_point: "매운맛 매니아를 위한",
    price: 23000,
    image_url_main: pizzaChicken,
    category: "트렌드",
    ingredients: "양념치킨, 청양고추, 모짜렐라 치즈",
  },
  {
    id: "10",
    name: "하와이안 피자",
    description: "상큼한 파인애플과 베이컨의 클래식",
    concept: "클래식",
    marketing_point: "달콤 짭짤의 조화",
    price: 20000,
    image_url_main: pizzaPineapple,
    category: "매니아",
    ingredients: "파인애플, 베이컨, 모짜렐라 치즈",
  },
];
