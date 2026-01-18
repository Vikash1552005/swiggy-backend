import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },

    password: {
        type: String,
        required: true,
        select: false,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,

    role: {
        type: String,
        enum: ["user", "admin", "super_admin", "product_manager_admin", "order_manager_admin", "customer_care_admin", "seller_admin", "accounts_admin"],
        default: "user",
    },
    blocked: { type: Boolean, default: false },
    isDeleted: {
        type: Boolean,
        default: false,
    },


}, { timestamps: true });



export default mongoose.model("User", userSchema);
