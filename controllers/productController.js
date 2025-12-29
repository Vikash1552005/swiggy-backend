import Product from "../models/Product.js";

export const importProducts = async (req, res) => {
    try {
        const response = await fetch("https://dummyjson.com/products");
        const data = await response.json();

        // optional: clear old data
        await Product.deleteMany();

        const savedProducts = await Product.insertMany(data.products);

        res.json({
            message: "Products imported successfully",
            count: savedProducts.length,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 🔹 GET all products (NEW)
export const getProducts = async (req, res) => {
    try {
        const products = await Product.find();

        res.json({
            success: true,
            products,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};