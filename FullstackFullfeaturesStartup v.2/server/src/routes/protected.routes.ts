import { Router } from "express";
import { auth } from "../middleware/auth.middleware";
import { pool } from "../config/db";
import { requireActiveUser } from "../middleware/requireActiveUser";

const router = Router();

router.get("/admin", auth("Administrator"), requireActiveUser, async (req, res) => {
  try {
    res.json({ message: "Admin data" });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/manager", auth("Manager"), requireActiveUser, async (req, res) => {
  try {
    res.json({ message: "Manager data" });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/officer", auth("Officer"), requireActiveUser, async (req, res) => {
  try {
    res.json({ message: "Officer data" });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/customer", auth("Customer"), requireActiveUser, async (req, res) => {
  try {
    res.json({ message: "Customer data" });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Pagination + search example
router.get("/users", auth("Administrator"), requireActiveUser, async (req, res) => {
  try {
    const { search = "", page = 1, limit = 10 } = req.query;

    const users = await pool.query(
      `SELECT * FROM users
       WHERE email ILIKE $1
       ORDER BY id
       LIMIT $2 OFFSET $3`,
      [`%${search}%`, Number(limit), (Number(page) - 1) * Number(limit)]
    );

    res.json(users.rows);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

export default router;