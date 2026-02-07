import { loadTossPayments } from "@tosspayments/payment-sdk";

type PaymentMethod = Parameters<Awaited<ReturnType<typeof loadTossPayments>>["requestPayment"]>[0];

export interface SimplePaymentParams {
  amount: number;
  orderName: string;
  customerName?: string;
  orderId?: string;
  successUrl?: string;
  failUrl?: string;
  method?: PaymentMethod;
}

const DEFAULT_SUCCESS_PATH = "/payment/success";
const DEFAULT_FAIL_PATH = "/payment/fail";

const clientKey = import.meta.env.VITE_TOSS_CLIENT_KEY;

if (!clientKey) {
  console.warn(
    "⚠️ 토스페이먼츠 클라이언트 키가 설정되지 않았습니다.\n" +
    ".env 파일에 VITE_TOSS_CLIENT_KEY를 설정하세요."
  );
}

let tossPaymentsPromise: Promise<Awaited<ReturnType<typeof loadTossPayments>>> | null = null;

const getTossPayments = () => {
  if (!clientKey) {
    throw new Error("토스페이먼츠 클라이언트 키가 설정되지 않았습니다.");
  }

  if (!tossPaymentsPromise) {
    tossPaymentsPromise = loadTossPayments(clientKey);
  }

  return tossPaymentsPromise;
};

export const generateOrderId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `order_${crypto.randomUUID()}`;
  }
  const random = Math.random().toString(36).slice(2, 10);
  return `order_${Date.now()}_${random}`;
};

export const requestSimplePayment = async ({
  amount,
  orderName,
  customerName,
  orderId,
  successUrl,
  failUrl,
  method = "카드",
}: SimplePaymentParams) => {
  const tossPayments = await getTossPayments();

  const normalizedAmount = Math.max(1, Math.floor(amount));
  const resolvedSuccessUrl = successUrl || `${window.location.origin}${DEFAULT_SUCCESS_PATH}`;
  const resolvedFailUrl = failUrl || `${window.location.origin}${DEFAULT_FAIL_PATH}`;

  return tossPayments.requestPayment(method, {
    amount: normalizedAmount,
    orderId: orderId || generateOrderId(),
    orderName,
    customerName: customerName || "도윤이의 피자 고객",
    successUrl: resolvedSuccessUrl,
    failUrl: resolvedFailUrl,
  });
};


