import express from "express";
import { fetchWishlist, addToWishlist, removeFromWishlist } from "../controllers/wishlist.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/fetch/:_id", auth, fetchWishlist);
router.post("/add", auth, addToWishlist);
router.post("/remove", auth, removeFromWishlist);

export default router;
