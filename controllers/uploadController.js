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
