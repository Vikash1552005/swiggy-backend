// routes/carouselRoutes.js
import express from "express";
import {
    createCarousel,
    deleteCarousel,
    getActiveCarousels,
    getAllCarousels,
    updateCarousel,
} from "../controllers/carouselController.js";
import upload from "../middleware/multer.js";
const router = express.Router();

router.post("/", upload.single("image"), createCarousel);
router.get("/admin", getAllCarousels);
router.get("/", getActiveCarousels);
router.put(
    "/:id",
    upload.single("image"), // image optional
    updateCarousel
); router.delete("/:id", deleteCarousel);

export default router;
