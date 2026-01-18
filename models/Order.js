import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    items: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: Number
    }],
    paymentStatus: {
        type: String,
        enum: ["PENDING", "PAID"],
        default: "PENDING"
    },
    orderStatus: {
        type: String,
        enum: ["CONFIRMED", "CANCELLED", "DELIVERED", "RETURNED"]
    }
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
