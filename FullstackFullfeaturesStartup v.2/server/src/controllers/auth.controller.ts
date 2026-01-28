// src/controllers/auth.controller.ts
import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { signupSchema, loginSchema, resetPasswordSchema } from "../schemas/auth.schema";

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export const AuthController = {
  signup: async (req: Request, res: Response) => {
    const parsed = signupSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Validation failed", errors: parsed.error.flatten().fieldErrors });
    }

    const authUser = (req as any).user;
    let role = "Customer";

    if (authUser) {
      if (authUser.role === "Administrator") role = parsed.data.role || "Customer";
      else if (["Officer", "Manager"].includes(authUser.role)) role = "Customer";
    }

    try {
      const result = await AuthService.signup(
        parsed.data.full_name,
        parsed.data.email,
        parsed.data.phone,
        parsed.data.password,
        role,
        "active",
        null // ✅ public signup
      );
      if (result.error) return res.status(400).json({ message: result.error });
      return res.status(201).json(result);
    } catch (err: any) {
      console.error("Signup error:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  login: async (req: Request, res: Response) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Invalid login data" });

    try {
      const result = await AuthService.login(parsed.data.email, parsed.data.password, req);

      if (result.error) return res.status(401).json({ message: result.error });

      // Block deactivated users ✅ UPDATED
      if (result.user.status === "deactivated") {
        return res.status(403).json({ message: "Your account is deactivated" });
      }

      res.cookie("refreshToken", result.refreshToken, REFRESH_COOKIE_OPTIONS);
      return res.json({ accessToken: result.accessToken, user: result.user });
    } catch (err: any) {
      console.error("Login error:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  logout: async (req: Request, res: Response) => {
    const refreshToken = req.cookies?.refreshToken;
    if (refreshToken) await AuthService.logout(refreshToken, req);
    res.clearCookie("refreshToken", { path: "/" });
    return res.json({ success: true });
  },

  refresh: async (req: Request, res: Response) => {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) return res.status(401).json({ message: "No refresh token" });

    try {
      const result = await AuthService.refresh(refreshToken, req);
      if (result.error) return res.status(401).json({ message: result.error });

      // ✅ NEW: Check if the user is deactivated
      if (!result.userId) return res.status(401).json({ message: "Invalid token" });
      const user = await AuthService.getAuthUserById(result.userId);
      if (user?.status === "deactivated") {
        // Clear cookie and prevent issuing a new access token
        res.clearCookie("refreshToken", { path: "/" });
        return res.status(403).json({ message: "Your account is deactivated" });
      }

      res.cookie("refreshToken", result.refreshToken, REFRESH_COOKIE_OPTIONS);
      return res.json({ accessToken: result.accessToken });
    } catch (err: any) {
      console.error("Refresh token error:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  requestReset: async (req: Request, res: Response) => {
    const { email } = req.body;
    try {
      const result = await AuthService.requestPasswordReset(email);
      return res.json(result);
    } catch (err: any) {
      console.error("Request password reset error:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  resetPassword: async (req: Request, res: Response) => {
    const parsed = resetPasswordSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Invalid password" });

    const token = req.params.token;
    try {
      const result = await AuthService.resetPassword(token, parsed.data.password);
      if (result.error) return res.status(400).json({ message: result.error });
      return res.json(result);
    } catch (err: any) {
      console.error("Reset password error:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  verifyEmail: async (req: Request, res: Response) => {
    const token = req.params.token;
    try {
      const result = await AuthService.verifyEmail(token);
      if (result.error) return res.status(400).json({ message: result.error });
      return res.json(result);
    } catch (err: any) {
      console.error("Verify email error:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  me: async (req: Request, res: Response) => {
    const authUser = (req as any).user;
    if (!authUser) return res.status(401).json({ message: "Unauthorized" });

    try {
      const user = await AuthService.getAuthUserById(authUser.id);
      if (!user) return res.status(404).json({ message: "User not found" });
      return res.json(user);
    } catch (err: any) {
      console.error("Get current user error:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

};
