import jwt from "jsonwebtoken";
const authAdmin = (req, res, next) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Check if the role is admin
      if (decoded.role !== 'admin') {
        return res.status(403).json({ message: "Access denied. You're not an admin! IMPOSTOR!!" });
      }
      
      req._id = decoded._id;
      next();
    } catch (error) {
      res.status(401).json({ message: "Unauthorized" });
    }
  };

  export default authAdmin;