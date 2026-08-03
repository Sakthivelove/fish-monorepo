import { initContract } from "@ts-rest/core";
import { z } from "zod";

const c = initContract();

export const adminRoleSchema = z.enum([
  "SUPER_ADMIN",
  "ADMIN",
]);

export const loginRequestSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
});

export const adminSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string().email(),
  role: adminRoleSchema,
});

export const loginResponseSchema = z.object({
  token: z.string(),
  admin: adminSchema,
});

export const authContract = c.router({
  login: {
    method: "POST",
    path: "/auth/login",

    body: loginRequestSchema,

    responses: {
      200: loginResponseSchema,
      401: z.object({
        message: z.string(),
      }),
    },
  },

  me: {
    method: "GET",
    path: "/auth/me",

    headers: z.object({
      authorization: z.string(),
    }),

    responses: {
      200: adminSchema,

      401: z.object({
        message: z.string(),
      }),
    },
  },
});