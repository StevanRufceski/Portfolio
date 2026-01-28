// src/controllers/users.controller.ts
import { Request, Response } from "express";
import { UsersService } from "../services/users.service";
import { updateUserSchema } from "../schemas/users.schema";
import { updateProfileSchema } from "../schemas/profile.schema";

export const UsersController = {
  getUserById: async (req: Request, res: Response) => {
    try {
      const requester = (req as any).user;
      const { id } = req.params;
      const user = await UsersService.getUserById(requester, id);
      if (!user) return res.status(404).json({ message: "User not found" });
      return res.json(user);
    } catch (err: any) {
      if (err.message === "FORBIDDEN") return res.status(403).json({ message: "Forbidden" });
      console.error(err);
      return res.status(500).json({ message: "Failed to fetch user" });
    }
  },

  getUsers: async (req: Request, res: Response) => {
    try {
      const requester = (req as any).user;
      const users = await UsersService.getUsers(requester, req.query.role as string | undefined);
      return res.json(users);
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ message: "Failed to fetch users" });
    }
  },

  updateUser: async (req: Request, res: Response) => {
    try {
      const requester = (req as any).user;
      const { id } = req.params;
      const isSelf = requester.id === id;

      if (isSelf) {
        const parsed = updateProfileSchema.safeParse(req.body);
        if (!parsed.success)
          return res.status(400).json({ errors: parsed.error.flatten().fieldErrors });

        const updated = await UsersService.updateUser(requester, id, parsed.data);
        return res.json(updated);
      }

      // Admin edit
      const parsed = updateUserSchema.safeParse(req.body);
      if (!parsed.success)
        return res.status(400).json({ errors: parsed.error.flatten().fieldErrors });

      const updated = await UsersService.updateUser(requester, id, parsed.data);
      return res.json(updated);
    } catch (err: any) {
      if (err.message === "FORBIDDEN") return res.status(403).json({ message: "Forbidden" });
      console.error(err);
      return res.status(500).json({ message: "Failed to update user" });
    }
  },
};
