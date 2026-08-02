import { initContract } from "@ts-rest/core";
import { z } from "zod";

const c = initContract();

export const inventoryItemSchema =
  z.object({
    productId: z.string(),
    tamilName: z.string(),
    category: z.string(),
    stockQuantityGrams: z.number(),
  });

export const updateStockSchema =
  z.object({
    stockQuantityGrams: z.number().min(0),
  });

export const inventoryContract =
  c.router({
    getInventory: {
      method: "GET",
      path: "/inventory",

      responses: {
        200: z.array(
          inventoryItemSchema
        ),
      },
    },

    updateStock: {
      method: "PATCH",
      path: "/inventory/:productId",

      pathParams: z.object({
        productId: z.string(),
      }),

      body: updateStockSchema,

      responses: {
        200: inventoryItemSchema,

        404: z.object({
          message: z.string(),
        }),
      },
    },
  });