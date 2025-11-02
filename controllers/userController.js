const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const AppError = require("../utils/AppError");
const { deleteCloudinaryFile } = require("../utils/cloudinary");
// [PUT] /api/user/profile
exports.updateProfile = asyncHandler(async (req, res) => {
  const { name, avatar, resume, companyName, companyLogo, companyDescription } =
    req.body;
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new AppError(404, "Người dùng không tồn tại", "USER_NOT_FOUND");
  }
  user.name = name || user.name;
  user.avatar = avatar || user.avatar;
  user.resume = resume || user.resume;

  if (user.role === "employer") {
    user.companyName = companyName || user.companyName;
    user.companyLogo = companyLogo || user.companyLogo;
    user.companyDescription = companyDescription || user.companyDescription;
  }
  await user.save();
  res.status(200).json({
    success: true,
    message: "Cập nhật hồ sơ thành công",
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      resume: user.resume || "",
      companyName: user.companyName,
      companyLogo: user.companyLogo,
      companyDescription: user.companyDescription,
    },
  });
});
// [DELETE] /api/user/resume
exports.deleteResume = asyncHandler(async (req, res) => {
  const resumeUrl = req.body?.resumeUrl;
  if (!resumeUrl) {
    throw new AppError(
      400,
      "Vui lòng cung cấp URL hồ sơ để xóa",
      "NO_RESUME_URL"
    );
  }
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new AppError(404, "Người dùng không tồn tại", "USER_NOT_FOUND");
  }

  const result = await deleteCloudinaryFile(resumeUrl);
  if (!result.success) {
    throw new AppError(
      500,
      result.success,
      result.message || "Xóa hồ sơ thất bại",
      "DELETE_FAILED"
    );
  }
  user.resume = "";
  await user.save();
  res
    .status(200)
    .json({ success: true, message: "Xóa hồ sơ thành công", user });
});
// [GET] /api/user/:id
exports.getPublicProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new AppError(404, "Người dùng không tồn tại", "USER_NOT_FOUND");
  }
  res.status(200).json({
    success: true,
    message: "Lấy thông tin người dùng thành công",
    user,
  });
});
// [PUT] /api/user/change-password
exports.changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select("+password");
  if (!user) {
    throw new AppError(404, "Người dùng không tồn tại", "USER_NOT_FOUND");
  }
  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) {
    throw new AppError(400, "Mật khẩu hiện tại không đúng", "INVALID_PASSWORD");
  }
  if (newPassword.length < 8) {
    throw new AppError(
      400,
      "Mật khẩu mới phải có ít nhất 8 ký tự",
      "WEAK_PASSWORD"
    );
  }
  user.password = newPassword;
  await user.save();
  res.status(200).json({ success: true, message: "Đổi mật khẩu thành công" });
});
