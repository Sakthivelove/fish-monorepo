import { prisma } from "../lib/prisma";
import { z } from "zod";
import type { OrderStatus } from "../lib/generated-types";
import { CreateOrderInputSchema } from "@fish/contracts";
import de from "zod/v4/locales/de.js";
import { sendLowStockAlert, sendTelegramMessage } from "../lib/telegram";
import { sendOrderCancelledWhatsApp, sendOrderConfirmation, sendOrderStatusUpdate } from "../lib/whatsapp";
import { LOW_STOCK_THRESHOLD } from "../constants/inventory";
import { sendOrderCancelledEmail, sendOrderConfirmationEmail } from "../lib/email";
import { notifyLowStock, notifyOrderCreated } from "../notifications/notification-center";
import { notifyOrderStatusChange } from "../notifications/push-notify";

export const getOrders = async ({
  query,
}: {
  query?: {
    search?: string;
    status?:
    | "PENDING"
    | "CONFIRMED"
    | "CUTTING"
    | "PACKING"
    | "OUT_FOR_DELIVERY"
    | "DELIVERED"
    | "CANCELLED";
  };
}) => {
  console.log("QUERY =", query);
  const orders =
    await prisma.order.findMany({
      where: {
        ...(query?.status
          ? {
            status:
              query.status,
          }
          : {}),

        ...(query?.search
          ? {
            OR: [
              {
                id: {
                  contains:
                    query.search,
                },
              },

              {
                customer: {
                  name: {
                    contains:
                      query.search,
                    mode: "insensitive",
                  },
                },
              },

              {
                customer: {
                  phoneNumber:
                  {
                    contains:
                      query.search,
                  },
                },
              },
            ],
          }
          : {}),
      },

      orderBy: {
        createdAt: "desc",
      },

      include: {
        customer: true,
      },
    });

  return {
    status: 200 as const,

    body: orders.map((order) => ({
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
    })
    )
  };
};

