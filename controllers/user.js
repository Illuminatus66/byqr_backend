import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Cart from "../models/Cart.js";

// Login/Signup controllers take care of creating a user and/or authenticating an already existing
// user. It uses jwt to sign a token with the user's _id and email which can be used to verify the
// session. The validity of the token can be increased if shopping time is found to last longer
// than an hour for people. Encrypted passwords are stored and decrypted when the user logs in.

export const signup = async (req, res) => {
  const { name, email, password, phno } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const newuser = await User.create({
      name,
      email,
      password: hashedPassword,
      phno,
      wishlist: [],
      role: 'user',
    });

    await Cart.create({
      cart_no: newuser._id,
      products: [],
    });

    const token = jwt.sign(
      { email: newuser.email, _id: newuser._id, role: newuser.role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    const {role, wishlist, ...pureUser} = newuser

    res.status(200).json({ result: pureUser, token });
  } catch (error) {
    if (error.code === 11000) {
      if (error.keyPattern.email) {
        res.status(409).json({ message: "Email already exists." });
      } else if (error.keyPattern.phno) {
        res.status(409).json({ message: "Phone number already exists." });
      }
    } else {
      res.status(500).json("Something went wrong...");
    }
  }
};

export const login = async (req, res) => {
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

    const {role, wishlist, ...pureUser} = existinguser

    res.status(200).json({ result: pureUser, token });
  } catch (error) {
    res.status(500).json("Something went wrong...");
  }
};

export const updateUser = async (req, res) => {
  const { _id } = req.params;
  const { name, email, phno } = req.body;

  try {
    const existingUser = await User.findById(_id);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found." });
    }

    if (email && email !== existingUser.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(409).json({ message: "Email already exists." });
      }
    }

    if (phno && phno !== existingUser.phno) {
      const phnoExists = await User.findOne({ phno });
      if (phnoExists) {
        return res
          .status(409)
          .json({ message: "Phone number already exists." });
      }
    }

    existingUser.name = name || existingUser.name;
    existingUser.email = email || existingUser.email;
    existingUser.phno = phno || existingUser.phno;

    const updatedUser = await existingUser.save();

    let token;
    if (email && email !== existingUser.email) {
      token = jwt.sign(
        {
          email: updatedUser.email,
          _id: updatedUser._id,
          role: updatedUser.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "2h" }
      );
    }
    const { role, wishlist, ...pureUser } = updatedUser;
    res.status(200).json({
      result: pureUser,
      token: token || null,
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong..." });
  }
};
