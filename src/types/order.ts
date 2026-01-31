export interface OrderItemPayload {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface OrderSessionPayload {
  orderId: string;
  userId: string;
  amount: number;
  orderName: string;
  customerName?: string;
  items: OrderItemPayload[];
  createdAt: string;
}

export interface OrderRecord extends OrderSessionPayload {
  id: string;
  status: string;
  paymentKey?: string | null;
}


