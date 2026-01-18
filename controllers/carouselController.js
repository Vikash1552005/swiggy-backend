import fs from "fs";
import cloudinary from "../config/cloudinary.js";
import Carousel from "../models/Carousel.js";
// Create Carousel with Image
export const createCarousel = async (req, res) => {
    try {
        const { title, order, isActive } = req.body;
 console.log("BODY:", req.body);
    console.log("FILE:", req.file);
        if (!req.file) {
            return res.status(400).json({ message: "Carousel image required" });
        }

        // upload to cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "swiggy-carousel",
        });

        // remove local file
        fs.unlinkSync(req.file.path);

        const carousel = await Carousel.create({
            title,
            order,
            isActive,
            image: {
                public_id: result.public_id,
                url: result.secure_url,
            },
        });

        res.status(201).json({
            success: true,
            message: "Carousel created",
            carousel,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Admin – All
export const getAllCarousels = async (req, res) => {
    const data = await Carousel.find().sort({ order: 1 });
    res.json(data);
};

// User – Only Active
export const getActiveCarousels = async (req, res) => {
    const data = await Carousel.find({ isActive: true }).sort({ order: 1 });
    res.json(data);
};

export const updateCarousel = async (req, res) => {
    try {
        const carousel = await Carousel.findById(req.params.id);
        if (!carousel) {
            return res.status(404).json({ message: "Carousel not found" });
        }

        // If new image uploaded
        if (req.file) {
            // delete old image
            if (carousel.image?.public_id) {
                await cloudinary.uploader.destroy(carousel.image.public_id);
            }

            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "swiggy-carousel",
            });

            fs.unlinkSync(req.file.path);

            carousel.image = {
                public_id: result.public_id,
                url: result.secure_url,
            };
        }

        carousel.title = req.body.title ?? carousel.title;
        carousel.order = req.body.order ?? carousel.order;
        carousel.isActive = req.body.isActive ?? carousel.isActive;

        await carousel.save();

        res.json({
            success: true,
            message: "Carousel updated",
            carousel,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
 

// Delete
export const deleteCarousel = async (req, res) => {
    const carousel = await Carousel.findById(req.params.id);

    if (carousel?.image?.public_id) {
        await cloudinary.uploader.destroy(carousel.image.public_id);
    }

    await Carousel.findByIdAndDelete(req.params.id);
    res.json({ message: "Carousel deleted" });
};

