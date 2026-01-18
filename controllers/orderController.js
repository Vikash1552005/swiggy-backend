import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

export const placeOrder = async (req, res) => {
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart || cart.items.length === 0) {
        return res.status(400).json({ message: "Cart empty" });
    }

    // ATOMIC STOCK UPDATE
    for (let item of cart.items) {
        const updated = await Product.findOneAndUpdate(
            { _id: item.product._id, stock: { $gte: item.quantity } },
            { $inc: { stock: -item.quantity } }
        );

        if (!updated) {
            return res.status(400).json({
                message: `${item.product.title} out of stock`
            });
        }
    }

    const order = await Order.create({
        user: userId,
        items: cart.items,
        paymentStatus: "PAID",
        orderStatus: "CONFIRMED"
    });

    await Cart.deleteOne({ user: userId });

    res.status(201).json({ success: true, order });
};


export const cancelOrder = async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.orderStatus !== "CONFIRMED") {
        return res.status(400).json({ message: "Cannot cancel" });
    }

    for (let item of order.items) {
        await Product.findByIdAndUpdate(
            item.product,
            { $inc: { stock: item.quantity } }
        );
    }

    order.orderStatus = "CANCELLED";
    await order.save();

    res.json({ success: true });
};


export const returnOrder = async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order.orderStatus !== "DELIVERED") {
        return res.status(400).json({ message: "Return not allowed" });
    }

    for (let item of order.items) {
        await Product.findByIdAndUpdate(
            item.product,
            { $inc: { stock: item.quantity } }
        );
    }

    order.orderStatus = "RETURNED";
    await order.save();

    res.json({ success: true });
};
