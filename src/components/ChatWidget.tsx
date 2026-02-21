import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, X, Send, Loader2, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { products, type Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";

interface SearchResult {
  product_id: string;
  name: string;
  description?: string;
  price: number;
  category?: string;
  image_url?: string;
}

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  searchResults?: SearchResult[];
}

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "안녕하세요! 도윤이의 피자가게입니다. 무엇을 도와드릴까요?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { addItem, items, totalItems, totalPrice } = useCart();
  const { toast } = useToast();

  // OpenAI API Key (환경 변수에서 가져오기)
  const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || "";

  // Function Calling을 위한 함수 정의들
  const availableFunctions = {
    get_product_info: (args: { product_name?: string; product_id?: string }) => {
      let product: Product | undefined;
      if (args.product_id) {
        product = products.find((p) => p.id === args.product_id);
      } else if (args.product_name) {
        product = products.find(
          (p) => p.name.includes(args.product_name) || args.product_name?.includes(p.name)
        );
      }
      
      if (!product) {
        return JSON.stringify({ error: "상품을 찾을 수 없습니다." });
      }
      
      return JSON.stringify({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        ingredients: product.ingredients,
        concept: product.concept,
      });
    },

    search_products: async (args: { product_name: string }) => {
      try {
        console.log("상품 검색 시작:", args.product_name);
        
        // Supabase에서 상품 이름으로 검색 (대소문자 구분 없이)
        const { data, error } = await supabase
          .from("products")
          .select("product_id, name, description, price, category, ingredients, concept, marketing_point, image_url_main")
          .ilike("name", `%${args.product_name}%`)
          .order("name", { ascending: true });

        if (error) {
          console.error("Supabase 검색 오류 상세:", {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code,
          });
          
          // Supabase 오류 시 로컬 데이터로 fallback
          console.log("로컬 데이터로 fallback 검색 시도");
          const keyword = args.product_name.toLowerCase();
          const matched = products.filter(
            (p) =>
              p.name.toLowerCase().includes(keyword) ||
              p.description.toLowerCase().includes(keyword) ||
              p.ingredients.toLowerCase().includes(keyword) ||
              p.category.toLowerCase().includes(keyword)
          );
          
          if (matched.length === 0) {
            return JSON.stringify({ 
              message: `"${args.product_name}"에 해당하는 상품을 찾을 수 없습니다.`,
              results: [],
              note: "데이터베이스 연결에 문제가 있어 로컬 데이터에서 검색했습니다."
            });
          }
          
          return JSON.stringify({
            message: `${matched.length}개의 상품을 찾았습니다.`,
            results: matched.map((p) => ({
              product_id: p.id,
              name: p.name,
              description: p.description,
              price: p.price,
              category: p.category,
              ingredients: p.ingredients,
              concept: p.concept,
              image_url: p.image_url_main,
            })),
            note: "데이터베이스 연결에 문제가 있어 로컬 데이터에서 검색했습니다."
          });
        }

        if (!data || data.length === 0) {
          // Supabase에서 결과가 없을 때도 로컬 데이터로 fallback
          console.log("Supabase에서 결과 없음, 로컬 데이터로 fallback 검색 시도");
          const keyword = args.product_name.toLowerCase();
          const matched = products.filter(
            (p) =>
              p.name.toLowerCase().includes(keyword) ||
              p.description.toLowerCase().includes(keyword) ||
              p.ingredients.toLowerCase().includes(keyword) ||
              p.category.toLowerCase().includes(keyword)
          );
          
          if (matched.length === 0) {
            return JSON.stringify({ 
              message: `"${args.product_name}"에 해당하는 상품을 찾을 수 없습니다.`,
              results: []
            });
          }
          
          return JSON.stringify({
            message: `${matched.length}개의 상품을 찾았습니다.`,
            results: matched.map((p) => ({
              product_id: p.id,
              name: p.name,
              description: p.description,
              price: p.price,
              category: p.category,
              ingredients: p.ingredients,
              concept: p.concept,
              image_url: p.image_url_main,
            })),
          });
        }

        console.log("Supabase 검색 성공:", data.length, "개 결과");
        return JSON.stringify({
          message: `${data.length}개의 상품을 찾았습니다.`,
          results: data.map((p) => ({
            product_id: p.product_id,
            name: p.name,
            description: p.description,
            price: Number(p.price),
            category: p.category,
            ingredients: p.ingredients,
            concept: p.concept,
            marketing_point: p.marketing_point,
            image_url: p.image_url_main,
          })),
        });
      } catch (error) {
        console.error("상품 검색 예외 오류:", error);
        
        // 예외 발생 시에도 로컬 데이터로 fallback
        try {
          const keyword = args.product_name.toLowerCase();
          const matched = products.filter(
            (p) =>
              p.name.toLowerCase().includes(keyword) ||
              p.description.toLowerCase().includes(keyword) ||
              p.ingredients.toLowerCase().includes(keyword) ||
              p.category.toLowerCase().includes(keyword)
          );
          
          if (matched.length === 0) {
            return JSON.stringify({ 
              error: `"${args.product_name}"에 해당하는 상품을 찾을 수 없습니다.`,
              results: []
            });
          }
          
          return JSON.stringify({
            message: `${matched.length}개의 상품을 찾았습니다.`,
            results: matched.map((p) => ({
              product_id: p.id,
              name: p.name,
              description: p.description,
              price: p.price,
              category: p.category,
              ingredients: p.ingredients,
              concept: p.concept,
              image_url: p.image_url_main,
            })),
            note: "데이터베이스 연결에 문제가 있어 로컬 데이터에서 검색했습니다."
          });
        } catch (fallbackError) {
          console.error("Fallback 검색도 실패:", fallbackError);
          return JSON.stringify({ 
            error: "상품 검색 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
            results: []
          });
        }
      }
    },

    add_to_cart: (args: { product_name: string; quantity?: number }) => {
      const product = products.find(
        (p) => p.name.includes(args.product_name) || args.product_name.includes(p.name)
      );
      
      if (!product) {
        return JSON.stringify({ error: `"${args.product_name}" 상품을 찾을 수 없습니다.` });
      }
      
      const quantity = args.quantity || 1;
      addItem(product, quantity);
      
      return JSON.stringify({
        success: true,
        message: `${product.name} ${quantity}개를 장바구니에 추가했습니다.`,
        product: {
          name: product.name,
          price: product.price,
          quantity: quantity,
          total: product.price * quantity,
        },
      });
    },

    get_cart_info: () => {
      return JSON.stringify({
        totalItems: totalItems,
        totalPrice: totalPrice,
        items: items.map((item) => ({
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
          subtotal: item.product.price * item.quantity,
        })),
      });
    },
  };

  // 메시지 추가 시 스크롤을 맨 아래로
  useEffect(() => {
    if (isOpen && scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages, isOpen]);

  // 채팅창 열릴 때 입력창 포커스
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Function Calling을 위한 함수 정의 스키마
  const functions = [
    {
      name: "get_product_info",
      description: "상품 이름이나 ID로 상품의 상세 정보를 조회합니다.",
      parameters: {
        type: "object",
        properties: {
          product_name: {
            type: "string",
            description: "상품 이름 (예: 치즈 피자, 페퍼로니 피자)",
          },
          product_id: {
            type: "string",
            description: "상품 ID (예: 1, 2, 3)",
          },
        },
      },
    },
    {
      name: "search_products",
      description: "사용자가 상품 이름을 말하면 Supabase 데이터베이스에서 상품을 검색합니다. 고객이 특정 상품을 찾거나 검색할 때 사용합니다.",
      parameters: {
        type: "object",
        properties: {
          product_name: {
            type: "string",
            description: "검색할 상품 이름 (예: 치즈 피자, 페퍼로니, 불고기)",
          },
        },
        required: ["product_name"],
      },
    },
    {
      name: "add_to_cart",
      description: "상품을 장바구니에 추가합니다. 고객이 주문하고 싶어할 때 사용합니다.",
      parameters: {
        type: "object",
        properties: {
          product_name: {
            type: "string",
            description: "장바구니에 추가할 상품 이름",
          },
          quantity: {
            type: "number",
            description: "추가할 수량 (기본값: 1)",
          },
        },
        required: ["product_name"],
      },
    },
    {
      name: "get_cart_info",
      description: "현재 장바구니에 담긴 상품 목록과 총 금액을 조회합니다.",
      parameters: {
        type: "object",
        properties: {},
      },
    },
  ];

  const callOpenAI = async (
    userInput: string,
    conversationHistory: Message[],
    functionCallHistory: Array<{ role: string; name?: string; content?: string | null; function_call?: any }> = [],
    lastSearchResults?: SearchResult[]
  ): Promise<{ response: string; searchResults?: SearchResult[] }> => {
    try {
      // 대화 히스토리를 OpenAI 형식으로 변환
      const messages = conversationHistory
        .filter((msg) => msg.sender !== "bot" || !msg.text.includes("현재 판매 중인 상품 목록"))
        .map((msg) => ({
          role: msg.sender === "user" ? "user" : "assistant",
          content: msg.text,
        }));

      // 함수 호출 히스토리 추가 (재귀 호출 시에는 userInput을 다시 추가하지 않음)
      const allMessages = functionCallHistory.length > 0
        ? [
            ...messages,
            ...functionCallHistory,
          ]
        : [
            ...messages,
            { role: "user" as const, content: userInput },
          ];

      // 시스템 프롬프트 추가
      const systemPrompt = `당신은 도윤이의 피자가게의 친절한 고객 상담 챗봇입니다.

고객의 질문에 친절하고 도움이 되는 답변을 해주세요. 상품 정보, 주문, 배달 등에 대해 안내할 수 있습니다.

**함수 사용 가이드:**
- 고객이 상품을 주문하고 싶어하면: add_to_cart 함수를 사용하여 장바구니에 추가해주세요.
- 고객이 특정 상품 이름을 말하거나 검색을 요청하면: search_products 함수를 사용하여 Supabase 데이터베이스에서 상품을 검색하세요. (예: "치즈 피자 찾아줘", "페퍼로니 있어?", "불고기 피자 검색해줘", "고구마 피자")
- 상품의 상세 정보가 필요하면: get_product_info 함수를 사용하세요.
- 장바구니 정보가 필요하면: get_cart_info 함수를 사용하세요.

**중요:**
- search_products 함수의 결과를 받으면, results 배열에 있는 상품들을 친절하게 소개해주세요.
- results가 비어있거나 error가 있으면, 고객에게 친절하게 다른 상품을 찾아보거나 도와드릴 수 있는 다른 방법을 제안해주세요.
- 함수 결과의 message 필드를 참고하되, 고객에게는 더 자연스럽고 친절한 말투로 전달해주세요.`;

      // 개발 환경에서는 프록시를 통해, 프로덕션에서는 직접 호출
      const apiUrl = import.meta.env.DEV 
        ? "/api/openai/v1/chat/completions"
        : "https://api.openai.com/v1/chat/completions";
      
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            ...allMessages,
          ],
          functions: functions,
          function_call: "auto",
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error?.message || response.statusText;
        console.error("OpenAI API 오류 상세:", {
          status: response.status,
          statusText: response.statusText,
          error: errorData,
        });
        throw new Error(`OpenAI API 오류 (${response.status}): ${errorMessage}`);
      }

      const data = await response.json();
      const message = data.choices[0]?.message;

      // 함수 호출이 필요한 경우
      if (message?.function_call) {
        const functionName = message.function_call.name;
        const functionArgs = JSON.parse(message.function_call.arguments || "{}");
        
        console.log("함수 호출:", functionName, functionArgs);

        // 함수 실행
        const functionToCall = availableFunctions[functionName as keyof typeof availableFunctions];
        if (functionToCall) {
          // async 함수인지 확인하고 처리
          const functionResult = await (functionToCall as any)(functionArgs);
          
          // search_products 함수 결과에서 검색 결과 추출
          let extractedSearchResults: SearchResult[] | undefined;
          if (functionName === "search_products") {
            try {
              const parsed = JSON.parse(functionResult);
              if (parsed.results && Array.isArray(parsed.results)) {
                extractedSearchResults = parsed.results.map((r: any) => ({
                  product_id: r.product_id,
                  name: r.name,
                  description: r.description,
                  price: r.price,
                  category: r.category,
                  image_url: r.image_url || products.find(p => p.id === r.product_id || p.name === r.name)?.image_url_main,
                }));
              }
            } catch (e) {
              console.error("검색 결과 파싱 오류:", e);
            }
          }
          
          // 함수 결과를 다시 AI에 전달
          const newFunctionCallHistory = [
            ...functionCallHistory,
            { role: "assistant" as const, content: null, function_call: message.function_call },
            {
              role: "function" as const,
              name: functionName,
              content: functionResult,
            },
          ];

          // 재귀적으로 다시 호출하여 최종 응답 받기
          const result = await callOpenAI(userInput, conversationHistory, newFunctionCallHistory, extractedSearchResults);
          return result;
        } else {
          return { response: "죄송합니다. 요청하신 기능을 처리할 수 없습니다." };
        }
      }

      return { 
        response: message?.content || "죄송합니다. 응답을 생성할 수 없습니다.",
        searchResults: lastSearchResults
      };
    } catch (error) {
      console.error("OpenAI API 호출 오류:", error);
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw error;
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userInput = inputValue.trim();
    
    // 사용자 메시지 추가
    const userMessage: Message = {
      id: Date.now().toString(),
      text: userInput,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // "테스트" 키워드 체크
    if (userInput === "테스트") {
      // 상품 이름 목록 생성
      const productNames = products.map((product, index) => 
        `${index + 1}. ${product.name}`
      ).join("\n");
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `현재 판매 중인 상품 목록입니다:\n\n${productNames}\n\n총 ${products.length}개의 상품이 있습니다.`,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsLoading(false);
    } else {
      // OpenAI API 호출
      if (!OPENAI_API_KEY) {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: "OpenAI API 키가 설정되지 않았습니다. .env 파일에 VITE_OPENAI_API_KEY를 설정해주세요.",
          sender: "bot",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
        setIsLoading(false);
        return;
      }

      try {
        const { response: botResponse, searchResults } = await callOpenAI(userInput, messages);
        
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: botResponse,
          sender: "bot",
          timestamp: new Date(),
          searchResults: searchResults,
        };
        setMessages((prev) => [...prev, botMessage]);
      } catch (error) {
        let errorText = "죄송합니다. 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
        
        if (error instanceof Error) {
          console.error("상세 오류:", error.message);
          // CORS 오류 체크
          if (error.message.includes("CORS") || error.message.includes("Failed to fetch")) {
            errorText = "CORS 오류가 발생했습니다. 브라우저 콘솔을 확인해주세요. 백엔드 프록시를 통해 API를 호출해야 할 수 있습니다.";
          } else if (error.message.includes("401") || error.message.includes("Unauthorized")) {
            errorText = "API 키가 유효하지 않습니다. API 키를 확인해주세요.";
          } else if (error.message.includes("429")) {
            errorText = "API 사용량 한도를 초과했습니다. 잠시 후 다시 시도해주세요.";
          } else if (error.message.includes("OpenAI API 오류")) {
            errorText = error.message;
          }
        }
        
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: errorText,
          sender: "bot",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      {/* 채팅 버튼 (오른쪽 아래 고정) */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300",
          isOpen ? "hidden" : "flex items-center justify-center"
        )}
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      {/* 채팅창 */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-background border border-border rounded-lg shadow-2xl flex flex-col overflow-hidden">
          {/* 헤더 */}
          <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              <h3 className="font-semibold">고객 상담</h3>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* 메시지 영역 */}
          <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className="space-y-2">
                  <div
                    className={cn(
                      "flex",
                      message.sender === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[80%] rounded-lg px-4 py-2",
                        message.sender === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-foreground"
                      )}
                    >
                      <p className="text-sm whitespace-pre-wrap break-words">
                        {message.text}
                      </p>
                      <p
                        className={cn(
                          "text-xs mt-1",
                          message.sender === "user"
                            ? "text-primary-foreground/70"
                            : "text-muted-foreground"
                        )}
                      >
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                  
                  {/* 검색 결과 카드 */}
                  {message.searchResults && message.searchResults.length > 0 && (
                    <div className="flex justify-start">
                      <div className="max-w-[80%] w-full">
                        <div className="grid grid-cols-1 gap-3 mt-2">
                          {message.searchResults.map((result) => {
                            const product = products.find(
                              (p) => p.id === result.product_id || p.name === result.name
                            );
                            const imageUrl = result.image_url || product?.image_url_main;
                            
                            return (
                              <div
                                key={result.product_id}
                                className="bg-card border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                              >
                                {/* 상품 이미지 */}
                                {imageUrl && (
                                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                                    <img
                                      src={imageUrl}
                                      alt={result.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                )}
                                
                                {/* 상품 정보 */}
                                <div className="p-3">
                                  <h4 className="font-bold text-base mb-2 text-foreground">
                                    {result.name}
                                  </h4>
                                  <div className="flex items-center justify-between mb-3">
                                    <span className="text-lg font-bold text-primary">
                                      {new Intl.NumberFormat("ko-KR").format(result.price)}원
                                    </span>
                                  </div>
                                  
                                  {/* 장바구니 담기 버튼 */}
                                  <Button
                                    variant="default"
                                    size="sm"
                                    className="w-full"
                                    onClick={() => {
                                      if (product) {
                                        addItem(product, 1);
                                        toast({
                                          title: "장바구니에 담았어요",
                                          description: `${result.name}을(를) 추가했습니다.`,
                                        });
                                      } else {
                                        // Supabase에서 가져온 상품인 경우 로컬 products에서 찾기
                                        const foundProduct = products.find(
                                          (p) => p.id === result.product_id || p.name === result.name
                                        );
                                        if (foundProduct) {
                                          addItem(foundProduct, 1);
                                          toast({
                                            title: "장바구니에 담았어요",
                                            description: `${result.name}을(를) 추가했습니다.`,
                                          });
                                        }
                                      }
                                    }}
                                  >
                                    <ShoppingCart className="h-4 w-4 mr-2" />
                                    장바구니 담기
                                  </Button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {/* 로딩 인디케이터 */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted text-foreground max-w-[80%] rounded-lg px-4 py-2">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <p className="text-sm text-muted-foreground">답변을 생성하고 있습니다...</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* 입력 영역 */}
          <div className="border-t border-border p-4">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="메시지를 입력하세요..."
                className="flex-1"
              />
              <Button
                onClick={handleSend}
                disabled={!inputValue.trim() || isLoading}
                size="icon"
                className="h-10 w-10"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;

