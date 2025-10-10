const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (token && token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id);
      next();
    } else {
      return res.status(401).json({
        success: false,
        message: "Truy cập bị từ chối, không có token",
        error: "UNAUTHORIZED",
      });
    }
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token không hợp lệ",
      error: error.message,
    });
  }
};
