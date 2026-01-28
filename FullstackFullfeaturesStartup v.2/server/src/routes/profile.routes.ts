// src/routes/profile.routes.ts
import { Router } from "express";
import { auth } from "../middleware/auth.middleware";
import { requireActiveUser } from "../middleware/requireActiveUser";
import { ProfileController } from "../controllers/profile.controller";

const router = Router();

// =====================
// Single public profile
// GET /profile/public/:id
// =====================
router.get("/public/:id", ProfileController.getPublicProfile);

// =====================
// Our Team (public)
// GET /profile/public
// =====================
router.get("/public", ProfileController.getPublicTeam);

// =====================
// Update own profile
// =====================
router.put("/", auth(), requireActiveUser, ProfileController.updateProfile);

export default router;
