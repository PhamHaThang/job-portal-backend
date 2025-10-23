const express = require("express");
const router = express.Router();
const {
  generateQuestionAnswerSession,
  generateConceptExplainSession,
} = require("../controllers/aiController");
router.post("/question-answer", generateQuestionAnswerSession);
router.post("/concept-explain", generateConceptExplainSession);
module.exports = router;
