import express from "express";
const router = express.Router();
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import {
  createUser,
  verifyEmail,
  login,
  getAllUsers,
  getAUser,
} from "../controllers/userController.js";

router.post("/", createUser);
router.post("/verify", verifyEmail);
router.post("/login", login);
router.get("/", authenticate, authorize, getAllUsers);
router.get("/:id", authenticate, authorize, getAUser);

export default router;
