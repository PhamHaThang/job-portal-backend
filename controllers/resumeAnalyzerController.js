const asyncHandler = require("express-async-handler");
const pdfParse = require("pdf-parse");
const AppError = require("../utils/AppError");
const { init } = require("@heyputer/puter.js/src/init.cjs");
const {
  parseResumeAnalysisResponse,
  buildResumeAnalysisPrompt,
} = require("../utils/resumeAnalyzer");

const puter = init(process.env.PUTER_AUTH_TOKEN);

exports.analyzeResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new AppError(
      400,
      "Không có tệp CV nào được tải lên",
      "NO_FILE_UPLOADED"
    );
  }

  if (req.file.mimetype !== "application/pdf") {
    throw new AppError(
      400,
      "Chỉ hỗ trợ phân tích CV định dạng PDF",
      "INVALID_FILE_TYPE"
    );
  }

  if (!req.file.buffer || !req.file.buffer.length) {
    throw new AppError(400, "Không thể đọc dữ liệu từ tệp CV", "EMPTY_FILE");
  }

  const { text } = await pdfParse(req.file.buffer);
  if (!text || !text.trim()) {
    throw new AppError(
      400,
      "Không thể trích xuất nội dung từ CV",
      "PARSE_ERROR"
    );
  }

  const prompt = buildResumeAnalysisPrompt(text);

  let response;
  try {
    response = await puter.ai.chat(
      [
        {
          role: "system",
          content:
            "Bạn là trợ lý giúp phân tích sơ yếu lý lịch và trả về JSON hợp lệ.",
        },
        { role: "user", content: prompt },
      ],
      { model: "gpt-5-nano" }
    );
  } catch (error) {
    console.error("Puter AI Error:", error.message);
    throw new AppError(
      503,
      "Dịch vụ AI tạm thời không khả dụng. Vui lòng thử lại sau.",
      "AI_SERVICE_UNAVAILABLE"
    );
  }

  const raw =
    typeof response === "string" ? response : response?.message?.content || "";

  let parsed;
  try {
    parsed = parseResumeAnalysisResponse(raw);
  } catch (error) {
    throw new AppError(500, error.message, "AI_PARSE_ERROR");
  }

  if (parsed?.error) {
    return res.status(400).json({
      success: false,
      message: parsed.error,
      error: "INVALID_RESUME",
    });
  }

  res.status(200).json({
    success: true,
    message: "Phân tích CV thành công",
    analysis: parsed,
    extractedText: text,
  });
});
