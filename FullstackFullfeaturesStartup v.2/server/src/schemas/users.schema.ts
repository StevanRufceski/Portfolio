import { z } from "zod";

export const updateUserSchema = z.object({
  full_name: z.string().min(1).optional(),
  phone: z.string().max(30).optional(),
  title: z.string().max(100).optional(),
  description: z.string().max(500).optional(),
  picture: z.string().optional(),
  status: z.enum(["active", "deactivated"]).optional(),
  promoted: z.boolean().optional(),
  promo_number: z.string().max(100).nullable().optional(),
});
