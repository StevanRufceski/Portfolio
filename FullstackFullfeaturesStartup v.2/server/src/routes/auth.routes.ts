import { Router } from "express";
import { auth } from "../middleware/auth.middleware";
import { AuthController } from "../controllers/auth.controller";
import { requireActiveUser } from "../middleware/requireActiveUser";

const router = Router();

// =====================
// Public routes
// =====================
router.post("/signup", AuthController.signup);
router.post("/login", AuthController.login);
router.post("/logout", AuthController.logout);
router.post("/refresh", AuthController.refresh);

router.post("/request-reset", AuthController.requestReset);
router.post("/reset-password/:token", AuthController.resetPassword);
router.get("/verify/:token", AuthController.verifyEmail);

// =====================
// Protected routes
// =====================
router.get("/me", auth(), requireActiveUser, AuthController.me);

export default router;
