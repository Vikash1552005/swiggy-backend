import express from "express";
import {
    createOffer,
    deleteOffer,
    getActiveOffers,
    getAllOffers,
    updateOffer,
} from "../controllers/offerController.js";
import upload from "../middleware/multer.js";

const router = express.Router();

// Admin
router.post("/admin/offer", upload.single("image"), createOffer);
router.get("/admin/offers", getAllOffers);
router.put("/admin/offer/:id", upload.single("image"), updateOffer);
router.delete("/admin/offer/:id", deleteOffer);

router.get("/offers/active", getActiveOffers);


export default router;
