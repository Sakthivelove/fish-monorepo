import { initServer } from "@ts-rest/express";
import { ordersContract } from "@fish/contracts";
import * as controller from "../controllers/orders.controller";

// ---------------------------------------------------
// ts-rest Server Init
// ---------------------------------------------------

const s = initServer();

export const ordersRouter = s.router(ordersContract, {
  getOrders: controller.getOrders,
  getOrderById: controller.getOrderById,
  createOrder: controller.createOrder,
  updateOrderStatus: controller.updateOrderStatus,
  getOrdersByPhone: controller.getOrdersByPhone,
  cancelOrder: controller.cancelOrder,
});
