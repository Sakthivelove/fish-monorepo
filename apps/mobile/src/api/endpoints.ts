const ENDPOINTS = {
  PRODUCTS: "/products",
  PRODUCT_BY_ID: (id: string) => `/products/${id}`,

  ORDERS: "/orders",
  ORDER_BY_ID: (id: string) => `/orders/${id}`,
  ORDER_CANCEL: (id: string) => `/orders/${id}/cancel`,
  ORDERS_BY_PHONE: (phone: string) => `/orders/customer/${phone}`,
  PUSH_REGISTER: "/push/register",
};

export default ENDPOINTS;
