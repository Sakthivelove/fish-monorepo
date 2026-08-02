import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../services/product.service";
import { getProductById } from "../services/product.service";

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
    // Products can change on the admin side while a customer is
    // just sitting on the Home/ProductList screen (no navigation,
    // no app backgrounding) — the focus/app-state refetching alone
    // won't catch that, so poll lightly in the background too.
    refetchInterval: 30000,
  });
}

export function useProduct(productId: string) {
  return useQuery({
    queryKey: ["product", productId],
    queryFn: () => getProductById(productId),
    enabled: !!productId,
  });
}