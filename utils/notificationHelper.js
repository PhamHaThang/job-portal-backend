const Notification = require("../models/Notification");

exports.createNotification = async (
  userId,
  title,
  message,
  type = "system",
  link = ""
) => {
  const notification = new Notification({
    user: userId,
    title,
    message,
    type,
    link,
  });
  await notification.save();
  return notification;
};

exports.createApplicationStatusNotification = async (
  userId,
  status,
  jobTitle,
  jobId = ""
) => {
  let title = "";
  let message = "";

  switch (status) {
    case "Accepted":
      title = "Đơn ứng tuyển được chấp nhận";
      message = `Đơn ứng tuyển của bạn cho vị trí "${jobTitle}" đã được chấp nhận!`;
      break;
    case "Rejected":
      title = "Thông báo về đơn ứng tuyển";
      message = `Đơn ứng tuyển của bạn cho vị trí "${jobTitle}" đã bị từ chối.`;
      break;
    case "In Review":
      title = "Đơn ứng tuyển đang được xem xét";
      message = `Đơn ứng tuyển của bạn cho vị trí "${jobTitle}" đang được nhà tuyển dụng xem xét.`;
      break;
    default:
      title = "Cập nhật đơn ứng tuyển";
      message = `Đơn ứng tuyển của bạn cho vị trí "${jobTitle}" đã được cập nhật.`;
  }

  const link = jobId ? `/jobs/${jobId}` : "";
  return await this.createNotification(
    userId,
    title,
    message,
    "application",
    link
  );
};

exports.createNewApplicationNotification = async (
  employerId,
  applicantName,
  jobTitle,
  jobId = ""
) => {
  const title = "Ứng viên mới";
  const message = `${applicantName} đã nộp đơn ứng tuyển cho vị trí "${jobTitle}"`;

  const link = jobId ? `/applicants?jobId=${jobId}` : "";

  return await this.createNotification(
    employerId,
    title,
    message,
    "application",
    link
  );
};
