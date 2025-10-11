const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const AppError = require("../utils/AppError");
const { generateToken } = require("../utils/jwt");

// [POST] /api/auth/register
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, avatar, role } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new AppError(400, "Email đã tồn tại", "INVALID_EMAIL");
  }
  const user = await User.create({ name, email, password, role, avatar });
  res.status(201).json({
    success: true,
    message: "Đăng ký thành công",
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar || "",
      companyName: user.companyName || "",
      companyLogo: user.companyLogo || "",
      companyDescription: user.companyDescription || "",
      resume: user.resume || "",
    },
    token: generateToken(user._id),
  });
});

// [POST] /api/auth/login
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new AppError(400, "Email không tồn tại", "EMAIL_NOT_FOUND");
  }
  if (!(await user.matchPassword(password))) {
    throw new AppError(400, "Mật khẩu không đúng", "INVALID_PASSWORD");
  }
  res.status(200).json({
    success: true,
    message: "Đăng nhập thành công",
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar || "",
      companyName: user.companyName || "",
      companyLogo: user.companyLogo || "",
      companyDescription: user.companyDescription || "",
      resume: user.resume || "",
    },
    token: generateToken(user._id),
  });
});
// [GET] /api/auth/me
exports.getMe = async (req, res) => {
  res.json({
    success: true,
    message: "Lấy thông tin user thành công",
    user: req.user,
  });
};
