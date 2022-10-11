import express from "express";
const router = express.Router();
import auth from "../middleware/auth.middleware.js";
import controllers from "../controllers/userController.js";

router.post("/", controllers.createUser);
router.post("/verify", controllers.verifyEmail);
router.post("/login", controllers.login);
router.get("/", auth.authenticate, auth.authorize, controllers.getAllUsers);
router.get("/:id", auth.authenticate, auth.authorize, controllers.getAUser);

export default router;
