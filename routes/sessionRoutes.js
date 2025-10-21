const express = require("express");
const {
  createSession,
  getSessionById,
  getMySessions,
  deleteSession,
} = require("../controllers/sessionController");
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/", protect, createSession);
router.get("/", protect, getMySessions);
router.get("/:id", protect, getSessionById);
router.delete("/:id", protect, deleteSession);

module.exports = router;
