import { AuditModel } from "../models/audit.model";

export const AuditService = {
  async log(userId: string | null, action: string, req: any) {
    try {
      const ip = req.ip || req.connection.remoteAddress || "unknown";
      const agent = req.headers["user-agent"] || "";
      await AuditModel.log(userId, action, ip, agent);
    } catch (err: any) {
      console.error("Audit log failed:", err.message);
      // Do not throw, logging failure should not break main request
    }
  },
};
