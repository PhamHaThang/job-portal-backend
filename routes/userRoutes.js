const express = require("express");
const router = express.Router();
const { protect, requireRole } = require("../middlewares/authMiddleware");
const {
  updateProfile,
  deleteResume,
  getPublicProfile,
  changePassword,
} = require("../controllers/userController");
router.put("/profile", protect, updateProfile);
router.delete("/resume", protect, requireRole("jobseeker"), deleteResume);
router.put("/change-password", protect, changePassword);
router.get("/:id", getPublicProfile);
module.exports = router;
