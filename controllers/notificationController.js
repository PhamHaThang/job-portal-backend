const AppError = require("../utils/AppError");
const asyncHandler = require("express-async-handler");
const Notification = require("../models/Notification");

// [GET] /api/notifications/my
exports.getMyNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .limit(50);

  const unreadCount = await Notification.countDocuments({
    user: req.user._id,
    isRead: false,
  });

  res.status(200).json({
    success: true,
    message: "Lấy danh sách thông báo thành công",
    notifications,
    unreadCount,
  });
});

// [PUT] /api/notifications/:notificationId/read
exports.markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.notificationId);

  if (!notification) {
    throw new AppError(
      404,
      "Thông báo không tồn tại",
      "NOTIFICATION_NOT_FOUND"
    );
  }

  if (notification.user.toString() !== req.user._id.toString()) {
    throw new AppError(
      403,
      "Không có quyền truy cập thông báo này",
      "FORBIDDEN"
    );
  }

  notification.isRead = true;
  await notification.save();

  res.status(200).json({
    success: true,
    message: "Đã đánh dấu thông báo là đã đọc",
    notification,
  });
});

// [PUT] /api/notifications/read-all
exports.markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { user: req.user._id, isRead: false },
    { isRead: true }
  );

  res.status(200).json({
    success: true,
    message: "Đã đánh dấu tất cả thông báo là đã đọc",
  });
});

// [DELETE] /api/notifications/:notificationId
exports.deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.notificationId);

  if (!notification) {
    throw new AppError(
      404,
      "Thông báo không tồn tại",
      "NOTIFICATION_NOT_FOUND"
    );
  }

  if (notification.user.toString() !== req.user._id.toString()) {
    throw new AppError(403, "Không có quyền xóa thông báo này", "FORBIDDEN");
  }

  await notification.deleteOne();

  res.status(200).json({
    success: true,
    message: "Xóa thông báo thành công",
  });
});

// [GET] /api/notifications/unread-count
exports.getUnreadCount = asyncHandler(async (req, res) => {
  const unreadCount = await Notification.countDocuments({
    user: req.user._id,
    isRead: false,
  });

  res.status(200).json({
    success: true,
    unreadCount,
  });
});
