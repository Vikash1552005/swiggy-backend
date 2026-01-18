// routes/productRoutes.js
import express from "express";
import { addProduct, deleteProduct, getAllProducts, getProduct, getProductById, getProducts, getProductsByCategory, toggleProductStatus, updateProduct } from "../controllers/productController.js";
import upload from "../middleware/multer.js";

const router = express.Router();

// max 5 images, field name = images
router.post("/add", upload.array("images", 5), addProduct);
router.get("/", getProducts);
router.get("/admin/:id", getProductById);
router.get("/:id", getProduct);
router.put("/:id", upload.array("images", 5), updateProduct);
router.patch("/toggle/:id", toggleProductStatus);
router.delete("/:id", deleteProduct);
router.get("/all", getAllProducts);
router.get("/category/:category", getProductsByCategory);

export default router;
