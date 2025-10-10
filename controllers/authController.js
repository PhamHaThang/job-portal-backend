const User = require("../models/User");
const jwt = require("jsonwebtoken");
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
// [POST] /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password, avatar, role } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ success: false, message: "Email đã tồn tại" });
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
        token: generateToken(user._id),
        companyName: user.companyName || "",
        companyLogo: user.companyLogo || "",
        companyDescription: user.companyDescription || "",
        resume: user.resume || "",
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ sucess: false, message: "Lỗi server", error: error.message });
  }
};
// [POST] /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Email không tồn tại" });
    }
    if (!(await user.matchPassword(password))) {
      return res
        .status(400)
        .json({ success: false, message: "Mật khẩu không đúng" });
    }
    res.status(200).json({
      success: true,
      message: "Đăng nhập thành công",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
        avatar: user.avatar || "",
        companyName: user.companyName || "",
        companyLogo: user.companyLogo || "",
        companyDescription: user.companyDescription || "",
        resume: user.resume || "",
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Lỗi server", error: error.message });
  }
};
// [GET] /api/auth/me
exports.getMe = async (req, res) => {
  res.json({
    success: true,
    message: "Lấy thông tin user thành công",
    user: req.user,
  });
};
// [POST] /api/auth/uploadImage
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Không có tệp nào được tải lên" });
    }
    const imageUrl = req.file ? req.file.path : null;
    res
      .status(200)
      .json({ success: false, message: "Tải ảnh lên thành công", imageUrl });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Lỗi server", error: error.message });
  }
};
