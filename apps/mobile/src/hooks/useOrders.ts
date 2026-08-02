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
  });
}

export function useOrderDetails(orderId: string) {
  return useQuery({
    queryKey: ["order", orderId],
    queryFn: () => getOrderById(orderId),
    enabled: !!orderId,
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
