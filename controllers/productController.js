// controllers/productController.js
import fs from "fs";
import mongoose from "mongoose";
import cloudinary from "../config/cloudinary.js";
import Category from "../models/Category.js";
import Product from "../models/Product.js";

/* ================= ADD PRODUCT ================= */
export const addProduct = async (req, res) => {
    try {
        const { title, description, price, stock, brand, category, discount, discountType } = req.body;

        // Basic validation
        if (!title || !price || !category) {
            return res.status(400).json({
                success: false,
                message: "Title, Price & Category are required",
            });
        }

        if (!req.files || req.files.length < 5) {
            return res.status(400).json({
                success: false,
                message: "Minimum 5 images required",
            });
        }

        // Upload images to Cloudinary
        const images = [];
        for (const file of req.files) {
            const result = await cloudinary.uploader.upload(file.path, {
                folder: "swiggy-products",
            });
            images.push({
                public_id: result.public_id,
                url: result.secure_url,
            });
            fs.unlinkSync(file.path);
        }

        // Create product
        const product = await Product.create({
            title,
            description,
            price: Number(price),
            stock: stock ? Number(stock) : 0,
            brand,
            category,
            discount: discount ? Number(discount) : 0,
            discountType: discountType || "percentage",
            images,
            thumbnail: images[0].url,
        });

        res.status(201).json({
            success: true,
            message: "Product added successfully",
            product,
        });
    } catch (error) {
        console.error("ADD PRODUCT ERROR 👉", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/* ================= GET ALL PRODUCTS ================= */
export const getProducts = async (req, res) => {
    try {
        const products = await Product.find({ isDeleted: false }).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: products.length,
            products,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/* ================= GET PRODUCT BY ID (ADMIN) ================= */
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product || product.isDeleted) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        res.status(200).json({ success: true, product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/* ================= GET PRODUCT (USER) ================= */
export const getProduct = async (req, res) => {
    try {
        const { id } = req.params;

        // ✅ Invalid Mongo ID guard
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res
                .status(400)
                .json({ success: false, message: "Invalid product id" });
        }

        const product = await Product.findById(id);

        if (!product || !product.isActive || product.isDeleted) {
            return res
                .status(404)
                .json({ success: false, message: "Product not found" });
        }

        let finalPrice = product.price;
        let offerText = null;

        if (product.discount > 0) {
            if (product.discountType === "percentage") {
                finalPrice = product.price - (product.price * product.discount) / 100;
                offerText = `${product.discount}% OFF`;
            }

            if (product.discountType === "flat") {
                finalPrice = product.price - product.discount;
                offerText = `₹${product.discount} OFF`;
            }
        }

        // ✅ Prevent negative price
        finalPrice = Math.max(finalPrice, 0);

        res.status(200).json({
            success: true,
            product,
            pricing: {
                originalPrice: product.price,
                finalPrice: Number(finalPrice.toFixed(2)),
                offerText,
            },
        });
    } catch (error) {
        console.error("GET PRODUCT ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

/* ================= UPDATE PRODUCT ================= */
export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product || product.isDeleted) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        if (req.body.removedImages) {
            const removed = JSON.parse(req.body.removedImages); // array of public_id
            for (const public_id of removed) {
                await cloudinary.uploader.destroy(public_id);
            }

            // Remove deleted images from product.images
            product.images = product.images.filter((img) => !removed.includes(img.public_id));

            // Update thumbnail if needed
            if (product.images.length > 0) {
                product.thumbnail = product.images[0].url;
            } else {
                product.thumbnail = "";
            }
        }


        // Update fields
        const numericFields = ["price", "stock", "discount"];
        Object.keys(req.body).forEach((key) => {
            if (req.body[key] !== undefined) {
                if (numericFields.includes(key)) {
                    product[key] = Number(req.body[key]);
                } else if (key === "discountType") {
                    const mapping = { percent: "percentage", PERCENT: "percentage", flat: "flat", FLAT: "flat" };
                    product[key] = mapping[req.body[key]] || req.body[key];
                } else {
                    product[key] = req.body[key];
                }
            }
        });

        // ===== IMAGE HANDLING =====
        // Only throw error if NO images exist in DB AND NO new images uploaded
        if ((!req.files || req.files.length === 0) && (!product.images || product.images.length === 0)) {
            return res.status(400).json({ success: false, message: "At least one image is required" });
        }

        // Upload new images if any
        if (req.files && req.files.length > 0) {
            const newImages = [];
            for (const file of req.files) {
                const result = await cloudinary.uploader.upload(file.path, { folder: "swiggy-products" });
                newImages.push({ public_id: result.public_id, url: result.secure_url });
                fs.unlinkSync(file.path);
            }
            // Merge old Cloudinary URLs with new images
            product.images = [...product.images.filter(img => img.url.startsWith("http")), ...newImages];
            product.thumbnail = product.images[0].url;
        }

        // ===== FINAL PRICE =====
        let finalPrice = product.price;
        if (product.discount > 0) {
            if (product.discountType === "percentage") finalPrice -= (product.price * product.discount) / 100;
            else if (product.discountType === "flat") finalPrice -= product.discount;
        }
        product.finalPrice = Math.max(finalPrice, 0);

        await product.save();

        res.status(200).json({ success: true, message: "Product updated successfully", product });
    } catch (error) {
        console.error("UPDATE PRODUCT ERROR 👉", error);
        res.status(500).json({ success: false, message: error.message });
    }
};


/* ================= TOGGLE ACTIVE / INACTIVE ================= */
export const toggleProductStatus = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product || product.isDeleted) return res.status(404).json({ success: false, message: "Product not found" });

        product.isActive = !product.isActive;
        await product.save();

        res.status(200).json({
            success: true,
            message: product.isActive ? "Product activated" : "Product deactivated",
            isActive: product.isActive,
        });
    } catch (error) {
        console.error("TOGGLE ERROR 👉", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/* ================= DELETE PRODUCT (SOFT) ================= */
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ success: false, message: "Product not found" });

        // Remove images from Cloudinary
        for (const img of product.images) {
            await cloudinary.uploader.destroy(img.public_id);
        }

        product.isDeleted = true;
        product.isActive = false;
        await product.save();

        res.status(200).json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
        console.error("DELETE ERROR 👉", error);
        res.status(500).json({ success: false, message: error.message });
    }
};




export const getAllProducts = async (req, res) => {
    try {
        const { category } = req.query;
        console.log("params:", req.params);
        console.log("query:", req.query);


        const filter = {
            isActive: true,
            isDeleted: false,
        };
        if (req.query.category && req.query.category !== "all") {
            filter.category = req.query.category;
        }

        // ✅ Only apply category filter if category exists AND not "all"
        if (category && category !== "all") {
            const cat = await Category.findOne({
                slug: category.toLowerCase(),
            });

            // ❗ Invalid category → return EMPTY list (NOT error)
            if (!cat) {
                return res.status(200).json({
                    success: true,
                    count: 0,
                    products: [],
                });
            }

            filter.category = cat._id;
        }

        const products = await Product.find(filter)
            .populate("category", "name slug")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: products.length,
            products,
        });
    } catch (error) {
        console.error("GET ALL PRODUCTS ERROR 👉", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};




export const getProductsByCategory = async (req, res) => {
    try {
        const { category } = req.params;

        if (!category) {
            return res.status(400).json({ message: "Category is required" });
        }

        const products =
            category === "all"
                ? await Product.find()
                : await Product.find({ category });

        res.status(200).json({ success: true, products });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
