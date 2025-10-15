const express = require("express");
const router = express.Router();
const {
  applyToJob,
  getMyApplications,
  getApplicationsForJob,
  getApplicationById,
  updateStatus,
} = require("../controllers/applicationController");
const { protect, requireRole } = require("../middlewares/authMiddleware");

router.post("/:jobId", protect, requireRole("jobseeker"), applyToJob);
router.get("/my", protect, requireRole("jobseeker"), getMyApplications);
router.get(
  "/job/:jobId",
  protect,
  requireRole("employer"),
  getApplicationsForJob
);
router.get(
  "/:applicationId",
  protect,
  requireRole("jobseeker", "employer"),
  getApplicationById
);
router.put(
  "/:applicationId/status",
  protect,
  requireRole("employer"),
  updateStatus
);

module.exports = router;
