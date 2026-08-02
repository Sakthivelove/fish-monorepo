import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../services/product.service";
import { getProductById } from "../services/product.service";

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });
}

export function useProduct(productId: string) {
  return useQuery({
    queryKey: ["product", productId],
    queryFn: () => getProductById(productId),
    enabled: !!productId,
  });
}