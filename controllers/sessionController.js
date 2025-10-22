const asyncHandler = require("express-async-handler");
const Session = require("../models/Session");
const Question = require("../models/Question");
const AppError = require("../utils/AppError");

// [POST] /api/sessions
exports.createSession = asyncHandler(async (req, res) => {
  const { role, experience, topicsToFocus, description, questions } = req.body;
  const userId = req.user._id;
  const session = await Session.create({
    user: userId,
    role,
    experience,
    topicsToFocus,
    description,
  });
  const questionDocs = await Promise.all(
    questions.map(async (q) => {
      const question = await Question.create({
        session: session._id,
        question: q.question,
        answer: q.answer,
      });
      return question._id;
    })
  );
  session.questions = questionDocs;
  await session.save();
  res
    .status(201)
    .json({ success: true, message: "Tạo phiên thành công", session });
});

// [GET] /api/sessions/:id
exports.getSessionById = asyncHandler(async (req, res) => {
  const sessionId = req.params.id;
  const session = await Session.findById(sessionId)
    .populate({
      path: "questions",
      options: { sort: { isPinned: -1, createdAt: 1 } },
    })
    .exec();
  if (!session) {
    throw new AppError(404, "Phiên không tồn tại");
  }
  res.status(200).json({
    success: true,
    message: "Lấy phiên thành công.",
    session,
  });
});

// [GET] /api/sessions
exports.getMySessions = asyncHandler(async (req, res) => {
  const sessions = await Session.find({ user: req.user.id })
    .sort({ createdAt: -1 })
    .populate("questions");
  res.status(200).json({
    success: true,
    message: "Lấy danh sách phiên thành công.",
    sessions,
  });
});
// [DELETE] /api/sessions/:id
exports.deleteSession = asyncHandler(async (req, res) => {
  const sessionId = req.params.id;
  const session = await Session.findById(sessionId);
  if (!session) {
    throw new AppError(404, "Phiên không tồn tại");
  }
  if (session.user.toString() !== req.user.id) {
    throw new AppError(403, "Bạn không có quyền xóa phiên này");
  }
  await Question.deleteMany({ session: sessionId });
  await session.deleteOne();
  res.status(200).json({
    success: true,
    message: "Xóa phiên thành công.",
  });
});
