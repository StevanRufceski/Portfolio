import { z } from "zod";

export const createUserSchema = z.object({
  full_name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1).max(30),
  password: z.string().min(6),
  role: z.enum(["Customer", "Officer", "Manager", "Administrator"]),
});
