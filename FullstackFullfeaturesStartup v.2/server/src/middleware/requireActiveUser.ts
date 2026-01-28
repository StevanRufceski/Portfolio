// src/middleware/requireActiveUser.ts
import { Request, Response, NextFunction } from "express";
import { UsersModel } from "../models/users.model";

export const requireActiveUser = async (req: Request, res: Response, next: NextFunction) => {
  const authUser = (req as any).user;
  if (!authUser) return res.status(401).json({ message: "Unauthorized" });

  const user = await UsersModel.findById(authUser.id);
  if (!user || user.status === "deactivated") {
    return res.status(403).json({ message: "User deactivated" });
  }

  next();
};
