import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
    console.log("HEADERS:", req.headers);

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    if (!authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;
        next();
    } catch (err) {
        console.error("JWT ERROR:", err.message);
        return res.status(401).json({ message: "Unauthorized" });
    }
};

export const superAdminOnly = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    if (!req.user || req.user.role !== "super_admin") {
        return res.status(401).json({ message: "Unauthorized" });
    }
    
    if (req.user.role !== "super_admin") {
        return res.status(403).json({ message: "Super Admin only" });
    }

    next();
};


