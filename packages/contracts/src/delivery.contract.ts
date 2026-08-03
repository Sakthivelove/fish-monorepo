import { initContract } from "@ts-rest/core";
import { z } from "zod";
import { singleOrderSchema } from "./orders.contract";

const c = initContract();

export const deliveryPartnerSchema = z.object({
  id: z.string(),
  name: z.string(),
  phoneNumber: z.string(),
  isActive: z.boolean(),
});

export const deliveryLoginRequestSchema = z.object({
  phoneNumber: z.string().min(10),
  password: z.string().min(6),
});

export const deliveryLoginResponseSchema = z.object({
  token: z.string(),
  deliveryPartner: deliveryPartnerSchema,
});

// A delivery partner can only ever move an order forward through
// these two states — never back to PENDING/CONFIRMED, never to
// CANCELLED (that stays an admin-only action).
export const deliveryStatusUpdateSchema = z.object({
  status: z.enum(["OUT_FOR_DELIVERY", "DELIVERED"]),
});

export const createDeliveryPartnerSchema = z.object({
  name: z.string().min(2),
  phoneNumber: z.string().min(10),
  password: z.string().min(6),
});

export const assignOrderSchema = z.object({
  assignedToId: z.string().nullable(),
});

export const deliveryContract = c.router({
  // -------------------------------------------------
  // Delivery partner (mobile app)
  // -------------------------------------------------
  login: {
    method: "POST",
    path: "/delivery/login",

    body: deliveryLoginRequestSchema,

    responses: {
      200: deliveryLoginResponseSchema,
      401: z.object({ message: z.string() }),
    },
  },

  getMyOrders: {
    method: "GET",
    path: "/delivery/orders",

    headers: z.object({
      authorization: z.string(),
    }),

    responses: {
      200: z.array(singleOrderSchema),
      401: z.object({ message: z.string() }),
    },
  },

  updateMyOrderStatus: {
    method: "PATCH",
    path: "/delivery/orders/:id/status",

    pathParams: z.object({
      id: z.string(),
    }),

    headers: z.object({
      authorization: z.string(),
    }),

    body: deliveryStatusUpdateSchema,

    responses: {
      200: singleOrderSchema,
      401: z.object({ message: z.string() }),
      403: z.object({ message: z.string() }),
      404: z.object({ message: z.string() }),
    },
  },

  // -------------------------------------------------
  // Admin-side management (used by the admin dashboard)
  // -------------------------------------------------
  adminListDeliveryPartners: {
    method: "GET",
    path: "/delivery-partners",

    responses: {
      200: z.array(deliveryPartnerSchema),
    },
  },

  adminCreateDeliveryPartner: {
    method: "POST",
    path: "/delivery-partners",

    body: createDeliveryPartnerSchema,

    responses: {
      201: deliveryPartnerSchema,
      409: z.object({ message: z.string() }),
    },
  },

  adminAssignOrder: {
    method: "PATCH",
    path: "/orders/:id/assign",

    pathParams: z.object({
      id: z.string(),
    }),

    body: assignOrderSchema,

    responses: {
      200: singleOrderSchema,
      404: z.object({ message: z.string() }),
    },
  },
});
