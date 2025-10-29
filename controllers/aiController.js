const asyncHandler = require("express-async-handler");
const AppError = require("../utils/AppError");
const {
  questionAnswerPrompt,
  conceptExplainPrompt,
} = require("../utils/prompts");
const { parseJSONResponse } = require("../utils/helper");
const { init } = require("@heyputer/puter.js/src/init.cjs");
const puter = init(process.env.PUTER_AUTH_TOKEN);

exports.generateQuestionAnswerSession = asyncHandler(async (req, res) => {
  const { role, experience, topicsToFocus, numberOfQuestions } = req.body;
  if (!role || !experience || !topicsToFocus || !numberOfQuestions) {
    throw new AppError("Thiếu thông tin bắt buộc để tạo buổi hỏi đáp.", 400);
  }
  const prompt = questionAnswerPrompt(
    role,
    experience,
    topicsToFocus,
    numberOfQuestions
  );

  try {
    const response = await puter.ai.chat(
      [
        {
          role: "system",
          content: "Bạn là AI chuyên tạo câu hỏi phỏng vấn.",
        },
        { role: "user", content: prompt },
      ],
      { model: "gpt-5-nano" }
    );
    const raw =
      typeof response === "string"
        ? response
        : response?.message?.content || "";
    const parsed = parseJSONResponse(raw);
    res.status(201).json({
      success: true,
      message: "Tạo buổi hỏi đáp thành công.",
      questions: parsed,
    });
  } catch (error) {
    console.error("Puter AI Error:", error.message);
    throw new AppError(
      503,
      "Dịch vụ AI tạm thời không khả dụng. Vui lòng thử lại sau.",
      "AI_SERVICE_UNAVAILABLE"
    );
  }
});

exports.generateConceptExplainSession = asyncHandler(async (req, res) => {
  const { question } = req.body;
  if (!question) {
    throw new AppError(400, "Vui lòng cung cấp đầy đủ thông tin yêu cầu");
  }
  const prompt = conceptExplainPrompt(question);

  try {
    const response = await puter.ai.chat(
      [
        {
          role: "system",
          content: "Bạn là trợ lý giải thích kiến thức phỏng vấn.",
        },
        { role: "user", content: prompt },
      ],
      { model: "gpt-5-nano" }
    );
    const raw =
      typeof response === "string"
        ? response
        : response?.message?.content || "";
    const parsed = parseJSONResponse(raw);
    res.status(201).json({
      success: true,
      message: "Tạo câu trả lời thành công",
      explanation: parsed,
    });
  } catch (error) {
    console.error("Puter AI Error:", error.message);
    throw new AppError(
      503,
      "Dịch vụ AI tạm thời không khả dụng. Vui lòng thử lại sau.",
      "AI_SERVICE_UNAVAILABLE"
    );
  }
});
