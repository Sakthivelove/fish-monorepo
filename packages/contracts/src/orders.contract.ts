import { initContract } from "@ts-rest/core";
import { z } from "zod";

const c = initContract();

export const orderStatusSchema = z.enum([
  "PENDING",
  "CONFIRMED",
  "CUTTING",
  "PACKING",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
]);

export const paymentStatusSchema = z.enum([
  "PENDING",
  "PAID",
  "FAILED",
]);

export const paymentMethodSchema = z.enum([
  "COD",
  "UPI",
]);

export const orderItemSchema = z.object({
  id: z.number(),

  quantityGrams: z.number(),

  subtotal: z.number(),

  cuttingOption: z.string().nullish(),

  product: z.object({
    id: z.string(),
    name: z.string(),
    tamilName: z.string(),
  }),
});

export const orderSchema = z.object({
  id: z.string(),

  customerName: z.string(),
  phone: z.string(),

  totalAmount: z.number(),

  status: orderStatusSchema,

  paymentMethod: paymentMethodSchema,
  paymentStatus: paymentStatusSchema,

  transactionId:
    z.string().nullable(),
  deliveryAddress: z.string(),
  pincode: z
    .string()
    .regex(/^\d{6}$/, "Invalid pincode"),

  createdAt: z.string(),
});

export const singleOrderSchema =
  orderSchema.extend({
    items: z.array(orderItemSchema),
  });

export const updateOrderStatusSchema =
  z.object({
    status: orderStatusSchema,
  });

export const CreateOrderItemSchema = z.object({
  productId: z.string().uuid(),
  quantityGrams: z.number().int().positive(),
  cuttingOption: z.string().max(50).optional(),
});

export const CreateOrderInputSchema = z.object({
  customer: z.object({
    name: z.string().max(100),
    phoneNumber: z.string().min(10).max(15),
    email: z.string().email().optional().or(z.literal("")),
  }),
  deliveryAddress: z.string().min(10),
  pincode: z.string().length(6),
  paymentMethod: paymentMethodSchema,
  items: z.array(CreateOrderItemSchema).min(1),
  transactionId:
    z.string().nullable(),
});

export const CancelOrderSchema = z.object({
  cancelledBy: z.enum([
    "CUSTOMER",
    "ADMIN",
  ]),
  reason: z.string().optional(),
});

export const ordersContract = c.router({
  getOrders: {
    method: "GET",

    path: "/orders",

    query: z.object({
      search: z.string().optional(),
      status: orderStatusSchema.optional(),
    }),

    responses: {
      200: z.array(orderSchema),
    },
  },

  getOrderById: {
    method: "GET",

    path: "/orders/:id",

    pathParams: z.object({
      id: z.string(),
    }),

    responses: {
      200: singleOrderSchema,

      404: z.object({
        message: z.string(),
      }),
    },
  },

  createOrder: {
    method: "POST",
    path: "/orders",
    body: CreateOrderInputSchema,
    responses: {
      201: singleOrderSchema,
      400: z.object({ message: z.string() }),
    },
  },

  updateOrderStatus: {
    method: "PATCH",

    path: "/orders/:id/status",

    pathParams: z.object({
      id: z.string(),
    }),

    body: updateOrderStatusSchema,

    responses: {
      200: orderSchema,

      404: z.object({
        message: z.string(),
      }),
    },
  },
  getOrdersByPhone: {
    method: "GET",

    path: "/orders/customer/:phone",

    pathParams: z.object({
      phone: z.string(),
    }),

    responses: {
      200: z.array(orderSchema),
    },
  },
  cancelOrder: {
    method: "PATCH",
    path: "/orders/:id/cancel",

    pathParams: z.object({
      id: z.string(),
    }),

    body: CancelOrderSchema,

    responses: {
      200: z.object({
        message: z.string(),
      }),

      400: z.object({
        message: z.string(),
      }),

      404: z.object({
        message: z.string(),
      }),
    },
  },
});