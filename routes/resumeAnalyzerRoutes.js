const express = require("express");
const { analyzeResume } = require("../controllers/resumeAnalyzerController");
const { protect } = require("../middlewares/authMiddleware");
const { singlePdfMemoryUpload } = require("../middlewares/uploadMiddleware");

const router = express.Router();

router.post(
  "/",
  protect,
  singlePdfMemoryUpload("resume"),
  analyzeResume
);

module.exports = router;
