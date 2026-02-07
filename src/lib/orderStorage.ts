import type { OrderSessionPayload } from "@/types/order";

const STORAGE_KEY = "heart-cart-order-sessions";

const isBrowser = typeof window !== "undefined";

const readStore = (): Record<string, OrderSessionPayload> => {
  if (!isBrowser) return {};
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, OrderSessionPayload>;
  } catch (error) {
    console.warn("orderStorage read error", error);
    return {};
  }
};

const writeStore = (store: Record<string, OrderSessionPayload>) => {
  if (!isBrowser) return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch (error) {
    console.warn("orderStorage write error", error);
  }
};

export const saveOrderSession = (payload: OrderSessionPayload) => {
  if (!payload.orderId) return;
  const store = readStore();
  store[payload.orderId] = payload;
  writeStore(store);
};

export const getOrderSession = (orderId: string) => {
  const store = readStore();
  return store[orderId] ?? null;
};

export const clearOrderSession = (orderId: string) => {
  const store = readStore();
  if (store[orderId]) {
    delete store[orderId];
    writeStore(store);
  }
};


