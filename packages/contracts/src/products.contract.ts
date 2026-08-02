import { initContract } from "@ts-rest/core";
import { z } from "zod";

const c = initContract();

export const productSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  tamilName: z.string(),
  description: z.string().nullable(),
  pricePerKg: z.number(),
  imageUrl: z.string(),
  category: z.string(),
  stockQuantityGrams: z.number(),
  isActive: z.boolean(),
  createdAt: z.string(),
});

export const createProductSchema = z.object({
  name: z.string().min(2).nullable(),
  tamilName: z.string().min(2),
  description: z.string(),
  pricePerKg: z.number().positive(),
  imageUrl: z.string().url(),
  category: z.string(),
  stockQuantityGrams: z.number().min(0),
});

export const updateProductSchema =
  createProductSchema
    .partial()
    .extend({
      isActive: z.boolean().optional(),
    });;

export const productsContract = c.router({
  getProducts: {
    method: "GET",
    path: "/products",
    query: z.object({
      search: z.string().optional(),
      category: z.string().optional(),
      includeInactive: z.coerce.boolean().optional()
    }),
    responses: {
      200: z.array(productSchema),
    },
  },

  getProductById: {
    method: "GET",
    path: "/products/:id",
    pathParams: z.object({
      id: z.string(),
    }),
    responses: {
      200: productSchema,
      404: z.object({
        message: z.string(),
      }),
    },
  },

  createProduct: {
    method: "POST",
    path: "/products",
    body: createProductSchema,
    responses: {
      201: productSchema,
    },
  },

  updateProduct: {
    method: "PUT",
    path: "/products/:id",
    pathParams: z.object({
      id: z.string(),
    }),
    body: updateProductSchema,
    responses: {
      200: productSchema,
      404: z.object({
        message: z.string(),
      }),
    },
  },

  deleteProduct: {
    method: "DELETE",
    path: "/products/:id",
    pathParams: z.object({
      id: z.string(),
    }),
    responses: {
      200: z.object({
        message: z.string(),
      }),
      404: z.object({
        message: z.string(),
      }),
    },
  },
});