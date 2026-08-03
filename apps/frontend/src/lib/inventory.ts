import { tsr } from "./tsr";

export const useInventory = () => {
  return tsr.getInventory.useQuery({
    queryKey: ["inventory"],
  });
};

export const useUpdateStock = () => {
  return tsr.updateStock.useMutation();
};