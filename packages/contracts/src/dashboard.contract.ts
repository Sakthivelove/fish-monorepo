import { initContract } from "@ts-rest/core";
import { z } from "zod";

const c = initContract();



export const dashboardContract = c.router({
    getStats: {
        method: "GET",
        path: "/dashboard/stats",

        responses: {
            200: z.object({
                totalProducts: z.number(),
                totalOrders: z.number(),
                pendingOrders: z.number(),
                deliveredOrders: z.number(),
                totalRevenue: z.number(),

                recentOrders: z.array(
                    z.object({
                        id: z.string(),
                        customerName: z.string(),
                        totalAmount: z.number(),
                        status: z.string(),
                    })
                ),

                lowStockProducts: z.array(
                    z.object({
                        id: z.string(),
                        tamilName: z.string(),
                        stockQuantityGrams: z.number(),
                    })
                ),
                todayOrders: z.number(),
                todayRevenue: z.number(),

                monthlyOrders: z.number(),
                monthlyRevenue: z.number(),
                topSellingProducts: z.array(
                    z.object({
                        productId: z.string(),
                        tamilName: z.string(),
                        totalSoldGrams: z.number(),
                    })
                ),
            }),
        },
    },
});