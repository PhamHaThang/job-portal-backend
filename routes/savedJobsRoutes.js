const express = require("express");
const router = express.Router();
const {
  saveJob,
  unsaveJob,
  getMySavedJobs,
} = require("../controllers/savedJobsController");
const { protect } = require("../middlewares/authMiddleware");
router.post("/:jobId", protect, saveJob);
router.delete("/:jobId", protect, unsaveJob);
router.get("/my", protect, getMySavedJobs);
module.exports = router;
