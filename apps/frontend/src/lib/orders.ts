import { tsr } from "./tsr";

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CUTTING"
  | "PACKING"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

export const useOrders = (
  search?: string,
  status?: OrderStatus
) => {
  return tsr.getOrders.useQuery({
    queryKey: [
      "orders",
      search,
      status,
    ],

    queryData: {
      query: {
        search:
          search || undefined,

        status:
          status || undefined,
      },
    },

    refetchInterval: 10000, // 10 seconds

    refetchOnWindowFocus: true,
  });
};

export const useOrder = (id: string) => {
  return tsr.getOrderById.useQuery({
    queryKey: ["order", id],

    queryData: {
      params: { id },
    },

    enabled: !!id,
  });
};

export const useUpdateOrderStatus = () => {
  return tsr.updateOrderStatus.useMutation();
};

export const useCreateOrder = () => {
  return tsr.createOrder.useMutation();
};

export const useOrdersByPhone = (
  phone: string
) => {
  return tsr.getOrdersByPhone.useQuery({
    queryKey: [
      "orders-by-phone",
      phone,
    ],

    queryData: {
      params: {
        phone,
      },
    },

    enabled: !!phone,
  });
};

export function useCancelOrder() {
  return tsr.cancelOrder.useMutation();
}