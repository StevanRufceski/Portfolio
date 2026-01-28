// src/app.ts
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

import authRoutes from "./routes/auth.routes";
import protectedRoutes from "./routes/protected.routes";
import profileRoutes from "./routes/profile.routes";
import adminRoutes from "./routes/admin.routes";
import usersRoutes from "./routes/users.routes";

export const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

// Routes
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/profile", profileRoutes);
app.use("/users", usersRoutes);
app.use("/protected", protectedRoutes);

export default app;
