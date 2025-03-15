import express from "express";
import { login, logout, signup, getCurrentUser } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// signup route
router.post("/signup", signup)
// login route
router.post("/login", login)
// logout route
router.post("/logout", logout)

router.get("/me", protectRoute, getCurrentUser);

export default router; 