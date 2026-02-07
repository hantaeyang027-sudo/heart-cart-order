import { useState, type MouseEventHandler } from "react";
import { Button } from "@/components/ui/button";
import { requestSimplePayment, type SimplePaymentParams, generateOrderId } from "@/lib/tossPayments";
import { useToast } from "@/hooks/use-toast";
import type { ButtonProps } from "@/components/ui/button";
import type { OrderItemPayload } from "@/types/order";
import supabase from "@/lib/supabaseClient";
import { saveOrderSession } from "@/lib/orderStorage";

interface PurchaseButtonProps extends ButtonProps {
  amount: number;
  orderName: string;
  items: OrderItemPayload[];
  customerName?: string;
  orderId?: string;
  method?: SimplePaymentParams["method"];
  successUrl?: string;
  failUrl?: string;
}

const PurchaseButton = ({
  amount,
  orderName,
  items,
  customerName,
  orderId,
  method,
  successUrl,
  failUrl,
  children,
  disabled,
  onClick,
  ...buttonProps
}: PurchaseButtonProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleClick: MouseEventHandler<HTMLButtonElement> = async (event) => {
    onClick?.(event);
    if (event.defaultPrevented) return;

    if (amount <= 0) {
      toast({
        title: "결제 금액이 올바르지 않습니다.",
        description: "주문 금액을 다시 확인해 주세요.",
        variant: "destructive",
      });
      return;
    }

    if (!items || items.length === 0) {
      toast({
        title: "주문 정보가 없습니다.",
        description: "장바구니를 다시 확인해 주세요.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const { data: userData, error: userError } = await supabase.auth.getUser();
      const user = userData.user;
      if (userError || !user) {
        toast({
          title: "로그인이 필요해요",
          description: "결제를 진행하려면 먼저 로그인해 주세요.",
          variant: "destructive",
        });
        return;
      }

      const finalOrderId = orderId ?? generateOrderId();
      const finalCustomerName =
        customerName ||
        (typeof user.user_metadata?.full_name === "string" ? user.user_metadata.full_name : undefined) ||
        user.email ||
        undefined;

      saveOrderSession({
        orderId: finalOrderId,
        userId: user.id,
        amount,
        orderName,
        customerName: finalCustomerName,
        items,
        createdAt: new Date().toISOString(),
      });

      await requestSimplePayment({
        amount,
        orderName,
        customerName: finalCustomerName,
        orderId: finalOrderId,
        method,
        successUrl,
        failUrl,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "결제창을 열지 못했어요",
        description: "네트워크 상태를 확인 후 다시 시도해 주세요.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      {...buttonProps}
      disabled={disabled || loading}
      onClick={handleClick}
    >
      {loading ? "결제창 여는 중..." : children ?? "구매하기"}
    </Button>
  );
};

export default PurchaseButton;


