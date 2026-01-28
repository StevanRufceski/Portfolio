// src/schemas/profile.schema.ts
import { z } from "zod";

export const updateProfileSchema = z.object({
  full_name: z.string().min(1).optional(),
  phone: z.string().max(30).optional(),
  title: z.string().max(100).optional(),
  description: z.string().max(500).optional(),
  picture: z.string().url().optional(),
  promoted: z.boolean().optional(),           // new: boolean for admin
  promo_number: z.string().max(50).nullable().optional(), // new: string or null
});

