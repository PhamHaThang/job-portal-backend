const express = require("express");
const router = express.Router();
const { protect, requireRole } = require("../middlewares/authMiddleware");
const {
  updateProfile,
  deleteResume,
  getPublicProfile,
} = require("../controllers/userController");
router.put("/profile", protect, updateProfile);
router.delete("/resume", protect, requireRole("jobseeker"), deleteResume);

router.get("/:id", getPublicProfile);
module.exports = router;
