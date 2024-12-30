import jwt from "jsonwebtoken";
import user from "../models/UserSchema.js";

const authenticate = async (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(" ")[1]; // Extract token
      console.log(req.headers)
      if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized User: No token provided" });
      }
  
      const verifytoken = jwt.verify(token, process.env.KEYSECRET); // Verify token
      console.log("Decoded Token:", verifytoken);
  
      const rootUser = await user.findOne({ _id: verifytoken._id, "tokens.token": token }); // Check user
      if (!rootUser) {
        return res.status(404).json({ success: false, message: "User Not Found" });
      }
  
      req.token = token; // Attach to request
      req.rootUser = rootUser;
      req.userId = rootUser._id;
      next();
    } catch (error) {
      console.log("Authentication Error:", error.message); // Log detailed error
      return res.status(400).json({ success: false, message: "Unauthorized User" });
    }
  };

  
export default authenticate;