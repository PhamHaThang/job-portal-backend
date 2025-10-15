const express = require("express");
const router = express.Router();
const { protect, requireRole } = require("../middlewares/authMiddleware");
const {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  toggleCloseJob,
  getJobsEmployer,
} = require("../controllers/jobController");

router.post("/", protect, requireRole("employer"), createJob);
router.get("/", getJobs);
router.get("/employer", protect, requireRole("employer"), getJobsEmployer);
router.get("/:id", getJobById);
router.put("/:id", protect, requireRole("employer"), updateJob);
router.delete("/:id", protect, requireRole("employer"), deleteJob);
router.put(
  "/:id/toggle-close",
  protect,
  requireRole("employer"),
  toggleCloseJob
);
module.exports = router;
