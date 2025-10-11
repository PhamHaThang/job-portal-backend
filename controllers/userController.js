const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const AppError = require("../utils/AppError");
const { deleteCloudinaryFile } = require("../utils/cloudinary");
// [PUT] /api/user/profile
exports.updateProfile = asyncHandler(async (req, res) => {
  console.log(req.body);
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
      id: user._id,
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
  if (user.role !== "jobseeker") {
    throw new AppError(
      400,
      "Chỉ người tìm việc mới có thể xóa hồ sơ",
      "INVALID_ROLE"
    );
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
