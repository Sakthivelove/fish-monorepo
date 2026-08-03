import { initContract } from "@ts-rest/core";
import { z } from "zod";

const c = initContract();

export const customerSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().nullable(),
    phoneNumber: z.string(),

    totalOrders: z.number(),
    totalSpent: z.number(),

    createdAt: z.string(),
});

export const customerDetailsSchema =
    customerSchema.extend({
        orders: z.array(
            z.object({
                id: z.string(),
                totalAmount: z.number(),
                status: z.string(),
                createdAt: z.string(),
            })
        ),
    });

export const customersContract =
    c.router({
        getCustomers: {
            method: "GET",
            path: "/customers",
            query: z.object({
                search: z.string().optional(),
            }),
            responses: {
                200: z.array(
                    customerSchema
                ),
            },
        },

        getCustomerById: {
            method: "GET",
            path: "/customers/:id",

            pathParams: z.object({
                id: z.string(),
            }),

            responses: {
                200: z.object({
                    id: z.string(),
                    name: z.string(),
                    phoneNumber: z.string(),
                    email: z.string().nullable(),

                    totalOrders: z.number(),
                    totalSpent: z.number(),

                    orders: z.array(
                        z.object({
                            id: z.string(),
                            totalAmount: z.number(),
                            status: z.string(),
                            createdAt: z.string(),
                        })
                    ),
                }),

                404: z.object({
                    message: z.string(),
                }),
            },
        },
    });