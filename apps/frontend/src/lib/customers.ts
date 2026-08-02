import { tsr } from "./tsr";

export const useCustomers = (
  search?: string
) => {
  return tsr.getCustomers.useQuery({
    queryKey: [
      "customers",
      search,
    ],

    queryData: {
      query: {
        search:
          search || undefined,
      },
    },
    placeholderData: (previousData) =>
      previousData,
  });
};

export const useCustomer = (id: string) => {
  return tsr.getCustomerById.useQuery({
    queryKey: ["customer", id],

    queryData: {
      params: {
        id,
      },
    },

    enabled: !!id,
  });
};



