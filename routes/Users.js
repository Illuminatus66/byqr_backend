import express from "express";
import { login, signup, updateUser } from "../controllers/user.js";
import { adminLogin } from "../controllers/admin.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/admin/login", adminLogin);
router.patch("/update/:_id", auth, updateUser);

export default router;
