import express from "express";
import {
    deleteUser,
    getAllUsers,
    toggleBlockUser,
    updateUser,
    updateUserRole
} from "../controllers/userController.js";

const router = express.Router();

// router.use(protect);

router.get("/",  getAllUsers);
router.put("/:id/role",  updateUserRole);
router.patch("/:id/block", toggleBlockUser);
router.delete("/:id", deleteUser);
router.put("/:id", updateUser); 
export default router;
