import { prisma } from "../lib/prisma";
import { z } from "zod";
import { createProductSchema, updateProductSchema } from "@fish/contracts";

import { ServerInferRequest } from "@ts-rest/core";
import { productsContract } from "@fish/contracts";

type GetProductsRequest =
  ServerInferRequest<
    typeof productsContract.getProducts
  >;

export const getProducts = async ({
  query,
}: GetProductsRequest) => {
  const products =
    await prisma.product.findMany({
      where: {
        AND: [
          !query.includeInactive
            ? {
              isActive: true,
            }
            : {},

          query.search
            ? {
              OR: [
                {
                  nameTamil: {
                    contains: query.search,
                    mode: "insensitive",
                  },
                },
                {
                  nameEnglish: {
                    contains: query.search,
                    mode: "insensitive",
                  },
                },
              ],
            }
            : {},

          query.category
            ? {
              category: query.category,
            }
            : {},
        ],
      },

      include: {
        inventory: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

  return {
    status: 200 as const,

    body: products.map(
      (product) => ({
        id: product.id,
        name:
          product.nameEnglish,
        tamilName:
          product.nameTamil,
        description:
          product.description,
        pricePerKg: Number(
          product.pricePerKg
        ),
        imageUrl:
          product.imageUrl,
        category:
          product.category,
        stockQuantityGrams:
          product.inventory
            ?.stockQuantityGrams ??
          0,
        isActive:
          product.isActive,
        createdAt:
          product.createdAt.toISOString(),
      })
    ),
  };
};
export const getProductById = async ({ params }: { params: { id: string } }) => {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: { inventory: true },
  });

  if (!product) {
    return { status: 404, body: { message: "Product not found" } } as const;
  }

  return {
    status: 200,
    body: {
      id: product.id,
      name: product.nameEnglish,
      tamilName: product.nameTamil,
      description: product.description,
      pricePerKg: Number(product.pricePerKg),
      imageUrl: product.imageUrl,
      category: product.category,
      stockQuantityGrams: product.inventory?.stockQuantityGrams || 0,
      isActive: product.isActive,
      createdAt: product.createdAt.toISOString(),
    },
  } as const;
};

export const createProduct = async ({ body }: { body: z.infer<typeof createProductSchema> }) => {
  const product = await prisma.product.create({
    data: {
      nameEnglish: body.name,
      nameTamil: body.tamilName,
      description: body.description,
      pricePerKg: body.pricePerKg,
      imageUrl: body.imageUrl,
      category: body.category,
      inventory: { create: { stockQuantityGrams: body.stockQuantityGrams } },
    },
    include: { inventory: true },
  });

  return {
    status: 201,
    body: {
      id: product.id,
      name: product.nameEnglish,
      tamilName: product.nameTamil,
      description: product.description,
      pricePerKg: Number(product.pricePerKg),
      imageUrl: product.imageUrl,
      category: product.category,
      stockQuantityGrams: product.inventory?.stockQuantityGrams || 0,
      isActive: product.isActive,
      createdAt: product.createdAt.toISOString(),
    },
  } as const;
};

export const updateProduct = async ({
  params,
  body,
}: {
  params: { id: string };
  body: z.infer<typeof updateProductSchema>;
}) => {
  const existing =
    await prisma.product.findUnique({
      where: {
        id: params.id,
      },
    });

  if (!existing) {
    return {
      status: 404,
      body: {
        message: "Product not found",
      },
    } as const;
  }

  const updated =
    await prisma.product.update({
      where: {
        id: params.id,
      },
      data: {
        ...(body.name !== undefined && {
          nameEnglish: body.name,
        }),

        ...(body.tamilName !== undefined && {
          nameTamil:
            body.tamilName,
        }),

        ...(body.description !==
          undefined && {
          description:
            body.description,
        }),

        ...(body.pricePerKg !==
          undefined && {
          pricePerKg:
            body.pricePerKg,
        }),

        ...(body.imageUrl !==
          undefined && {
          imageUrl:
            body.imageUrl,
        }),

        ...(body.category !==
          undefined && {
          category:
            body.category,
        }),

        ...(body.isActive !== undefined && {
          isActive: body.isActive,
        }),
      },
      include: {
        inventory: true,
      },
    });

  if (
    body.stockQuantityGrams !==
    undefined
  ) {
    await prisma.inventory.update({
      where: {
        productId: params.id,
      },
      data: {
        stockQuantityGrams:
          body.stockQuantityGrams,
      },
    });
  }

  const inventory =
    await prisma.inventory.findUnique({
      where: {
        productId: params.id,
      },
    });

  return {
    status: 200,
    body: {
      id: updated.id,
      name:
        updated.nameEnglish,
      tamilName:
        updated.nameTamil,
      description:
        updated.description,
      pricePerKg: Number(
        updated.pricePerKg
      ),
      imageUrl:
        updated.imageUrl,
      category:
        updated.category,
      stockQuantityGrams:
        inventory
          ?.stockQuantityGrams ??
        0,
      isActive:
        updated.isActive,
      createdAt:
        updated.createdAt.toISOString(),
    },
  } as const;
};

export const deleteProduct = async ({ params }: { params: { id: string } }) => {
  const existing = await prisma.product.findUnique({ where: { id: params.id } });

  if (!existing) return { status: 404, body: { message: "Product not found" } } as const;

  await prisma.product.update({ where: { id: params.id }, data: { isActive: false } });

  return { status: 200, body: { message: "Product deleted" } } as const;
};
