const { GoogleGenAI } = require("@google/genai");
const {
  conceptExplainPrompt,
  questionAnswerPrompt,
} = require("../utils/prompts");
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const asyncHandler = require("express-async-handler");
const AppError = require("../utils/AppError");
const { jsonrepair } = require("jsonrepair");
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
  let data;
  try {
    const repaired = jsonrepair(cleanedText);
    data = JSON.parse(repaired);
  } catch {
    throw new AppError(500, "Phản hồi AI không hợp lệ, vui lòng thử lại sau");
  }
  res.status(201).json({
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
  let data;
  console.log(cleanedText);
  try {
    const repaired = jsonrepair(cleanedText);
    data = JSON.parse(repaired);
  } catch {
    throw new AppError(500, "Phản hồi AI không hợp lệ, vui lòng thử lại sau");
  }
  res.status(201).json({
    success: true,
    message: "Tạo câu trả lời thành công",
    explanation: data,
  });
});
