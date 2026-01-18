import bcrypt from "bcryptjs";
import User from "../models/User.js";

const ADMIN_ROLES = [
    "admin",
    "super_admin",
    "product_manager_admin",
    "order_manager_admin",
    "customer_care_admin",
    "seller_admin",
    "accounts_admin",
];

// ✅ GET ALL ADMINS
export const getAllAdminUsers = async (req, res) => {
    const admins = await User.find({
        role: { $in: ADMIN_ROLES },
    })
        .select("-password")
        .sort({ blocked: 1, createdAt: -1 });

    res.json({ users: admins });
};

// ✅ CREATE ADMIN
export const createAdminUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
        return res.status(400).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await User.create({
        name,
        email,
        password: hashedPassword,
        role,
    });

    res.status(201).json(admin);
};

// ✅ UPDATE ADMIN
export const updateAdminUser = async (req, res) => {
    const { name, role } = req.body;

    const admin = await User.findByIdAndUpdate(
        req.params.id,
        { name, role },
        { new: true }
    ).select("-password");

    res.json(admin);
};

// ✅ DELETE ADMIN
export const deleteAdminUser = async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Admin deleted successfully" });
};
