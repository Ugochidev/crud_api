import express from "express";
const router = express.Router();
import middleware from "../middleware/auth.middleware.js";
import controllers from "../controllers/userController.js";

router.post("/", controllers.createUser);
router.post("/verify", controllers.verifyEmail);
router.post("/login", controllers.login);
router.get("/", controllers.getAllUsers);
router.get("/:id",middleware.authenticate, controllers.getAUser);
router.patch("/:id",middleware.authenticate, controllers.updateUser);
router.delete("/:id",middleware.authenticate, controllers.deleteUser);

export default router;
