import User from "../models/User.js";

const ALLOWED_ROLES = [
    "user",
    "admin",
    "super_admin",
    "product_manager_admin",
    "order_manager_admin",
    "customer_care_admin",
    "seller_admin",
    "accounts_admin",
];

// GET USERS
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({
            // role: { $ne: "super_admin" },
            role: "user",
            isDeleted: false,
        })
            .select("-password")
            .sort({ blocked: 1, createdAt: -1 });

        res.json({ success: true, users });
    } catch {
        res.status(500).json({ message: "Failed to fetch users" });
    }
};

// DELETE (SOFT)
export const deleteUser = async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isDeleted = true;
    await user.save();
    res.json({ message: "User deleted" });
};

// BLOCK / UNBLOCK
export const toggleBlockUser = async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role === "super_admin") {
        return res.status(403).json({ message: "Cannot block super admin" });
    }

    user.blocked = !user.blocked;
    await user.save();
    res.json({ message: "Status updated", blocked: user.blocked });
};

// UPDATE ROLE
export const updateUserRole = async (req, res) => {
    const { role } = req.body;
    if (!ALLOWED_ROLES.includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.role = role;
    await user.save();

    res.json({ message: "Role updated", role: user.role });
};
// UPDATE USER (NAME & EMAIL)
export const updateUser = async (req, res) => {
    try {
        const { name, email } = req.body;

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Optional: super admin safety
        if (user.role === "super_admin") {
            return res.status(403).json({ message: "Cannot edit super admin" });
        }

        user.name = name || user.name;
        user.email = email || user.email;

        await user.save();

        res.json({
            message: "User updated successfully",
            user,
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to update user" });
    }
};
