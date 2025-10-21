const express = require("express");
const {
  generateInterviewQuestions,
  generateConceptExplanation,
} = require("../controllers/aiController");
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();
router.get("/generate-questions", protect, generateInterviewQuestions);
router.get("/generate-explanation", protect, generateConceptExplanation);
module.exports = router;
