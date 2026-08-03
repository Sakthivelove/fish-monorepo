import { initContract } from "@ts-rest/core";
import { z } from "zod";

const c = initContract();

export const reportsContract = c.router({
  getSummary: {
    method: "GET",
    path: "/reports/summary",

    responses: {
      200: z.object({
        totalRevenue: z.number(),
        totalOrders: z.number(),

        topProducts: z.array(
          z.object({
            productId: z.string(),
            tamilName: z.string(),
            quantitySoldGrams: z.number(),
          })
        ),

        statusCounts: z.array(
          z.object({
            status: z.string(),
            count: z.number(),
          })
        ),
      }),
    },
  },
});