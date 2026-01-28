import bcrypt from "bcryptjs";
import { pool } from "../config/db";

export async function bootstrapAdmin() {
  const fullName = process.env.ADMIN_FULL_NAME || "System Administrator";
  const email = process.env.ADMIN_EMAIL!;
  const password = process.env.ADMIN_PASSWORD!;
  const phone = process.env.ADMIN_PHONE!;

  if (!email || !password || !phone) {
    throw new Error("Admin env variables missing");
  }

  const existing = await pool.query(
    "SELECT id FROM users WHERE email = $1",
    [email]
  );

  if (existing.rowCount && existing.rowCount > 0) {
    console.log("✅ Admin already exists");
    return;
  }

  const hashed = await bcrypt.hash(password, 12);

  await pool.query(
    `
    INSERT INTO users (
      full_name,
      email,
      password,
      role,
      status,
      email_verified,
      title,
      description,
      phone,
      picture,
      created_by
    )
    VALUES (
      $1, $2, $3,
      'Administrator',
      'active',
      true,
      NULL,
      NULL,
      $4,
      NULL,
      NULL
    )
    `,
    [fullName, email, hashed, phone]
  );

  console.log("🔥 Admin account created");
}
