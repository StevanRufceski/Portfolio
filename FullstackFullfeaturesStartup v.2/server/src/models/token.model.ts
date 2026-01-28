import { pool } from "../config/db";

export const TokenModel = {
  async store(userId: string, token: string, expires: Date) {
    await pool.query(
      `INSERT INTO refresh_tokens(user_id, token, created_at, expires_at) 
       VALUES ($1, $2, NOW(), $3)`,
      [userId, token, expires]
    );
  },

  async delete(token: string) {
    await pool.query("DELETE FROM refresh_tokens WHERE token = $1", [token]);
  },

  async deleteUserTokens(userId: string) {
    await pool.query("DELETE FROM refresh_tokens WHERE user_id = $1", [userId]);
  },

  async find(token: string) {
    const res = await pool.query(
      "SELECT * FROM refresh_tokens WHERE token = $1 AND expires_at > NOW()",
      [token]
    );
    return res.rows[0] || null;
  },
};
