const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  toggleCloseJob,
  getJobsEmployer,
} = require("../controllers/jobController");

router.post("/", protect, createJob);
router.get("/", getJobs);
router.get("/employer", protect, getJobsEmployer);
router.get("/:id", getJobById);
router.put("/:id", protect, updateJob);
router.delete("/:id", protect, deleteJob);
router.put("/:id/toggle-close", protect, toggleCloseJob);
module.exports = router;
