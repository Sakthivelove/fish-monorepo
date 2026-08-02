import { prisma } from "../lib/prisma";
import { z } from "zod";
import { updateStockSchema } from "@fish/contracts";

export const getInventory =
    async () => {
        const products =
            await prisma.product.findMany({
                include: {
                    inventory: true,
                },
            });

        return {
            status: 200 as const,

            body: products.map(
                (product) => ({
                    productId:
                        product.id,

                    tamilName:
                        product.nameTamil,

                    category:
                        product.category,

                    stockQuantityGrams:
                        product.inventory
                            ?.stockQuantityGrams ??
                        0,
                })
            ),
        };
    };

export const updateStock =
    async ({
        params,
        body,
    }: {
        params: {
            productId: string;
        };
        body: z.infer<
            typeof updateStockSchema
        >;
    }) => {
        const inventory =
            await prisma.inventory.findUnique({
                where: {
                    productId:
                        params.productId,
                },
                include: {
                    product: true,
                },
            });

        if (!inventory) {
            return {
                status: 404 as const,
                body: {
                    message:
                        "Inventory not found",
                },
            };
        }

        const updated =
            await prisma.inventory.update({
                where: {
                    productId:
                        params.productId,
                },
                data: {
                    stockQuantityGrams:
                        body.stockQuantityGrams,
                },
                include: {
                    product: true,
                },
            });

        return {
            status: 200 as const,
            body: {
                productId:
                    updated.productId,

                tamilName:
                    updated.product.nameTamil,

                category:
                    updated.product.category,

                stockQuantityGrams:
                    updated.stockQuantityGrams,
            },
        };
    };