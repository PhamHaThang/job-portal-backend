const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const {
  updateProfile,
  deleteResume,
  getPublicProfile,
} = require("../controllers/userController");
router.put("/profile", protect, updateProfile);
router.delete("/resume", protect, deleteResume);

router.get("/:id", getPublicProfile);
module.exports = router;
