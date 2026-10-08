import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No token provided",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Invalid token format",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Normalize so both _id and id are always available
    req.user = {
      ...decoded,
      _id: decoded._id || decoded.id,
      id: decoded.id || decoded._id,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export default authMiddleware;
