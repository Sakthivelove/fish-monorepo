import { tsr } from "./tsr";

export const useProducts = (
  search?: string,
  category?: string,
  includeInactive?: boolean
) => {
  return tsr.getProducts.useQuery({
    queryKey: [
      "products",
      search,
      category,
      includeInactive,
    ],

    queryData: {
      query: {
        search:
          search || undefined,

        category:
          category || undefined,
        includeInactive,
      },
    },
  });
};
export const useProduct = (id: string) => {
  return tsr.getProductById.useQuery({
    queryKey: ["product", id],
    queryData: {
      params: { id },
    },
    enabled: !!id,
  });
};

export const useCreateProduct = () => {
  return tsr.createProduct.useMutation();
};

export const useUpdateProduct = () => {
  return tsr.updateProduct.useMutation();
};

export const useDeleteProduct = () => {
  return tsr.deleteProduct.useMutation();
};