import express from "express";
import { login, signup, updateUser } from "../controllers/user.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.patch("/update", auth, updateUser);

export default router;