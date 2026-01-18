import express from "express";
import { forgetPassword, login, resetPassword, signup } from "../controllers/authController.js";
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

router.post("/forget-password", forgetPassword);
router.post("/reset-password/:token", resetPassword);

export default router;
