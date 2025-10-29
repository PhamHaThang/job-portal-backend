const { jsonrepair } = require("jsonrepair");

const ANALYZE_RESUME_PROMPT = `Đầu tiên, hãy xác định xem tài liệu này có thực sự là một sơ yếu lý lịch (resume) hay không. Tìm kiếm:
- Kinh nghiệm chuyên môn, lịch sử làm việc, hoặc thông tin tuyển dụng
- Nền tảng học vấn, bằng cấp, hoặc thông tin học thuật
- Kỹ năng, bằng cấp chuyên môn, hoặc năng lực chuyên môn
- Thông tin liên hệ và chi tiết cá nhân

Nếu đây KHÔNG phải là sơ yếu lý lịch (ví dụ: hóa đơn, biên nhận, hợp đồng, bài báo, sách hướng dẫn, v.v.), hãy phản hồi bằng:
{
  "error": "Tài liệu này không giống một sơ yếu lý lịch. Vui lòng tải lên một sơ yếu lý lịch phù hợp có chứa các phần kinh nghiệm chuyên môn, học vấn và kỹ năng."
}

Nếu đây LÀ một sơ yếu lý lịch, hãy phân tích kỹ lưỡng và cung cấp phản hồi toàn diện ở định dạng JSON này:
{
  "overallScore": "X/10",
  "strengths": [
    "điểm mạnh 1",
    "điểm mạnh 2",
    "điểm mạnh 3"
  ],
  "improvements": [
    "điểm cần cải thiện 1",
    "điểm cần cải thiện 2",
    "điểm cần cải thiện 3"
  ],
  "keywords": [
    "từ khóa 1",
    "từ khóa 2",
    "từ khóa 3"
  ],
  "summary": "Đánh giá tổng quan ngắn gọn",
  "performanceMetrics": {
    "formatting": X,
    "contentQuality": X,
    "keywordUsage": X,
    "atsCompatibility": X,
    "quantifiableAchievements": X
  },
  "actionItems": [
    "mục hành động cụ thể 1",
    "mục hành động cụ thể 2",
    "mục hành động cụ thể 3"
  ],
  "proTips": [
    "mẹo chuyên nghiệp 1",
    "mẹo chuyên nghiệp 2",
    "mẹo chuyên nghiệp 3"
  ],
  "atsChecklist": [
    "yêu cầu ats 1",
    "yêu cầu ats 2",
    "yêu cầu ats 3"
  ]
}

Đối với performanceMetrics, hãy xếp hạng mỗi lĩnh vực từ 1-10 dựa trên:

- formatting: Bố cục, cấu trúc, sự hấp dẫn về mặt hình ảnh, tính nhất quán, khả năng đọc. Tìm kiếm các phần rõ ràng, khoảng cách phù hợp, phông chữ nhất quán, vẻ ngoài chuyên nghiệp
- contentQuality: Mức độ liên quan, thành tích, tác động, sự rõ ràng, tính đầy đủ. Đánh giá xem nội dung có liên quan đến vai trò mục tiêu hay không, thành tích có được mô tả tốt hay không và thông tin có đầy đủ hay không
- keywordUsage: Thuật ngữ ngành, tối ưu hóa ATS, từ khóa kỹ năng, mức độ liên quan đến công việc. Kiểm tra thuật ngữ dành riêng cho ngành, kỹ năng kỹ thuật, tên phần mềm, phương pháp luận và các từ khóa liên quan
- atsCompatibility: Định dạng thân thiện với ATS, cấu trúc dễ quét, tiêu đề phù hợp. Đánh giá xem sơ yếu lý lịch có sử dụng các tiêu đề phần tiêu chuẩn (Kinh nghiệm, Học vấn, Kỹ năng) hay không, có tránh đồ họa/hình ảnh hay không, có định dạng rõ ràng hay không và có dễ dàng được phân tích cú pháp bởi các hệ thống ATS hay không
- quantifiableAchievements: Sử dụng các con số, tỷ lệ phần trăm, số liệu trong các thành tích. Tìm kiếm các con số cụ thể, tỷ lệ phần trăm, số tiền, khung thời gian, quy mô nhóm, phạm vi dự án và các kết quả có thể đo lường được

Đối với atsCompatibility, hãy đặc biệt nghiêm ngặt và tìm kiếm:
- Tiêu đề phần tiêu chuẩn (Kinh nghiệm, Học vấn, Kỹ năng, Tóm tắt, v.v.)
- Định dạng rõ ràng, đơn giản, không có đồ họa, hình ảnh hoặc bố cục phức tạp
- Sử dụng đúng các từ khóa liên quan đến ngành/vai trò
- Thành tích được lượng hóa bằng các con số và số liệu cụ thể
- Động từ hành động ở đầu mỗi gạch đầu dòng
- Định dạng nhất quán trong toàn bộ tài liệu
- Thông tin liên hệ hiển thị rõ ràng
- Không có bảng, biểu đồ hoặc định dạng phức tạp có thể gây nhầm lẫn cho hệ thống ATS

Đối với atsChecklist, hãy cung cấp các yêu cầu và cải tiến cụ thể để đảm bảo sơ yếu lý lịch vượt qua các hệ thống ATS thành công.

Đối với actionItems, hãy cung cấp các bước cụ thể, có thể hành động mà người dùng có thể thực hiện ngay lập tức để cải thiện sơ yếu lý lịch của họ.

Đối với proTips, hãy đưa ra lời khuyên chuyên nghiệp có thể giúp họ trong việc tìm kiếm việc làm và tối ưu hóa sơ yếu lý lịch.

Nội dung tài liệu:
{{DOCUMENT_TEXT}}`;

const buildResumeAnalysisPrompt = (documentText = "") =>
  ANALYZE_RESUME_PROMPT.replace("{{DOCUMENT_TEXT}}", documentText || "");

const parseResumeAnalysisResponse = (responseText) => {
  try {
    const repaired = jsonrepair(responseText);
    const parsed = JSON.parse(repaired);

    if (parsed && typeof parsed === "object") {
      if (parsed.error) {
        return parsed;
      }

      const haveScore = typeof parsed.overallScore === "string";
      const haveMetrics =
        parsed.performanceMetrics && typeof parsed.performanceMetrics === "object";

      if (haveScore || haveMetrics) {
        return parsed;
      }
    }

    throw new Error("Phản hồi AI không chứa dữ liệu phân tích hợp lệ.");
  } catch (error) {
    throw new Error(`Không thể đọc phản hồi từ AI. Chi tiết: ${error.message}`);
  }
};

module.exports = {
  buildResumeAnalysisPrompt,
  parseResumeAnalysisResponse,
};
