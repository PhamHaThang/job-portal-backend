const express = require("express");
const {
  addQuestionsToSession,
  togglePinQuestion,
  updateNoteToQuestion,
} = require("../controllers/questionController");
const router = express.Router();

router.post("/add", addQuestionsToSession);
router.put("/:id/pin", togglePinQuestion);
router.put("/:id/note", updateNoteToQuestion);
module.exports = router;
