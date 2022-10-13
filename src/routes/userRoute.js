import express from "express";
const router = express.Router();
// import auth from "../middleware/auth.middleware.js";
import controllers from "../controllers/userController.js";

router.post("/", controllers.createUser);
router.post("/verify", controllers.verifyEmail);
router.post("/login", controllers.login);
router.get("/", controllers.getAllUsers);
router.get("/:id", controllers.getAUser);
router.patch("/:id", controllers.updateUser);
router.delete("/:id", controllers.deleteUser);

export default router;
