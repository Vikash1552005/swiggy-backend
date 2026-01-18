// services/cartService.js
import Offer from "../models/Offer.js";

export const calculateCartTotal = async (cartItems) => {
    let total = 0;

    for (const item of cartItems) {
        let price = item.price * item.qty;

        const offer = await Offer.findOne({
            category: item.category,
            isActive: true,
            validTill: { $gte: new Date() },
        });

        if (offer) {
            if (offer.discountType === "PERCENT") {
                price -= (price * offer.discount) / 100;
            }

            if (offer.discountType === "FLAT") {
                price -= offer.discount;
            }
        }

        total += Math.max(price, 0);
    }

    return total;
};