export const getOrderById = async ({ params }: { params: { id: string } }) => {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { customer: true, orderItems: { include: { product: true } } },
  });

  if (!order) return { status: 404, body: { message: "Order not found" } } as const;

  return {
    status: 200,
    body: {
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
      items: order.orderItems.map((item) => ({
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
    },
  } as const;
};

export const createOrder = async ({ body }: { body: z.infer<typeof CreateOrderInputSchema> }) => {
  const products = await prisma.product.findMany({
    where: {
      id: {
        in: body.items.map(
          (i) => i.productId
        ),
      },
    },
  });

  if (
    products.length !==
    body.items.length
  ) {
    console.error(`[CreateOrder Error] Product validation failed. Found ${products.length} products, expected ${body.items.length}.`);
    return {
      status: 400,
      body: {
        message:
          "One or more products are invalid.",
      },
    } as const;
  }

  const inventories =
    await prisma.inventory.findMany({
      where: {
        productId: {
          in: body.items.map(
            (i) => i.productId
          ),
        },
      },
    });

  for (const item of body.items) {
    const inventory =
      inventories.find(
        (inv) =>
          inv.productId ===
          item.productId
      );

    if (!inventory) {
      console.error(`[CreateOrder Error] Inventory record completely missing for product ID: ${item.productId}`);
      return {
        status: 400 as const,
        body: {
          message:
            "Inventory not found",
        },
      };
    }

    if (
      inventory.stockQuantityGrams <
      item.quantityGrams
    ) {
      const product =
        products.find(
          (p) =>
            p.id ===
            item.productId
        );
      console.error(`[CreateOrder Error] Insufficient stock for product: ${product?.nameTamil || item.productId}. Available: ${inventory.stockQuantityGrams}g, Requested: ${item.quantityGrams}g`);
      return {
        status: 400 as const,
        body: {
          message: `${product?.nameTamil ??
            "Product"
            } stock not available`,
        },
      };
    }
  }

  const email = body.customer.email ? body.customer.email : null;

  if (email) {
    const existingEmailCustomer = await prisma.customer.findUnique({
      where: { email },
    });

    if (existingEmailCustomer && existingEmailCustomer.phoneNumber !== body.customer.phoneNumber) {
      console.error(`[CreateOrder Error] Email clash. Email ${email} belongs to phone ${existingEmailCustomer.phoneNumber}, not ${body.customer.phoneNumber}`);
      return {
        status: 400,
        body: { message: "Email is already used by another customer." },
      } as const;
    }
  }

  const existingCustomer = await prisma.customer.findUnique({
    where: { phoneNumber: body.customer.phoneNumber },
  });

  const customer = existingCustomer
    ? await prisma.customer.update({
      where: { phoneNumber: body.customer.phoneNumber },
      data: {
        name: body.customer.name,
        email: email ?? existingCustomer.email,
      }
    })
    : await prisma.customer.create({
      data: {
        name: body.customer.name,
        phoneNumber: body.customer.phoneNumber,
        email,
      },
    });

  const orderItems = body.items.map((item) => {
    const product = products.find((p) => p.id === item.productId)!;
    const unitPrice = Number(product.pricePerKg);
    const subtotal = Number(((unitPrice * item.quantityGrams) / 1000).toFixed(2));

    return { productId: item.productId, quantityGrams: item.quantityGrams, unitPrice, subtotal, cuttingOption: item.cuttingOption };
  });

  const totalAmount = Number(orderItems.reduce((sum, item) => sum + item.subtotal, 0).toFixed(2));

  const order = await prisma.order.create({
    data: {
      customerId: customer.id,

      deliveryAddress: body.deliveryAddress,
      pincode: body.pincode,

      paymentMethod: body.paymentMethod,

      paymentStatus:
        body.paymentMethod === "COD"
          ? "PENDING"
          : "PENDING",

      transactionId:
        body.transactionId || null,

      totalAmount,

      orderItems: {
        create: orderItems,
      },
    },
    include: { customer: true, orderItems: { include: { product: true } } },
  });



  try {
  // -----------------------------
  // Telegram Notification
  // -----------------------------

  const itemsText = order.orderItems
    .map(
      (item) =>
        `• ${item.product.nameTamil} (${item.quantityGrams}g)`
    )
    .join("\n");

  const paymentIcon =
    order.paymentMethod === "COD"
      ? "💵"
      : "💳";

  const statusIcon =
    order.status === "PENDING"
      ? "🟡"
      : order.status === "CONFIRMED"
        ? "🔵"
        : order.status === "CUTTING"
          ? "🔪"
          : order.status === "PACKING"
            ? "📦"
            : order.status ===
              "OUT_FOR_DELIVERY"
              ? "🚚"
              : order.status === "DELIVERED"
                ? "✅"
                : "❌";

  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${order.deliveryAddress} ${order.pincode}`
  )}`;

  const adminUrl = `${process.env.ADMIN_PANEL_URL}/orders/${order.id}`;

  await notifyOrderCreated({
    telegramMessage: `
🐟 <b>NEW ORDER RECEIVED</b>

━━━━━━━━━━━━━━━━━━━━

🆔 <b>Order ID</b>

<code>${order.id}</code>

👤 <b>Customer</b>

${order.customer.name}

📞 <b>Phone</b>

${order.customer.phoneNumber}

📍 <b>Address</b>

${order.deliveryAddress}

📮 <b>Pincode</b>

${order.pincode}

${paymentIcon} <b>Payment</b>

${order.paymentMethod}

💰 <b>Payment Status</b>

${order.paymentStatus}

💵 <b>Total Amount</b>

₹${order.totalAmount}

🕒 <b>Order Time</b>

${new Date(order.createdAt).toLocaleString(
      "en-IN"
    )}

━━━━━━━━━━━━━━━━━━━━

🛒 <b>Items</b>

${itemsText}

━━━━━━━━━━━━━━━━━━━━

${statusIcon} <b>Status</b>

${order.status}

🌐 <a href="${adminUrl}">
Open Admin Panel
</a>

🗺 <a href="${mapUrl}">
Open Google Maps
</a>
`,
    whatsapp: {
      customerPhone: customer.phoneNumber,
      customerName: customer.name,
      orderId: order.id,
      totalAmount,
      items: order.orderItems.map((item) => ({
        name: item.product.nameTamil,
        quantityGrams: item.quantityGrams,
      })),
    },
    email: customer.email
      ? {
        customerEmail: customer.email,
        customerName: customer.name,
        orderId: order.id,
        totalAmount,
        items: order.orderItems.map((item) => ({
          name: item.product.nameTamil,
          quantityGrams: item.quantityGrams,
        })),
      }
      : undefined,
  });

  await sendTelegramMessage(`
🐟 <b>NEW ORDER RECEIVED</b>

━━━━━━━━━━━━━━━━━━━━

🆔 <b>Order ID</b>

<code>${order.id}</code>

👤 <b>Customer</b>

${order.customer.name}

📞 <b>Phone</b>

${order.customer.phoneNumber}

📍 <b>Address</b>

${order.deliveryAddress}

📮 <b>Pincode</b>

${order.pincode}

${paymentIcon} <b>Payment</b>

${order.paymentMethod}

💰 <b>Payment Status</b>

${order.paymentStatus}

💵 <b>Total Amount</b>

₹${order.totalAmount}

🕒 <b>Order Time</b>

${new Date(order.createdAt).toLocaleString(
    "en-IN"
  )}

━━━━━━━━━━━━━━━━━━━━

🛒 <b>Items</b>

${itemsText}

━━━━━━━━━━━━━━━━━━━━

${statusIcon} <b>Status</b>

${order.status}

🌐 <a href="${adminUrl}">
Open Admin Panel
</a>

🗺 <a href="${mapUrl}">
Open Google Maps
</a>
`);

  await sendOrderConfirmation({
    customerPhone: customer.phoneNumber,

    customerName: customer.name,

    orderId: order.id,

    totalAmount,

    items: order.orderItems.map((item) => ({
      name: item.product.nameTamil,
      quantityGrams: item.quantityGrams,
    })),
  });
  } catch (notifyError) {
    console.error("[CreateOrder] Notification failed (order was still created):", notifyError);
  }

  for (const item of body.items) {
    const updatedInventory =
      await prisma.inventory.update({
        where: {
          productId: item.productId,
        },
        data: {
          stockQuantityGrams: {
            decrement: item.quantityGrams,
          },
        },
      });

    const previousInventory =
      inventories.find(
        (i) =>
          i.productId === item.productId
      );

    const product = products.find(
      (p) => p.id === item.productId
    );

    if (
      previousInventory &&
      previousInventory.stockQuantityGrams >
      LOW_STOCK_THRESHOLD &&
      updatedInventory.stockQuantityGrams <=
      LOW_STOCK_THRESHOLD
    ) {
      try {
        await notifyLowStock({
          telegram: {
            productName: product?.nameTamil ?? "Unknown",
            remainingStock: updatedInventory.stockQuantityGrams,
          },
          email: {
            productName: product?.nameTamil ?? "Unknown",
            remainingStock: updatedInventory.stockQuantityGrams,
          },
        });
        await sendLowStockAlert({
          productName:
            product?.nameTamil ?? "Unknown",
          remainingStock:
            updatedInventory.stockQuantityGrams,
        });
      } catch (lowStockError) {
        console.error(
          "[CreateOrder] Low-stock notification failed (order was still created):",
          lowStockError
        );
      }
    }
  }



  try {
  await sendOrderConfirmationEmail({
    customerEmail: customer.email ?? "",

    customerName: customer.name,

    orderId: order.id,

    totalAmount,

    items: order.orderItems.map((item) => ({
      name: item.product.nameTamil,
      quantityGrams: item.quantityGrams,
    })),
  });
  } catch (emailError) {
    console.error("[CreateOrder] Confirmation email failed (order was still created):", emailError);
  }


  return {
    status: 201,
    body: {
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
      items: order.orderItems.map((item) => ({
        id: item.id,
        quantityGrams: item.quantityGrams,
        subtotal: Number(item.subtotal),
         cuttingOption: item.cuttingOption,
        product: { id: item.product.id, name: item.product.nameTamil, tamilName: item.product.nameTamil },
      })),
    },
  } as const;
};

// Shared by the admin updateOrderStatus route below and the
// delivery-partner status update route (delivery.controller.ts) —
// one place for the DB update + notification fan-out, so a future
// fix to notification handling doesn't need to be made twice.
export const applyOrderStatusUpdate = async (
  orderId: string,
  status: OrderStatus
) => {
  const updated = await prisma.order.update({
    where: { id: orderId },
    data: { status },
    include: { customer: true },
  });

  try {
    await sendOrderStatusUpdate({
      customerPhone: updated.customer.phoneNumber,
      customerName: updated.customer.name,
      orderId: updated.id,
      status: updated.status,
    });
  } catch (error) {
    console.error(
      "[applyOrderStatusUpdate] WhatsApp notification failed (status update still succeeded):",
      error
    );
  }

  await notifyOrderStatusChange(
    updated.customer.phoneNumber,
    updated.id,
    updated.status
  );

  return updated;
};

export const updateOrderStatus = async ({ params, body }: { params: { id: string }; body: { status: string } }) => {
  const existing = await prisma.order.findUnique({ where: { id: params.id } });
  if (!existing) return { status: 404, body: { message: "Order not found" } } as const;

  const updated = await applyOrderStatusUpdate(params.id, body.status as OrderStatus);

  return {
    status: 200,
    body: {
      id: updated.id,

      customerName: updated.customer.name,
      phone: updated.customer.phoneNumber,

      totalAmount: Number(updated.totalAmount),

      status: updated.status,

      paymentMethod: updated.paymentMethod,
      paymentStatus: updated.paymentStatus,
      transactionId: updated.transactionId,
      deliveryAddress: updated.deliveryAddress,
      pincode: updated.pincode,


      createdAt: updated.createdAt.toISOString(),
    }
  } as const;
};

export const getOrdersByPhone = async ({
  params,
}: {
  params: { phone: string };
}) => {
  const orders =
    await prisma.order.findMany({
      where: {
        customer: {
          phoneNumber:
            params.phone,
        },
      },

      include: {
        customer: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

  return {
    status: 200 as const,

    body: orders.map((order) => ({
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
    }))
  };
};

export const cancelOrder = async ({
  params,
  body,
}: {
  params: { id: string };
  body: {
    cancelledBy: "CUSTOMER" | "ADMIN";
    reason?: string;
  };
}) => {
  const order = await prisma.order.findUnique({
    where: {
      id: params.id,
    },
    include: {
      customer: true,
    },
  });

  if (!order) {
    return {
      status: 404 as const,
      body: {
        message: "Order not found.",
      },
    };
  }

  // Already cancelled
  if (order.status === "CANCELLED") {
    return {
      status: 400 as const,
      body: {
        message: "Order is already cancelled.",
      },
    };
  }

  // Already delivered
  if (order.status === "DELIVERED") {
    return {
      status: 400 as const,
      body: {
        message:
          "Delivered orders cannot be cancelled.",
      },
    };
  }

  // Customer Rules
  if (body.cancelledBy === "CUSTOMER") {
    if (
      order.status !== "PENDING" &&
      order.status !== "CONFIRMED"
    ) {
      return {
        status: 400 as const,
        body: {
          message:
            "Customer can cancel only Pending or Confirmed orders.",
        },
      };
    }
  }

  // Admin Rules
  if (body.cancelledBy === "ADMIN") {
    if (
      ![
        "PENDING",
        "CONFIRMED",
        "CUTTING",
        "PACKING",
      ].includes(order.status)
    ) {
      return {
        status: 400 as const,
        body: {
          message:
            "This order cannot be cancelled by admin.",
        },
      };
    }
  }

  await prisma.order.update({
    where: {
      id: params.id,
    },
    data: {
      status: "CANCELLED",
      cancelledBy: body.cancelledBy,
      cancelReason: body.reason ?? null,
    },
  });

  try {
    // -------------------------
    // Telegram
    // -------------------------

    await sendTelegramMessage(`
❌ <b>ORDER CANCELLED</b>

━━━━━━━━━━━━━━━━━━━━

🆔 <b>Order ID</b>

<code>${order.id}</code>

👤 <b>Customer</b>

${order.customer.name}

📞 <b>Phone</b>

${order.customer.phoneNumber}

🚫 <b>Cancelled By</b>

${body.cancelledBy}

📝 <b>Reason</b>

${body.reason ?? "No reason provided"}
`);

    // -------------------------
    // WhatsApp
    // -------------------------

    await sendOrderCancelledWhatsApp({
      customerPhone:
        order.customer.phoneNumber,

      customerName:
        order.customer.name,

      orderId: order.id,

      reason: body.reason,

      cancelledBy: body.cancelledBy,
    });

    // -------------------------
    // Email
    // -------------------------

    if (order.customer.email) {
      await sendOrderCancelledEmail({
        email: order.customer.email,

        customerName:
          order.customer.name,

        orderId: order.id,

        reason: body.reason,

        cancelledBy: body.cancelledBy,
      });
    }
  } catch (error) {
    console.error(
      "[cancelOrder] Notification failed (cancellation still succeeded):",
      error
    );
  }

  await notifyOrderStatusChange(
    order.customer.phoneNumber,
    order.id,
    "CANCELLED"
  );

  return {
    status: 200 as const,
    body: {
      message:
        "Order cancelled successfully.",
    },
  };
};
