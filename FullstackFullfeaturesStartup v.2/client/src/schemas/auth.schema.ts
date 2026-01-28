import { z } from "zod";

// Mobile and landline prefixes
const mobilePrefixes = ["70", "71", "72", "73", "74", "75", "76", "77", "78", "79"];
const landlinePrefixes = [
  "2","31","32","33","34","35","37","41","42","43","44","45","46","47","48","51","52","53","54"
];

// Mobile regex: +389 + prefix + 6 digits
const mobileRegex = new RegExp(`^\\+389(?:${mobilePrefixes.join("|")})\\d{6}$`);

// Landline regex: +389 + prefix + 7 digits
const landlineRegex = new RegExp(`^\\+389(?:${landlinePrefixes.join("|")})\\d{7}$`);

export const signupSchema = z.object({
  full_name: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().refine((val) => {
    // Remove spaces and dashes for validation
    const normalized = val.replace(/[\s-]/g, "");
    return mobileRegex.test(normalized) || landlineRegex.test(normalized);
  }, {
    message: "Phone number must be a valid North Macedonia mobile or landline",
  }),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["Administrator", "Manager", "Officer", "Customer"]),
});
