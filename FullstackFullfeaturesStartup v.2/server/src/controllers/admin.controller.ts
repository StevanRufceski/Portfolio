import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { createUserSchema } from "../schemas/admin.schema";

export const AdminController = {
  createUser: async (req: Request, res: Response) => {
    const parsed = createUserSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const creator = (req as any).user;
    if (!creator) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { full_name, email, phone, password, role } = parsed.data;

    const allowedRoles: Record<string, string[]> = {
      Administrator: ["Customer", "Officer", "Manager", "Administrator"],
      Manager: ["Customer"],
      Officer: ["Customer"],
    };

    if (!allowedRoles[creator.role]?.includes(role)) {
      return res.status(403).json({ message: "Role not allowed" });
    }

    const result = await AuthService.signup(
      full_name,
      email,
      phone,
      password,
      role,
      "active",
      creator.id // ✅ created_by
    );

    if (result.error) {
      return res.status(400).json({ message: result.error });
    }

    return res.status(201).json(result.user);
  },
};
