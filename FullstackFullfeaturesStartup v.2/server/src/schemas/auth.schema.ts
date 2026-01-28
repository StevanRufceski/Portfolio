import { z } from "zod";

// Status enum (not exposed in form, default applied backend)
export const enumStatusActivity = z.enum(["active", "deactivated"]);

// Signup schema (with full_name and status default)
export const signupSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .min(7, "Phone number is required")
    .max(30, "Phone number is too long"),
  password: z.string().min(6, "Password must be at least 6 characters").max(128, "Password must be at most 128 characters"),
  role: z.enum(["Administrator", "Manager", "Officer", "Customer"]),
  status: enumStatusActivity.default("active"),
});


// Login schema (INTENTIONALLY relaxed)
export const loginSchema = z.object({
  email: z.string().min(1),
  password: z.string().min(6, "Password must be at least 6 characters").max(128, "Password must be at most 128 characters"),
});

// Reset password schema
export const resetPasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters").max(128, "Password must be at most 128 characters"),
});
