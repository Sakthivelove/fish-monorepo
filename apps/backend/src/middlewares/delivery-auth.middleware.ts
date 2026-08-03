import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface DeliveryAuthRequest extends Request {
  deliveryPartner?: {
    deliveryPartnerId: string;
  };
}

// Shared by the Express-level middleware below (for real request
// blocking) and by ts-rest delivery handlers directly (which need
// to know *which* delivery partner is asking, e.g. to filter
// orders — ts-rest handlers in this codebase only receive
// {params, query, body, headers}, not the raw req, so they can't
// read what the middleware attached to req).
export function verifyDeliveryToken(
  authHeader: string | undefined
): { deliveryPartnerId: string } | null {
  if (!authHeader) return null;

  const token = authHeader.replace("Bearer ", "");

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as { deliveryPartnerId?: string };

    if (!payload.deliveryPartnerId) return null;

    return { deliveryPartnerId: payload.deliveryPartnerId };
  } catch {
    return null;
  }
}

export const authenticateDeliveryPartner = (
  req: DeliveryAuthRequest,
  res: Response,
  next: NextFunction
) => {
  const identity = verifyDeliveryToken(req.headers.authorization);

  if (!identity) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  req.deliveryPartner = identity;

  next();
};
