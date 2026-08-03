import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import { ServerInferRequest } from "@ts-rest/core";
import { authContract } from "@fish/contracts";

type LoginRequest = ServerInferRequest<
  typeof authContract.login
>;

type MeRequest = ServerInferRequest<
  typeof authContract.me
>;

export const login = async ({
  body,
}: LoginRequest) => {
  const { username, password } = body;

  const admin = await prisma.admin.findUnique({
    where: {
      username,
    },
  });

  if (!admin || !admin.isActive) {
    return {
      status: 401 as const,
      body: {
        message: "Invalid credentials",
      },
    };
  }

  const isPasswordValid =
    await bcrypt.compare(
      password,
      admin.passwordHash
    );

  if (!isPasswordValid) {
    return {
      status: 401 as const,
      body: {
        message: "Invalid credentials",
      },
    };
  }

  const token = jwt.sign(
    {
      adminId: admin.id,
      role: admin.role,
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: "7d",
    }
  );

  await prisma.admin.update({
    where: {
      id: admin.id,
    },
    data: {
      lastLoginAt: new Date(),
    },
  });

  return {
    status: 200 as const,
    body: {
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
      },
    },
  };
};

export const me = async ({
  headers,
}: MeRequest) => {
  const authHeader =
    headers.authorization;

  if (
    !authHeader ||
    typeof authHeader !== "string"
  ) {
    return {
      status: 401 as const,
      body: {
        message: "Unauthorized",
      },
    };
  }

  const token = authHeader.replace(
    "Bearer ",
    ""
  );

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as {
      adminId: string;
    };

    const admin =
      await prisma.admin.findUnique({
        where: {
          id: payload.adminId,
        },
      });

    if (!admin) {
      return {
        status: 401 as const,
        body: {
          message: "Admin not found",
        },
      };
    }

    return {
      status: 200 as const,
      body: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
      },
    };
  } catch {
    return {
      status: 401 as const,
      body: {
        message: "Invalid token",
      },
    };
  }
};