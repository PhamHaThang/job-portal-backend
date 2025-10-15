const express = require("express");
const router = express.Router();
const {
  saveJob,
  unsaveJob,
  getMySavedJobs,
} = require("../controllers/savedJobsController");
const { protect, requireRole } = require("../middlewares/authMiddleware");
router.post("/:jobId", protect, requireRole("jobseeker"), saveJob);
router.delete("/:jobId", protect, requireRole("jobseeker"), unsaveJob);
router.get("/my", protect, requireRole("jobseeker"), getMySavedJobs);
module.exports = router;
