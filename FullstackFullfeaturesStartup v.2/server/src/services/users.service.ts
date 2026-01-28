// src/services/users.service.ts
import { UsersModel } from "../models/users.model";

type Role = "Administrator" | "Manager" | "Officer" | "Customer";

export const UsersService = {
  async getUserById(requester: { id: string; role: Role }, targetUserId: string) {
    const user = await UsersModel.findById(targetUserId);
    if (!user) return null;

    const allowed =
      requester.role === "Administrator" ||
      requester.id === targetUserId ||
      ((requester.role === "Manager" || requester.role === "Officer") && user.role === "Customer");

    if (!allowed) throw new Error("FORBIDDEN");

    return user;
  },

  async getUsers(requester: { id: string; role: Role }, roleQuery?: string) {
    if (requester.role === "Manager" || requester.role === "Officer") {
      return UsersModel.findByRole("Customer");
    }

    if (requester.role === "Administrator") {
      if (roleQuery) return UsersModel.findByRole(roleQuery);
      return UsersModel.findAll();
    }

    return [];
  },

  async updateUser(
    requester: { id: string; role: Role },
    targetUserId: string,
    data: any
  ) {
    const isSelf = requester.id === targetUserId;
    const isAdmin = requester.role === "Administrator";

    if (!isSelf && !isAdmin) throw new Error("FORBIDDEN");

    if (isAdmin) {
      // Prevent changing system admin email/status
      if (data.email === "admin@system.local") delete data.status;
      return UsersModel.updateByAdmin(targetUserId, data);
    }

    return UsersModel.updateSelf(targetUserId, data);
  },
};
