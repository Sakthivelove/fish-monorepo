import { initServer } from "@ts-rest/express";
import { deliveryContract } from "@fish/contracts";
import * as controller from "../controllers/delivery.controller";

const s = initServer();

export const deliveryRouter = s.router(deliveryContract, {
  login: controller.login,
  getMyOrders: controller.getMyOrders,
  updateMyOrderStatus: controller.updateMyOrderStatus,
  adminListDeliveryPartners: controller.adminListDeliveryPartners,
  adminCreateDeliveryPartner: controller.adminCreateDeliveryPartner,
  adminAssignOrder: controller.adminAssignOrder,
});
