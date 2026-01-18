import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

export const addToCart = async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.user._id;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (product.stock < quantity) {
        return res.status(400).json({ message: "Insufficient stock" });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
        cart = await Cart.create({
            user: userId,
            items: [{ product: productId, quantity }]
        });
    } else {
        const item = cart.items.find(
            i => i.product.toString() === productId
        );

        if (item) item.quantity += quantity;
        else cart.items.push({ product: productId, quantity });

        await cart.save();
    }

    res.json({ success: true, cart });
};

export const getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id })
            .populate("items.product");

        if (!cart) {
            cart = { items: [] };
        }

        res.json(cart);
    } catch (error) {
        console.error("GET CART ERROR:", error);
        res.status(500).json({ message: "Cart fetch failed" });
    }
};


/* ================= UPDATE CART ================= */
/*
  body:
  {
    productId,
    quantity   // number OR "inc" | "dec"
  }
*/
export const updateCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user._id;

        if (!productId || quantity === undefined) {
            return res.status(400).json({ message: "productId & quantity required" });
        }

        const cart = await Cart.findOne({ user: userId }).populate("items.product");
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const item = cart.items.find(
            (i) => i.product._id.toString() === productId
        );

        if (!item) {
            return res.status(404).json({ message: "Item not in cart" });
        }

        // 🔁 Quantity logic
        let newQty = item.quantity;

        if (quantity === "inc") newQty += 1;
        else if (quantity === "dec") newQty -= 1;
        else newQty = Number(quantity);

        if (newQty <= 0) {
            cart.items = cart.items.filter(
                (i) => i.product._id.toString() !== productId
            );
        } else {
            // 🛑 Stock check
            if (item.product.stock < newQty) {
                return res.status(400).json({ message: "Insufficient stock" });
            }
            item.quantity = newQty;
        }

        await cart.save();

        res.json({
            success: true,
            cart,
        });
    } catch (error) {
        console.error("UPDATE CART ERROR:", error);
        res.status(500).json({ message: "Cart update failed" });
    }
};

/* ================= REMOVE FROM CART ================= */
export const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user._id;

        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const initialLength = cart.items.length;

        cart.items = cart.items.filter(
            (item) => item.product.toString() !== productId
        );

        if (cart.items.length === initialLength) {
            return res.status(404).json({ message: "Item not found in cart" });
        }

        await cart.save();

        const updatedCart = await Cart.findOne({ user: userId }).populate(
            "items.product"
        );

        res.json({
            success: true,
            cart: updatedCart,
        });
    } catch (error) {
        console.error("REMOVE CART ERROR:", error);
        res.status(500).json({ message: "Remove from cart failed" });
    }
};
