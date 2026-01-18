// models/Offer.js
import mongoose from "mongoose";

const offerSchema = new mongoose.Schema(
    {
        title: String,
        description: String,

        category: {
            type: String,
            required: true,
            index: true,
        },

        discountType: {
            type: String,
            enum: ["PERCENT", "FLAT"],
            default: "PERCENT",
        },

        discount: {
            type: Number,
            required: true,
        },

        image: {
            public_id: String,
            url: String,
        },

        validTill: Date,

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Offer", offerSchema);
