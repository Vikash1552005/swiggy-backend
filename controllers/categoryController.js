import Product from "../models/Product.js";

export const getCategories = async (req, res) => {
    try {
        const categories = await Product.distinct("category", {
            isActive: true,
            isDeleted: false,
        });

        res.status(200).json({
            success: true,
            categories,
        });
    } catch (error) {
        console.error("CATEGORY ERROR:", error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
