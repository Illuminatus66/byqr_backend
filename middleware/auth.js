import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    let decodeData = jwt.verify(token, process.env.JWT_SECRET);
    req._id = decodeData?._id;

    next();
  } catch (error) {
    console.log(error);
  }
};

export default auth;
