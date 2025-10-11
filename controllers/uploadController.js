const asyncHandler = require("express-async-handler");
const AppError = require("../utils/AppError");
const { deleteCloudinaryFile } = require("../utils/cloudinary");
// [POST] /api/upload/image
exports.uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new AppError(
      400,
      "Không có tệp nào được tải lên",
      "NO_FILE_UPLOADED"
    );
  }
  const imageUrl = req.file ? req.file.path : null;
  res
    .status(200)
    .json({ success: true, message: "Tải ảnh lên thành công", imageUrl });
});
// [POST] /api/upload/pdf
exports.uploadFile = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new AppError(
      400,
      "Không có tệp nào được tải lên",
      "NO_FILE_UPLOADED"
    );
  }
  const fileUrl = req.file.path;
  res.status(200).json({
    success: true,
    message: "Tải tệp lên thành công",
    fileUrl,
    publicId: req.file.filename,
    originalName: req.file.originalname,
    format: req.file.format || "pdf",
    size: req.file.size,
  });
});
// [DELETE] /api/upload/delete
exports.deleteFile = asyncHandler(async (req, res) => {
  const fileUrl = req.body?.fileUrl;
  if (!fileUrl) {
    throw new AppError(400, "Vui lòng cung cấp URL tệp để xóa", "NO_FILE_URL");
  }
  const result = await deleteCloudinaryFile(fileUrl);
  if (!result.success) {
    throw new AppError(
      500,
      result.success,
      result.message || "Xóa tệp thất bại",
      "DELETE_FAILED"
    );
  }
  res.status(200).json(result);
});
