import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest
  extends Request {
  admin?: {
    adminId: string;
    role: string;
  };
}

export const authenticateAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader =
    req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  const token =
    authHeader.replace(
      "Bearer ",
      ""
    );

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as {
      adminId: string;
      role: string;
    };

    req.admin = payload;

    next();
  } catch {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
};