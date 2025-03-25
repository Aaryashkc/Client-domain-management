import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ message: "Not authenticated, token required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || !decoded.userId) {
      return res.status(401).json({ message: "Not authenticated, token invalid" });
    }

    req.userId = decoded.userId;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Not authenticated, token invalid" });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Not authenticated, token expired" });
    }
    console.error("Error in protectRoute middleware:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
