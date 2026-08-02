import { z } from "zod";
import { productSchema } from "@fish/contracts";

import { api } from "../api/client";
import ENDPOINTS from "../api/endpoints";

// Derived from the shared contract instead of hand-typed — stays in
// sync with the backend automatically.
export type Product = z.infer<typeof productSchema>;

export async function getProducts(): Promise<Product[]> {
  const response = await api.get<Product[]>(ENDPOINTS.PRODUCTS);
  return response.data;
}

export async function getProductById(id: string): Promise<Product> {
  const response = await api.get<Product>(ENDPOINTS.PRODUCT_BY_ID(id));
  return response.data;
}
