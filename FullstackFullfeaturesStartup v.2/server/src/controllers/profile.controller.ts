// src/controllers/profile.controller.ts
import { Request, Response } from "express";
import { ProfileService } from "../services/profile.service";
import { updateProfileSchema } from "../schemas/profile.schema";

export const ProfileController = {
  // =====================
  // Single public profile
  // =====================
  async getPublicProfile(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const profile = await ProfileService.getPublicProfile(id);

      if (!profile) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.json(profile);
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  },

  // =====================
  // Our Team 
  // =====================
  async getPublicTeam(req: Request, res: Response) {
    try {
      const team = await ProfileService.getPublicTeam();
      return res.json(team);
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  },

  // =====================
  // Update own profile
  // =====================
  async updateProfile(req: Request, res: Response) {
    const parsed = updateProfileSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const authUser = (req as any).user;
    if (!authUser) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const updatedUser = await ProfileService.updateProfile(
        authUser.id,
        parsed.data
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.json(updatedUser);
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  },

};
