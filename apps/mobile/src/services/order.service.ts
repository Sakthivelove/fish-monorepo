import { z } from "zod";
import {
  orderSchema,
  singleOrderSchema,
  orderStatusSchema,
  paymentStatusSchema,
  paymentMethodSchema,
  orderItemSchema,
  CreateOrderInputSchema,
  CancelOrderSchema,
} from "@fish/contracts";

import { api } from "../api/client";
import ENDPOINTS from "../api/endpoints";

// Every type below is derived from the shared contract instead of
// hand-typed — stays in sync with the backend automatically.
export type OrderStatus = z.infer<typeof orderStatusSchema>;
export type PaymentStatus = z.infer<typeof paymentStatusSchema>;
export type PaymentMethod = z.infer<typeof paymentMethodSchema>;
export type OrderItem = z.infer<typeof orderItemSchema>;
export type Order = z.infer<typeof orderSchema>;
export type OrderWithItems = z.infer<typeof singleOrderSchema>;
export type CreateOrderInput = z.infer<typeof CreateOrderInputSchema>;
export type CreateOrderItemInput = CreateOrderInput["items"][number];
export type CancelledBy = z.infer<typeof CancelOrderSchema>["cancelledBy"];
export type CancelOrderInput = z.infer<typeof CancelOrderSchema>;

export async function createOrder(
  input: CreateOrderInput
): Promise<OrderWithItems> {
  const response = await api.post<OrderWithItems>(
    ENDPOINTS.ORDERS,
    input
  );
  return response.data;
}

export async function getOrderById(
  id: string
): Promise<OrderWithItems> {
  const response = await api.get<OrderWithItems>(
    ENDPOINTS.ORDER_BY_ID(id)
  );
  return response.data;
}

export async function getOrdersByPhone(
  phone: string
): Promise<Order[]> {
  const response = await api.get<Order[]>(
    ENDPOINTS.ORDERS_BY_PHONE(phone)
  );
  return response.data;
}

export async function cancelOrder(
  id: string,
  input: CancelOrderInput
): Promise<{ message: string }> {
  const response = await api.patch<{ message: string }>(
    ENDPOINTS.ORDER_CANCEL(id),
    input
  );
  return response.data;
}
