import { prisma } from "../lib/prisma";

export const getSummary = async () => {
  const totalOrders =
    await prisma.order.count();

  const revenue =
    await prisma.order.aggregate({
      _sum: {
        totalAmount: true,
      },
    });

  const statusGroups =
    await prisma.order.groupBy({
      by: ["status"],
      _count: {
        status: true,
      },
    });

  const orderItems =
    await prisma.orderItem.findMany({
      include: {
        product: true,
      },
    });

  const productMap = new Map<
    string,
    {
      productId: string;
      tamilName: string;
      quantitySoldGrams: number;
    }
  >();

  for (const item of orderItems) {
    const existing =
      productMap.get(item.productId);

    if (existing) {
      existing.quantitySoldGrams +=
        item.quantityGrams;
    } else {
      productMap.set(
        item.productId,
        {
          productId:
            item.productId,
          tamilName:
            item.product.nameTamil,
          quantitySoldGrams:
            item.quantityGrams,
        }
      );
    }
  }

  const topProducts =
    [...productMap.values()]
      .sort(
        (a, b) =>
          b.quantitySoldGrams -
          a.quantitySoldGrams
      )
      .slice(0, 10);

  return {
    status: 200 as const,

    body: {
      totalRevenue: Number(
        revenue._sum.totalAmount ?? 0
      ),

      totalOrders,

      topProducts,

      statusCounts:
        statusGroups.map((s) => ({
          status: s.status,
          count: s._count.status,
        })),
    },
  };
};