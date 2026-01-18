import express from "express";
import {
    cancelOrder,
    placeOrder,
    returnOrder
} from "../controllers/orderController.js";


const router = express.Router();

router.post("/place",  placeOrder);
router.put("/cancel/:id",  cancelOrder);
router.put("/return/:id",  returnOrder);

export default router;
