import { productsContract } from "@fish/contracts";
import { initServer } from "@ts-rest/express";
import { prisma } from "../lib/prisma";
import * as controller from "../controllers/products.controller";

// ---------------------------------------------------
// ts-rest Server Init
// ---------------------------------------------------

const s = initServer();

export const productsRouter = s.router(productsContract, {
  getProducts: controller.getProducts,
  getProductById: controller.getProductById,
  createProduct: controller.createProduct,
  updateProduct: controller.updateProduct,
  deleteProduct: controller.deleteProduct,
});
