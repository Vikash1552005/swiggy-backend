import express from "express";
import { addToCart, getCart, removeFromCart, updateCart } from "../controllers/cartController.js";

const router = express.Router();

// router.post("/total", getCartTotal);
router.get("/", getCart);        // 🔥 REQUIRED
router.post("/add",  addToCart);  // already used by frontend
router.put("/update",   updateCart);
router.delete("/remove/:productId",   removeFromCart);
export default router;
