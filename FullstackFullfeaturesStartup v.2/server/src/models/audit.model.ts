import { pool } from "../config/db";

export const AuditModel = {
  async log(userId: string | null, action: string, ip: string, agent: string) {
    await pool.query(
      "INSERT INTO audit_logs(user_id, action, ip_address, user_agent) VALUES ($1,$2,$3,$4)",
      [userId, action, ip, agent]
    );
  },

  async search(params: { page: number; limit: number; search: string }) {
    const { page, limit, search } = params;

    const offset = (page - 1) * limit;

    const res = await pool.query(
      `SELECT * FROM audit_logs 
       WHERE action ILIKE $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [`%${search}%`, limit, offset]
    );

    return res.rows;
  }
};
