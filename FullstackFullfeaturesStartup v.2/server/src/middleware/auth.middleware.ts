// src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import { verifyAccess } from "../utils/jwt";

export const auth = (...roles: string[]) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ message: "No token provided" });

    const token = header.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Invalid token format" });

    const decoded: any = verifyAccess(token);

    if (roles.length && !roles.includes(decoded.role)) {
      return res.status(403).json({ message: "Forbidden: insufficient role" });
    }

    (req as any).user = decoded;
    next();
  } catch (err: any) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
