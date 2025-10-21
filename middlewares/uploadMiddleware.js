const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../configs/cloudinary");
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isImage = file.mimetype.startsWith("image/");
    const isPDF = file.mimetype === "application/pdf";

    let folder, resourceType, allowedFormats;
    if (isImage) {
      folder = "Job_Portal_Images";
      resourceType = "image";
      allowedFormats = ["jpg", "jpeg", "png"];
    } else if (isPDF) {
      folder = "Job_Portal_PDFs";
      resourceType = "raw";
    } else {
      folder = "Job_Portal_Files";
      resourceType = "auto";
    }

    console.log(
      `Uploading file: ${file.originalname}, mimetype: ${file.mimetype}, Determined resourceType: ${resourceType}`
    );

    const config = {
      folder,
      resource_type: resourceType,
      public_id: `${Date.now()}_${file.originalname.replace(/\.[^/.]+$/, "")}`,
      format: isPDF ? "pdf" : undefined,
    };

    if (isImage) {
      config.allowed_formats = allowedFormats;
      config.transformation = [
        {
          width: 800,
          height: 800,
          crop: "limit",
          quality: "auto:good",
          fetch_format: "auto",
        },
      ];
    }

    return config;
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024, files: 5 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "application/pdf",
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      const error = new Error(
        "Chỉ cho phép tải lên tệp ảnh (jpg, jpeg, png) hoặc PDF"
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
      console.log("Lỗi Upload:", err);
      let errorMessage = err.message;

      if (err.code === "LIMIT_FILE_SIZE") {
        errorMessage = "Kích thước tệp vượt quá 10MB";
      } else if (err.code === "INVALID_FILE_TYPE") {
        errorMessage = err.message;
      } else if (err instanceof multer.MulterError) {
        errorMessage = "Lỗi khi tải lên tệp";
      }
      return res.status(400).json({
        success: false,
        message: errorMessage,
        error: err.code || "UPLOAD_ERROR",
      });
    }
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Không có tệp nào được tải lên",
        error: "NO_FILE_UPLOADED",
      });
    }
    next();
  });
};

const multipleUpload =
  (fieldName, maxCount = 5) =>
  (req, res, next) => {
    const uploadMany = upload.array(fieldName, maxCount);
    uploadMany(req, res, (err) => {
      if (err) {
        console.log("Lỗi Multiple Upload:", err);
        let errorMessage = err.message;
        if (err.code === "LIMIT_FILE_SIZE") {
          errorMessage = "Một hoặc nhiều tệp vượt quá 10MB";
        } else if (err.code === "LIMIT_FILE_COUNT") {
          errorMessage = `Chỉ cho phép tải lên tối đa ${maxCount} tệp`;
        } else if (err.code === "INVALID_FILE_TYPE") {
          errorMessage = err.message;
        } else if (err instanceof multer.MulterError) {
          errorMessage = "Lỗi khi tải lên các tệp";
        }
        return res.status(400).json({
          success: false,
          message: errorMessage,
          error: err.code || "UPLOAD_ERROR",
        });
      }
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Không có tệp nào được tải lên",
          error: "NO_FILES_UPLOADED",
        });
      }
      next();
    });
  };
module.exports = {
  singleUpload,
  multipleUpload,
};
