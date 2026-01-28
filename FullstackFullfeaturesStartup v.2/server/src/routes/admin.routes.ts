import { Router } from "express";
import { auth } from "../middleware/auth.middleware";
import { AdminController } from "../controllers/admin.controller";
import { requireActiveUser } from "../middleware/requireActiveUser";

const router = Router();

router.post("/create-user", auth("Administrator", "Manager", "Officer"), requireActiveUser, AdminController.createUser);

export default router;
