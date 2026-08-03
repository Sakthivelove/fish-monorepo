import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import { verifyDeliveryToken } from "../middlewares/delivery-auth.middleware";
import { applyOrderStatusUpdate } from "./orders.controller";
import type { OrderStatus } from "../lib/generated-types";

function formatOrder(order: any) {
  return {
    id: order.id,
    customerName: order.customer.name,
    phone: order.customer.phoneNumber,
    totalAmount: Number(order.totalAmount),
    status: order.status,
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,
    transactionId: order.transactionId,
    deliveryAddress: order.deliveryAddress,
    pincode: order.pincode,
    createdAt: order.createdAt.toISOString(),
    items: (order.orderItems ?? []).map((item: any) => ({
      id: item.id,
      quantityGrams: item.quantityGrams,
      subtotal: Number(item.subtotal),
      cuttingOption: item.cuttingOption,
      product: {
        id: item.product.id,
        name: item.product.nameTamil,
        tamilName: item.product.nameTamil,
      },
    })),
  };
}

// -------------------------------------------------
// Delivery partner (mobile app)
// -------------------------------------------------

export const login = async ({
  body,
}: {
  body: { phoneNumber: string; password: string };
}) => {
  const partner = await prisma.deliveryPartner.findUnique({
    where: { phoneNumber: body.phoneNumber },
  });

  if (!partner || !partner.isActive) {
    return {
      status: 401 as const,
      body: { message: "Invalid credentials" },
    };
  }

  const isPasswordValid = await bcrypt.compare(
    body.password,
    partner.passwordHash
  );

  if (!isPasswordValid) {
    return {
      status: 401 as const,
      body: { message: "Invalid credentials" },
    };
  }

  const token = jwt.sign(
    { deliveryPartnerId: partner.id },
    process.env.JWT_SECRET!,
    { expiresIn: "30d" }
  );

  await prisma.deliveryPartner.update({
    where: { id: partner.id },
    data: { lastLoginAt: new Date() },
  });

  return {
    status: 200 as const,
    body: {
      token,
      deliveryPartner: {
        id: partner.id,
        name: partner.name,
        phoneNumber: partner.phoneNumber,
        isActive: partner.isActive,
      },
    },
  };
};

export const getMyOrders = async ({
  headers,
}: {
  headers: { authorization: string };
}) => {
  const identity = verifyDeliveryToken(headers.authorization);

  if (!identity) {
    return {
      status: 401 as const,
      body: { message: "Unauthorized" },
    };
  }

  const orders = await prisma.order.findMany({
    where: {
      assignedToId: identity.deliveryPartnerId,
      // Once delivered/cancelled there's nothing left for the
      // delivery partner to do with it — keep their list to
      // active work only.
      status: { notIn: ["DELIVERED", "CANCELLED"] },
    },
    include: {
      customer: true,
      orderItems: { include: { product: true } },
    },
    orderBy: { orderDate: "asc" },
  });

  return {
    status: 200 as const,
    body: orders.map(formatOrder),
  };
};

export const updateMyOrderStatus = async ({
  params,
  headers,
  body,
}: {
  params: { id: string };
  headers: { authorization: string };
  body: { status: OrderStatus };
}) => {
  const identity = verifyDeliveryToken(headers.authorization);

  if (!identity) {
    return {
      status: 401 as const,
      body: { message: "Unauthorized" },
    };
  }

  const existing = await prisma.order.findUnique({
    where: { id: params.id },
  });

  if (!existing) {
    return {
      status: 404 as const,
      body: { message: "Order not found" },
    };
  }

  if (existing.assignedToId !== identity.deliveryPartnerId) {
    // Not your order — don't reveal whether it exists or belongs
    // to someone else, just refuse.
    return {
      status: 403 as const,
      body: { message: "This order is not assigned to you" },
    };
  }

  const updated = await applyOrderStatusUpdate(
    params.id,
    body.status
  );

  const withItems = await prisma.order.findUnique({
    where: { id: updated.id },
    include: {
      customer: true,
      orderItems: { include: { product: true } },
    },
  });

  return {
    status: 200 as const,
    body: formatOrder(withItems),
  };
};

// -------------------------------------------------
// Admin-side management
// -------------------------------------------------

export const adminListDeliveryPartners = async () => {
  const partners = await prisma.deliveryPartner.findMany({
    orderBy: { createdAt: "desc" },
  });

  return {
    status: 200 as const,
    body: partners.map((p) => ({
      id: p.id,
      name: p.name,
      phoneNumber: p.phoneNumber,
      isActive: p.isActive,
    })),
  };
};

export const adminCreateDeliveryPartner = async ({
  body,
}: {
  body: { name: string; phoneNumber: string; password: string };
}) => {
  const existing = await prisma.deliveryPartner.findUnique({
    where: { phoneNumber: body.phoneNumber },
  });

  if (existing) {
    return {
      status: 409 as const,
      body: { message: "A delivery partner with this phone number already exists" },
    };
  }

  const passwordHash = await bcrypt.hash(body.password, 10);

  const partner = await prisma.deliveryPartner.create({
    data: {
      name: body.name,
      phoneNumber: body.phoneNumber,
      passwordHash,
    },
  });

  return {
    status: 201 as const,
    body: {
      id: partner.id,
      name: partner.name,
      phoneNumber: partner.phoneNumber,
      isActive: partner.isActive,
    },
  };
};

export const adminAssignOrder = async ({
  params,
  body,
}: {
  params: { id: string };
  body: { assignedToId: string | null };
}) => {
  const existing = await prisma.order.findUnique({
    where: { id: params.id },
  });

  if (!existing) {
    return {
      status: 404 as const,
      body: { message: "Order not found" },
    };
  }

  const updated = await prisma.order.update({
    where: { id: params.id },
    data: { assignedToId: body.assignedToId },
    include: {
      customer: true,
      orderItems: { include: { product: true } },
    },
  });

  return {
    status: 200 as const,
    body: formatOrder(updated),
  };
};
