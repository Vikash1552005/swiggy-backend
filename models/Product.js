// models/Product.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: String,

    price: { type: Number, required: true },

    discount: {
      type: Number,
      default: 0,
    },

    discountType: {
      type: String,
      enum: ["percentage", "flat"],
      default: "percentage",
    },

    finalPrice: {
      type: Number,
    },

    rating: Number,
    stock: Number,
    brand: String,
    category: { type: String, required: true ,ref: "Category",},

    images: [
      {
        public_id: String,
        url: String,
      },
    ],

    thumbnail: String,
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
