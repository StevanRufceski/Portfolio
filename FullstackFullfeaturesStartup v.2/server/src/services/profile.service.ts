// src/services/profile.service.ts
import { UsersModel } from "../models/users.model";

export const ProfileService = {
  // =====================
  // Single public profile
  // =====================
  async getPublicProfile(userId: string) {
    const user = await UsersModel.findById(userId);
    if (!user) return null;

    // OPTIONAL: prevent showing deactivated users
    if (user.status !== "active") return null;

    return {
      id: user.id,
      full_name: user.full_name,
      title: user.title,
      description: user.description,
      picture: user.picture,
    };
  },

  // =====================
  // Our Team 
  // =====================
  async getPublicTeam() {
    return UsersModel.findPublicTeam();
  },
  // =====================
  // Update own profile
  // =====================
  async updateProfile(
    userId: string,
    data: {
      title?: string;
      description?: string;
      phone?: string;
      picture?: string;
      full_name?: string;
    }
  ) {
    const updatedUser = await UsersModel.updateSelf(userId, data);
    return updatedUser ?? null;
  },

};
