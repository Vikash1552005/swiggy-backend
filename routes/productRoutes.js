import express from "express";
import { getProducts, importProducts } from "../controllers/productController.js";

const router = express.Router();

router.post("/import", importProducts);

router.get("/products", getProducts);

export default router;
