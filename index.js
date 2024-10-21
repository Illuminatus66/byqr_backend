import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cartRoutes from "./routes/Cart.js";
import productsRoutes from "./routes/Products.js";
import userRoutes from "./routes/Users.js";
import wishlistRoutes from "./routes/Wishlist.js";
import connectDB from "./connectMongoDb.js";

dotenv.config();

const allowedOrigins = [
  'https://byqradmin.netlify.app',
];
const corsOptions = {
  origin: allowedOrigins,
  credentials: true, 
};

app.use(cors(corsOptions));

connectDB();

const app = express();

app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));

app.use("/user", userRoutes);
app.use("/wishlist", wishlistRoutes);
app.use("/cart", cartRoutes);
app.use("/products", productsRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});