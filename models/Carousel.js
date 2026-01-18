// models/Carousel.js
import mongoose from "mongoose";

const carouselSchema = new mongoose.Schema({
    title: String,
    image: {
        public_id: String,
        url: String,
    },
    order: {
        type: Number,
        default: 0,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

export default mongoose.model("Carousel", carouselSchema);
