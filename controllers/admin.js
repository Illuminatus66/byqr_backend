import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

export const adminLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
      const existinguser = await User.findOne({ email });
      if (!existinguser) {
        return res.status(404).json({ message: "User doesn't exist." });
      }
      const isPasswordCrt = await bcrypt.compare(password, existinguser.password);
      if (!isPasswordCrt) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
  
      const token = jwt.sign(
        {
          email: existinguser.email,
          _id: existinguser._id,
          role: existinguser.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "2h" }
      );
  
      const {wishlist, ...pureUser} = existinguser
  
      res.status(200).json({ result: pureUser, token });
    } catch (error) {
      res.status(500).json("Something went wrong...");
    }
  };