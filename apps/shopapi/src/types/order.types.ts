import { OrderStatus, PaymentMethod, PaymentStatus } from "@prisma/client";

export interface CreateOrderInput {
  address: string;
  amount: number;
  items: Array<{
    productId: number;
    quantity: number;
    price: number;
  }>;
  paymentMethod: PaymentMethod;
}

export interface UpdateOrderStatusInput {
  status: OrderStatus;
}

export interface UpdatePaymentStatusInput {
  status: PaymentStatus;
}
