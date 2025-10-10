const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../configs/cloudinary");
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "Job_Portal_Image",
    allowed_formats: ["jpg", "jpeg", "png"],
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg"];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      const error = new Error(
        "Chỉ cho phép tải lên các tệp hình ảnh (jpg, jpeg, png)"
      );
      error.code = "INVALID_FILE_TYPE";
      cb(error, false);
    }
  },
});
const singleUpload = (fieldName) => (req, res, next) => {
  const uploadSingle = upload.single(fieldName);
  uploadSingle(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message,
        error: "INVALID_FILE_UPLOAD",
      });
    }
    next();
  });
};

const multipleUpload = (fieldName, maxCount) => (req, res, next) => {
  const uploadMany = upload.array(fieldName, maxCount);
  uploadMany(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message,
        error: "INVALID_FILE_UPLOAD",
      });
    }
    next();
  });
};
module.exports = {
  singleUpload,
  multipleUpload,
};
