import cloudinary from "../config/cloudinary.js";
import Offer from "../models/Offer.js";

// export const createOffer = async (req, res) => {
//     try {
//         if (!req.file) {
//             return res.status(400).json({ message: "Image is required" });
//         }

//         const offer = await Offer.create({
//             title: req.body.title,
//             description: req.body.description,
//             discount: req.body.discount,
//             validTill: req.body.validTill,

//             image: {
//                 public_id: req.file.filename, // 👈 Cloudinary public_id
//                 url: req.file.path,           // 👈 Cloudinary URL
//             },
//         });

//         res.status(201).json(offer);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };
// Admin get all
export const getAllOffers = async (req, res) => {
    const offers = await  Offer.find().sort({ createdAt: -1 });
    res.json({
        success: true,
        count: offers.length,
        offers,
    });
};

export const updateOffer = async (req, res) => {
    try {
        const offer = await Offer.findById(req.params.id);
        if (!offer) {
            return res.status(404).json({ message: "Offer not found" });
        }

        // 🔄 Image update
        if (req.file) {
            if (offer.image?.public_id) {
                await cloudinary.uploader.destroy(offer.image.public_id);
            }

            const upload = await cloudinary.uploader.upload(req.file.path, {
                folder: "offers",
            });

            offer.image = {
                public_id: upload.public_id,
                url: upload.secure_url,
            };
        }

        offer.title = req.body.title ?? offer.title;
        offer.description = req.body.description ?? offer.description;
        offer.category = req.body.category ?? offer.category;
        offer.discount = req.body.discount ?? offer.discount;
        offer.discountType = req.body.discountType ?? offer.discountType;
        offer.validTill = req.body.validTill ?? offer.validTill;
        offer.isActive = req.body.isActive ?? offer.isActive;

        await offer.save();

        res.json({
            success: true,
            offer,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const deleteOffer = async (req, res) => {
    const offer = await Offer.findById(req.params.id);
    if (!offer) {
        return res.status(404).json({ message: "Offer not found" });
    }

    if (offer.image?.public_id) {
        await cloudinary.uploader.destroy(offer.image.public_id);
    }

    await offer.deleteOne();

    res.json({
        success: true,
        message: "Offer deleted successfully",
    });
};


// User get active
export const getActiveOffers = async (req, res) => {
    const offers = await Offer.find({
        isActive: true,
        validTill: { $gte: new Date() },
    });

    res.json({
        success: true,
        offers,
    });
};



export const createOffer = async (req, res) => {
    try {
        const {
            title,
            description,
            category,
            discount,
            discountType,
            validTill,
        } = req.body;

        if (!category || !discount) {
            return res.status(400).json({ message: "Category & discount required" });
        }

        let imageData = null;

        if (req.file) {
            const upload = await cloudinary.uploader.upload(req.file.path, {
                folder: "offers",
            });

            imageData = {
                public_id: upload.public_id,
                url: upload.secure_url,
            };
        }

        const offer = await Offer.create({
            title,
            description,
            category,
            discount,
            discountType,
            validTill,
            image: imageData,
        });

        res.status(201).json({
            success: true,
            offer,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};