const express = require("express");
const router = express.Router();
const uploadController = require("../controllers/uploadController");
const { singleUpload } = require("../middlewares/uploadImageMiddleware");

router.post("/single", singleUpload("image"), uploadController.uploadImage);
module.exports = router;
