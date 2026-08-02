import { prisma } from "../lib/prisma";

export const getStats = async () => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const startOfMonth = new Date(
    startOfToday.getFullYear(),
    startOfToday.getMonth(),
    1
  );

const [
  totalProducts,
  totalOrders,
  pendingOrders,
  deliveredOrders,
  revenueResult,

  todayOrders,
  todayRevenue,

  monthlyOrders,
  monthlyRevenue,

  recentOrders,
  products,

  topProducts,
] = await Promise.all([
  prisma.product.count(),

  prisma.order.count(),

  prisma.order.count({
    where: {
      status: "PENDING",
    },
  }),

  prisma.order.count({
    where: {
      status: "DELIVERED",
    },
  }),

  prisma.order.aggregate({
    _sum: {
      totalAmount: true,
    },
  }),

  prisma.order.count({
    where: {
      createdAt: {
        gte: startOfToday,
      },
    },
  }),

  prisma.order.aggregate({
    where: {
      createdAt: {
        gte: startOfToday,
      },
    },
    _sum: {
      totalAmount: true,
    },
  }),

  prisma.order.count({
    where: {
      createdAt: {
        gte: startOfMonth,
      },
    },
  }),

  prisma.order.aggregate({
    where: {
      createdAt: {
        gte: startOfMonth,
      },
    },
    _sum: {
      totalAmount: true,
    },
  }),

  prisma.order.findMany({
    take: 5,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      customer: true,
    },
  }),

  prisma.product.findMany({
    include: {
      inventory: true,
    },
  }),

  prisma.orderItem.groupBy({
    by: ["productId"],

    _sum: {
      quantityGrams: true,
    },

    orderBy: {
      _sum: {
        quantityGrams: "desc",
      },
    },

    take: 5,
  }),
]);

  const lowStockProducts = products
    .filter(
      (product) =>
        (product.inventory
          ?.stockQuantityGrams ?? 0) < 1000
    )
    .map((product) => ({
      id: product.id,
      tamilName: product.nameTamil,
      stockQuantityGrams:
        product.inventory
          ?.stockQuantityGrams ?? 0,
    }));

    const topProductIds = topProducts.map(
  (item) => item.productId
);

const topProductDetails =
  await prisma.product.findMany({
    where: {
      id: {
        in: topProductIds,
      },
    },
  });

const topSellingProducts =
  topProducts.map((item) => {
    const product =
      topProductDetails.find(
        (p) =>
          p.id === item.productId
      );

    return {
      productId: item.productId,

      tamilName:
        product?.nameTamil ??
        "Unknown",

      totalSoldGrams:
        item._sum
          .quantityGrams ?? 0,
    };
  });

  return {
    status: 200 as const,

    body: {
      totalProducts,
      totalOrders,
      pendingOrders,
      deliveredOrders,

      totalRevenue: Number(
        revenueResult._sum.totalAmount ?? 0
      ),

      todayOrders,

      todayRevenue: Number(
        todayRevenue._sum.totalAmount ?? 0
      ),

      monthlyOrders,

      monthlyRevenue: Number(
        monthlyRevenue._sum.totalAmount ?? 0
      ),

      recentOrders: recentOrders.map(
        (order) => ({
          id: order.id,
          customerName:
            order.customer.name,
          totalAmount: Number(
            order.totalAmount
          ),
          status: order.status,
        })
      ),

      lowStockProducts,
      topSellingProducts,
    },
  };
};