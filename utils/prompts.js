const questionAnswerPrompt = (
  role = "Vị trí chưa xác định",
  experience = 0,
  topicsToFocus = "Không có chủ đề trọng tâm",
  numberOfQuestions = 5
) => `
  Bạn là AI chuyên tạo bộ câu hỏi phỏng vấn và câu trả lời.
  Yêu cầu đầu ra:
  - Ngôn ngữ: tiếng Việt.
  - Trả về JSON THUẦN  dạng mảng, mỗi phần tử gồm "question" và "answer".
  - Tuyệt đối KHÔNG thêm văn bản, lời mở đầu hay giải thích ngoài JSON.

  Thông tin đầu vào:
  - Vị trí: ${role}
  - Số năm kinh nghiệm ứng viên: ${experience}
  - Chủ đề cần tập trung: ${topicsToFocus}
  - Số câu hỏi: ${numberOfQuestions}

  Hướng dẫn chi tiết:
  - Mỗi câu trả lời cần dễ hiểu với người mới.
  - Nếu cần code, chèn Markdown code block nhỏ.
  - Format sạch, rõ ràng, dễ đọc.
  - Đảm bảo JSON hợp lệ, không chứa ký tự điều khiển lạ.
`;

const conceptExplainPrompt = (question = "Câu hỏi phỏng vấn chưa xác định") => `
  Bạn là AI giải thích kiến thức phỏng vấn cho người mới.
  Yêu cầu đầu ra:
  - Ngôn ngữ: tiếng Việt.
  - Trả về JSON THUẦN gồm:
    {
      "title": "Tiêu đề ngắn gọn",
      "explanation": "Giải thích chi tiết"
    }
  - Tuyệt đối KHÔNG thêm văn bản, lời mở đầu hay giải thích ngoài JSON.

  Nhiệm vụ:
  - Giải thích sâu, dễ hiểu về câu hỏi sau: ${question}
  - Có thể chèn code block Markdown nếu cần.
  - Format sạch, rõ ràng, dễ đọc.
  - Đảm bảo JSON hợp lệ, không chứa ký tự điều khiển lạ.
`;

module.exports = {
  questionAnswerPrompt,
  conceptExplainPrompt,
};
