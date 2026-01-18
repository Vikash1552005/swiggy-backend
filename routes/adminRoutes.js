import express from "express";
import {
    createAdminUser,
    deleteAdminUser,
    getAllAdminUsers,
    updateAdminUser,
} from "../controllers/adminController.js";


const router = express.Router();

// router.use(protect);
// router.use(superAdminOnly);

router.get("/", getAllAdminUsers);
router.post("/", createAdminUser);
router.put("/:id", updateAdminUser);
router.delete("/:id", deleteAdminUser);

export default router;
