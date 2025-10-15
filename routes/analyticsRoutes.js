const express = require("express");
const router = express.Router();
const { getEmployerAnalytics } = require("../controllers/analyticsController");
const { protect, requireRole } = require("../middlewares/authMiddleware");
router.get("/overview", protect, requireRole("employer"), getEmployerAnalytics);
module.exports = router;
