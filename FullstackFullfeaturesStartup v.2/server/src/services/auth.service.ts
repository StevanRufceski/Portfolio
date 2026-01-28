// src/services/auth.service.ts
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { pool } from "../config/db";
import { UsersModel } from "../models/users.model";
import { TokenModel } from "../models/token.model";
import { AuditService } from "./audit.service";
import { signAccessToken, signRefreshToken, verifyRefresh } from "../utils/jwt";
import { sendMail } from "../utils/email";

const FRONTEND_URL = process.env.FRONTEND_URL;
if (!FRONTEND_URL) {
  throw new Error("FRONTEND_URL not defined");
}

export const AuthService = {
  // =====================
  // Signup
  // =====================
  // Only minor adjustments: ensure role is required, default to Customer
  async signup(
    full_name: string,
    email: string,
    phone: string,
    password: string,
    role: string,
    status: "active" | "deactivated",
    created_by: string | null
  ) {
    if (!full_name || !email || !password) {
      return { error: "Missing signup data" };
    }

    if (!role) role = "Customer"; // force Customer if undefined

    const hashed = await bcrypt.hash(password, 10);

    const user = await UsersModel.create(
      full_name,
      email,
      phone,
      hashed,
      role,
      status,
      created_by
    );


    const token = crypto.randomUUID();
    await pool.query(
      `INSERT INTO email_verification_tokens (user_id, token, expires_at)
     VALUES ($1, $2, NOW() + INTERVAL '1 day')`,
      [user.id, token]
    );

    try {
      await sendMail(
        email,
        "Verify your email",
        `<a href="${FRONTEND_URL}/verify/${token}">Verify Email</a>`
      );
    } catch (err) {
      console.error("Email sending failed:", err);
      // DO NOT throw
    }

    return { user };
  },


  // =====================
  // Login
  // =====================
  async login(email: string, password: string, req: any) {
    if (!email || !password) {
      return { error: "Missing login data" };
    }

    const user = await UsersModel.findByEmail(email);
    if (!user) {
      return { error: "Invalid credentials" };
    }

    if (!user.email_verified) {
      return { error: "Email not verified" };
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      await AuditService.log(null, "failed_login", req);
      return { error: "Invalid credentials" };
    }

    const accessToken = signAccessToken({
      id: user.id,
      role: user.role,
    });
    const refreshToken = signRefreshToken({
      id: user.id,
      role: user.role,
    });

    const expires = new Date();
    expires.setDate(expires.getDate() + 7);
    await TokenModel.store(user.id, refreshToken, expires);

    await AuditService.log(user.id, "login", req);

    return { user, accessToken, refreshToken };
  },

  // =====================
  // Logout
  // =====================
  async logout(refreshToken: string, req: any) {
    if (!refreshToken) {
      return { error: "Missing refresh token" };
    }

    await TokenModel.delete(refreshToken);
    await AuditService.log(null, "logout", req);

    return { success: true };
  },

  // =====================
  // Refresh token rotation
  // =====================
  async refresh(oldToken: string, req: any) {
    if (!oldToken) {
      return { error: "Missing refresh token" };
    }

    const existing = await TokenModel.find(oldToken);
    if (!existing) {
      return { error: "Invalid refresh token" };
    }

    const decoded = verifyRefresh(oldToken) as {
      id: string;
      role: string;
    };

    const newAccessToken = signAccessToken({
      id: decoded.id,
      role: decoded.role,
    });
    const newRefreshToken = signRefreshToken({
      id: decoded.id,
      role: decoded.role,
    });

    const expires = new Date();
    expires.setDate(expires.getDate() + 7);
    await TokenModel.store(decoded.id, newRefreshToken, expires);

    await AuditService.log(decoded.id, "refresh_token", req);

    await TokenModel.delete(oldToken);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      userId: decoded.id,
    };
  },

  // =====================
  // Get current user
  // =====================
  async getAuthUserById(id: string) {
    const user = await UsersModel.findById(id);
    if (!user) return null;

    return {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
      status: user.status,
      title: user.title,
      description: user.description,
      phone: user.phone,
      picture: user.picture,
    };
  },

  // =====================
  // Password reset request
  // =====================
  async requestPasswordReset(email: string) {
    if (!email) {
      return { error: "Email is required" };
    }

    const user = await UsersModel.findByEmail(email);
    if (!user) {
      return { message: "If email exists, reset link was sent" };
    }

    const token = crypto.randomUUID();
    await pool.query(
      `INSERT INTO password_reset_tokens (user_id, token, expires_at)
       VALUES ($1, $2, NOW() + INTERVAL '1 hour')`,
      [user.id, token]
    );

    await sendMail(
      email,
      "Reset Password",
      `<a href="${FRONTEND_URL}/reset/${token}">Reset Password</a>`
    );

    return { message: "If email exists, reset link was sent" };
  },

  // =====================
  // Reset password
  // =====================
  async resetPassword(token: string, newPassword: string) {
    if (!token || !newPassword) {
      return { error: "Missing token or password" };
    }

    const res = await pool.query(
      `SELECT * FROM password_reset_tokens
       WHERE token = $1 AND expires_at > NOW()`,
      [token]
    );

    const row = res.rows[0];
    if (!row) {
      return { error: "Invalid or expired token" };
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await pool.query(
      `UPDATE users SET password = $1 WHERE id = $2`,
      [hashed, row.user_id]
    );

    await pool.query(
      `DELETE FROM password_reset_tokens WHERE token = $1`,
      [token]
    );

    return { success: true };
  },

  // =====================
  // Verify email
  // =====================
  async verifyEmail(token: string) {
    if (!token) {
      return { error: "Missing token" };
    }

    const res = await pool.query(
      `SELECT * FROM email_verification_tokens
       WHERE token = $1 AND expires_at > NOW()`,
      [token]
    );

    const row = res.rows[0];
    if (!row) {
      return { error: "Invalid or expired token" };
    }

    await pool.query(
      `UPDATE users SET email_verified = true WHERE id = $1`,
      [row.user_id]
    );

    await pool.query(
      `DELETE FROM email_verification_tokens WHERE token = $1`,
      [token]
    );

    return { success: true };
  },

};
