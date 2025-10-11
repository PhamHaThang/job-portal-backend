const express = require("express");
const router = express.Router();
const {
  applyToJob,
  getMyApplications,
  getApplicationsForJob,
  getApplicationById,
  updateStatus,
} = require("../controllers/applicationController");
const { protect } = require("../middlewares/authMiddleware");
router.post("/:jobId", protect, applyToJob);
router.get("/my", protect, getMyApplications);
router.get("/job/:jobId", protect, getApplicationsForJob);
router.get("/:applicationId", protect, getApplicationById);
router.put("/:applicationId/status", protect, updateStatus);

module.exports = router;
