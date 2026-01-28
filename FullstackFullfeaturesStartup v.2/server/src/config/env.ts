import dotenv from "dotenv";
dotenv.config();

const ENV = process.env.NODE_ENV || "dev";

export const config = {
  env: ENV,
  isDev: ENV === "dev",
  isProd: ENV === "prod",

  PORT: process.env.PORT || "5000",

  ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!,
  REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,

  ACCESS_EXPIRES: "15m" as const,
  REFRESH_EXPIRES: "7d" as const,
};
