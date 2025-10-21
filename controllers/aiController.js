const { GoogleGenAI } = require("@google/genai");
const {
  conceptExplainPrompt,
  questionAnswerPrompt,
} = require("../utils/prompts");
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const asyncHandler = require("express-async-handler");
const AppError = require("../utils/AppError");
exports.generateInterviewQuestions = asyncHandler(async (req, res) => {
  const { role, experience, topicsToFocus, numberOfQuestions } = req.body;
  if (!role || !experience || !topicsToFocus || !numberOfQuestions) {
    throw new AppError(400, "Vui lòng cung cấp đầy đủ thông tin yêu cầu");
  }
  const prompt = questionAnswerPrompt(
    role,
    experience,
    topicsToFocus,
    numberOfQuestions
  );
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });
  let rawText = response.text;
  const cleanedText = rawText
    .replace(/^```json\s*/, "")
    .replace(/```$/, "")
    .trim();
  const data = JSON.parse(cleanedText);
  res.status(200).json({
    success: true,
    message: "Tạo câu hỏi phỏng vấn thành công",
    questions: data,
  });
});
exports.generateConceptExplanation = asyncHandler(async (req, res) => {
  const { question } = req.body;
  if (!question) {
    throw new AppError(400, "Vui lòng cung cấp đầy đủ thông tin yêu cầu");
  }
  const prompt = conceptExplainPrompt(question);
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });
  let rawText = response.text;
  const cleanedText = rawText
    .replace(/^```json\s*/, "")
    .replace(/```$/, "")
    .trim();
  const data = JSON.parse(cleanedText);
  res.status(200).json({
    success: true,
    message: "Tạo câu hỏi phỏng vấn thành công",
    explanation: data,
  });
});
