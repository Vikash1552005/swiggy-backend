import cors from "cors";
import express from "express";

import adminRoutes from "./routes/adminRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import carouselRoutes from "./routes/carouselRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import offerRoutes from "./routes/offerRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


app.use(express.json());
// app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes); //login and signup
app.use("/api/admin", adminRoutes); //add update delete 
app.use("/api/user", userRoutes); //add update delete 
app.use("/api/carousel", carouselRoutes); //add update delete 
app.use("/api/offer", offerRoutes); //add update delete 
app.use("/api/cart", cartRoutes); //add update delete 
app.use("/api/categories", categoryRoutes);
app.use("/api/order", orderRoutes);

// app.use("/api/admin", adminRoutes);

export default app;
