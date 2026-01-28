// src/routes/users.routes.ts
import { Router } from "express";
import { auth } from "../middleware/auth.middleware";
import { UsersController } from "../controllers/users.controller";
import { requireActiveUser } from "../middleware/requireActiveUser";

const router = Router();

// GET /users/:id — self or admin can view
router.get("/:id", auth(), requireActiveUser, UsersController.getUserById);

// GET /users — only admin, manager, officer
router.get("/", auth("Administrator", "Manager", "Officer"), requireActiveUser, UsersController.getUsers);

// PUT /users/:id — update profile
router.put("/:id", auth(), requireActiveUser, UsersController.updateUser);

export default router;
