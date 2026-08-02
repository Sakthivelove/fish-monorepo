import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  cancelOrder,
  createOrder,
  getOrderById,
  getOrdersByPhone,
} from "../services/order.service";

export function useOrdersByPhone(phone: string) {
  return useQuery({
    queryKey: ["orders", phone],
    queryFn: () => getOrdersByPhone(phone),
    enabled: phone.trim().length >= 10,
    // Keep the list fresh while any order shown is still in
    // progress, so a status change (e.g. admin marks it
    // "Out for Delivery") shows up without the customer having to
    // manually pull-to-refresh.
    refetchInterval: (query) => {
      const orders = query.state.data ?? [];
      const hasActiveOrder = orders.some(
        (order) =>
          order.status !== "DELIVERED" &&
          order.status !== "CANCELLED"
      );
      return hasActiveOrder ? 20000 : false;
    },
  });
}

export function useOrderDetails(orderId: string) {
  return useQuery({
    queryKey: ["order", orderId],
    queryFn: () => getOrderById(orderId),
    enabled: !!orderId,
    // Customers watch this screen waiting for status changes
    // (e.g. "Out for Delivery"), so poll for updates while it's
    // open. Stop once the order reaches a terminal state — nothing
    // more will change after that.
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status === "DELIVERED" || status === "CANCELLED") {
        return false;
      }
      return 15000;
    },
  });
}

export function useCreateOrder() {
  return useMutation({
    mutationFn: createOrder,
  });
}

export function useCancelOrder(orderId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reason?: string) =>
      cancelOrder(orderId, {
        cancelledBy: "CUSTOMER",
        reason,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["order", orderId],
      });
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
    },
  });
}
