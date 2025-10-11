const express = require("express");
const router = express.Router();
const uploadController = require("../controllers/uploadController");
const { singleUpload } = require("../middlewares/uploadMiddleware");

router.post("/image", singleUpload("image"), uploadController.uploadImage);
router.post("/pdf", singleUpload("file"), uploadController.uploadFile);
router.delete("/delete", uploadController.deleteFile);
module.exports = router;
