const asyncHandler = require("express-async-handler");
const Question = require("../models/Question");
const Session = require("../models/Session");
const AppError = require("../utils/AppError");

// [POST] /api/questions/add
exports.addQuestionsToSession = asyncHandler(async (req, res) => {
  const { sessionId, questions } = req.body;
  if (!sessionId || !Array.isArray(questions) || questions.length === 0) {
    throw new AppError(400, "Dữ liệu không hợp lệ");
  }
  const session = await Session.findById(sessionId);
  if (!session) {
    throw new AppError(404, "Phiên không tồn tại");
  }
  const createdQuestions = await Question.insertMany(
    questions.map((q) => ({
      question: q.question,
      session: sessionId,
      answer: q.answer,
    }))
  );
  session.questions.push(...createdQuestions.map((q) => q._id));
  await session.save();
  res.status(201).json({
    success: true,
    message: "Thêm câu hỏi thành công",
    questions: createdQuestions,
  });
});

// [PUT] /api/questions/:id/pin
exports.togglePinQuestion = asyncHandler(async (req, res) => {
  const question = await Question.findById(req.params.id);
  if (!question) {
    throw new AppError(404, "Câu hỏi không tồn tại");
  }
  question.isPinned = !question.isPinned;
  await question.save();
  res.status(200).json({
    success: true,
    message: question.isPinned
      ? "Ghim câu hỏi thành công"
      : "Bỏ ghim câu hỏi thành công",
    question,
  });
});

// [PUT] /api/questions/:id/note
exports.updateNoteToQuestion = asyncHandler(async (req, res) => {
  const { note } = req.body;
  const question = await Question.findById(req.params.id);
  if (!question) {
    throw new AppError(404, "Câu hỏi không tồn tại");
  }
  question.note = note || "";
  await question.save();
  res.status(200).json({
    success: true,
    message: "Cập nhật ghi chú thành công",
    question,
  });
});
