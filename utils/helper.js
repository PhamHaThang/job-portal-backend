const { jsonrepair } = require("jsonrepair");
const parseJSONResponse = (responseText) => {
  try {
    const repaired = jsonrepair(responseText);
    let parsed = JSON.parse(repaired);
    if (!parsed?.title && !parsed?.explanation && !Array.isArray(parsed)) {
      throw new Error("Phản hồi AI không hợp lệ.");
    }
    const unescapeMarkdown = (str) => {
      if (typeof str !== "string") return str;
      return str.replace(/\\n/g, "\n");
    };
    if (Array.isArray(parsed)) {
      parsed = parsed.map((item) => ({
        ...item,
        answer: unescapeMarkdown(item.answer),
      }));
    } else if (parsed.explanation) {
      parsed.explanation = unescapeMarkdown(parsed.explanation);
    }
    return parsed;
  } catch (error) {
    throw new Error(`Không thể đọc phản hồi từ AI. Chi tiết: ${error.message}`);
  }
};

module.exports = {
  parseJSONResponse,
};
