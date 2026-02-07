import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { products } from "@/data/products";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
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

  // OpenAI API Key 가져오기
  const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

  // 환경변수 확인 (개발 모드에서만 경고)
  useEffect(() => {
    if (import.meta.env.DEV && !OPENAI_API_KEY) {
      console.warn(
        "⚠️ OpenAI API 키가 설정되지 않았습니다.\n" +
        ".env 파일에 VITE_OPENAI_API_KEY를 설정하면 채팅봇 기능을 사용할 수 있습니다."
      );
    }
  }, []);

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

  const callOpenAI = async (userInput: string, conversationHistory: Message[]) => {
    try {
      // 대화 히스토리를 OpenAI 형식으로 변환
      const messages = conversationHistory
        .filter((msg) => msg.sender !== "bot" || !msg.text.includes("현재 판매 중인 상품 목록"))
        .map((msg) => ({
          role: msg.sender === "user" ? "user" : "assistant",
          content: msg.text,
        }));

      // 시스템 프롬프트 추가
      const systemPrompt = `당신은 도윤이의 피자가게의 친절한 고객 상담 챗봇입니다. 
다음 상품들을 판매하고 있습니다:
${products.map((p) => `- ${p.name} (${p.price.toLocaleString()}원): ${p.description}`).join("\n")}

고객의 질문에 친절하고 도움이 되는 답변을 해주세요. 상품 정보, 주문, 배달 등에 대해 안내할 수 있습니다.`;

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            ...messages,
            { role: "user", content: userInput },
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || "죄송합니다. 응답을 생성할 수 없습니다.";
    } catch (error) {
      console.error("OpenAI API 호출 오류:", error);
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
        const botResponse = await callOpenAI(userInput, messages);
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: botResponse,
          sender: "bot",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
      } catch (error) {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: "죄송합니다. 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
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
                <div
                  key={message.id}
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

