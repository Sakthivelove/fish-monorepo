import { prisma } from "../lib/prisma";

export const getCustomers = async ({
  query,
}: {
  query: {
    search?: string;
  };
}) => {
  const customers =
    await prisma.customer.findMany({
      where: query.search
        ? {
            OR: [
              {
                name: {
                  contains:
                    query.search,
                  mode:
                    "insensitive",
                },
              },

              {
                phoneNumber: {
                  contains:
                    query.search,
                },
              },
            ],
          }
        : undefined,
      include: {
        orders: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

  return {
    status: 200 as const,

    body: customers.map(
      (customer) => ({
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phoneNumber:
          customer.phoneNumber,

        totalOrders:
          customer.orders.length,

        totalSpent:
          customer.orders.reduce(
            (sum, order) =>
              sum +
              Number(
                order.totalAmount
              ),
            0
          ),

        createdAt:
          customer.createdAt.toISOString(),
      })
    ),
  };
};

export const getCustomerById = async ({
  params,
}: {
  params: {
    id: string;
  };
}) => {
  const customer =
    await prisma.customer.findUnique({
      where: {
        id: params.id,
      },

      include: {
        orders: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

  if (!customer) {
    return {
      status: 404 as const,
      body: {
        message: "Customer not found",
      },
    };
  }

  return {
    status: 200 as const,

    body: {
      id: customer.id,
      name: customer.name,
      phoneNumber:
        customer.phoneNumber,
      email: customer.email,

      totalOrders:
        customer.orders.length,

      totalSpent:
        customer.orders.reduce(
          (sum, order) =>
            sum +
            Number(order.totalAmount),
          0
        ),

      orders: customer.orders.map(
        (order) => ({
          id: order.id,
          totalAmount: Number(
            order.totalAmount
          ),
          status: order.status,
          createdAt:
            order.createdAt.toISOString(),
        })
      ),
    },
  };
};