// src/models/users.model.ts
import { pool } from "../config/db";

export const UsersModel = {
  async create(
    full_name: string,
    email: string,
    phone: string,
    password: string,
    role: string,
    status: string,
    created_by: string | null
  ) {
    const res = await pool.query(
      `INSERT INTO users
        (full_name, email, phone, password, role, status, created_by, promoted, promo_number)
       VALUES ($1, $2, $3, $4, $5, $6, $7, false, NULL)
       RETURNING *`,
      [full_name, email, phone, password, role, status, created_by]
    );
    return res.rows[0];
  },


  async findByEmail(email: string) {
    const res = await pool.query(
      `SELECT 
        id, full_name, email, password, role, status, email_verified,
        title, description, phone, picture, promoted, promo_number, created_at, created_by
       FROM users
       WHERE email = $1`,
      [email]
    );
    return res.rows[0] || null;
  },

  async findById(id: string) {
    const res = await pool.query(
      `SELECT 
        id, full_name, email, role, status,
        title, description, phone, picture,
        promoted, promo_number,
        created_at, created_by
       FROM users
       WHERE id = $1`,
      [id]
    );
    return res.rows[0] || null;
  },

  async findByRole(role?: string) {
    const res = await pool.query(
      `SELECT 
        id, full_name, email, role, status,
        title, description, phone, picture,
        promoted, promo_number,
        created_at, created_by
       FROM users
       WHERE role = $1
       ORDER BY created_at DESC`,
      [role]
    );
    return res.rows;
  },

  async findAll() {
    const res = await pool.query(
      `SELECT 
        id, full_name, email, role, status,
        title, description, phone, picture,
        promoted, promo_number,
        created_at, created_by
       FROM users
       ORDER BY created_at DESC`
    );
    return res.rows;
  },

  async findPublicTeam() {
    const res = await pool.query(
      `
    SELECT
      id,
      full_name,
      title,
      description,
      picture,
      promo_number
    FROM users
    WHERE role IN ('Manager', 'Officer')
      AND status = 'active'
      AND promoted = true
    ORDER BY promo_number ASC
    `
    );

    return res.rows;
  },

  async updateByAdmin(
    id: string,
    data: {
      full_name?: string;
      title?: string;
      phone?: string;
      description?: string;
      picture?: string;
      status?: "active" | "deactivated";
      promoted?: boolean;
      promo_number?: string | null;
    }
  ) {
    const res = await pool.query(
      `UPDATE users SET
        full_name = COALESCE($1, full_name),
        title = COALESCE($2, title),
        phone = COALESCE($3, phone),
        description = COALESCE($4, description),
        picture = COALESCE($5, picture),
        status = COALESCE($6, status),
        promoted = COALESCE($7, promoted),
        promo_number = COALESCE($8, promo_number)
       WHERE id = $9
       RETURNING
         id, full_name, email, role, status,
         title, description, phone, picture,
         promoted, promo_number,
         created_at, created_by`,
      [
        data.full_name ?? null,
        data.title ?? null,
        data.phone ?? null,
        data.description ?? null,
        data.picture ?? null,
        data.status ?? null,
        data.promoted ?? null,
        data.promo_number ?? null,
        id,
      ]
    );
    return res.rows[0];
  },

  async updateSelf(
    id: string,
    data: {
      full_name?: string;
      phone?: string;
      description?: string;
      picture?: string;
    }
  ) {
    const res = await pool.query(
      `UPDATE users
       SET
         full_name = COALESCE($1, full_name),
         phone = COALESCE($2, phone),
         description = COALESCE($3, description),
         picture = COALESCE($4, picture)
       WHERE id = $5
       RETURNING
         id, full_name, email, role, status,
         title, description, phone, picture,
         promoted, promo_number,
         created_at, created_by`,
      [data.full_name ?? null, data.phone ?? null, data.description ?? null, data.picture ?? null, id]
    );
    return res.rows[0] || null;
  },

};
