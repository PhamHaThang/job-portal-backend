const asyncHandler = require("express-async-handler");
const AppError = require("../utils/AppError");
const Job = require("../models/Job");
const Application = require("../models/Application");
const { getTrend, getTimeRanges } = require("../utils/analytics");
// [GET] /api/analytics/overview
exports.getEmployerAnalytics = asyncHandler(async (req, res) => {
  if (!req.user || req.user.role !== "employer") {
    throw new AppError(
      403,
      "Chỉ nhà tuyển dụng mới có thể truy cập",
      "FORBIDDEN"
    );
  }
  const employerId = req.user._id;
  const {
    now,
    lastPeriodStart: last7Days,
    prevPeriodStart: prev7Days,
  } = getTimeRanges(7);

  // Lấy tổng số việc làm đang hoạt động và các công việc
  const [totalActiveJobs, jobs] = await Promise.all([
    Job.countDocuments({ company: employerId, isClosed: false }),
    Job.find({ company: employerId }).select("_id").lean(),
  ]);

  const jobIds = jobs.map((j) => j._id);
  const [
    totalApplications,
    totalHired,
    activeJobsLast7Days,
    activeJobsPrev7Days,
    applicationsLast7Days,
    applicationsPrev7Days,
    hiresLast7Days,
    hiresPrev7Days,
    recentJobs,
    recentApplications,
  ] = await Promise.all([
    // Tổng ứng tuyển
    Application.countDocuments({ job: { $in: jobIds } }),

    // Tổng số người được tuyển
    Application.countDocuments({ job: { $in: jobIds }, status: "Accepted" }),

    // Việc làm mới 7 ngày gần nhất
    Job.countDocuments({
      company: employerId,
      isClosed: false,
      createdAt: { $gte: last7Days, $lte: now },
    }),

    // Việc làm 7 ngày trước đó
    Job.countDocuments({
      company: employerId,
      isClosed: false,
      createdAt: { $gte: prev7Days, $lt: last7Days },
    }),

    // Ứng tuyển 7 ngày gần nhất
    Application.countDocuments({
      job: { $in: jobIds },
      createdAt: { $gte: last7Days, $lte: now },
    }),

    // Ứng tuyển 7 ngày trước đó
    Application.countDocuments({
      job: { $in: jobIds },
      createdAt: { $gte: prev7Days, $lt: last7Days },
    }),

    // Người được tuyển 7 ngày gần nhất
    Application.countDocuments({
      job: { $in: jobIds },
      status: "Accepted",
      createdAt: { $gte: last7Days, $lte: now },
    }),

    // Người được tuyển 7 ngày trước đó
    Application.countDocuments({
      job: { $in: jobIds },
      status: "Accepted",
      createdAt: { $gte: prev7Days, $lt: last7Days },
    }),

    // 5 công việc gần nhất
    Job.find({ company: employerId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title location type isClosed createdAt")
      .lean(),

    // 5 ứng tuyển gần nhất
    Application.find({ job: { $in: jobIds } })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("applicant", "name email avatar")
      .populate("job", "title")
      .lean(),
  ]);

  // Tính xu hướng thay đổi (%)
  const trends = {
    activeJobs: getTrend(activeJobsLast7Days, activeJobsPrev7Days),
    totalApplicants: getTrend(applicationsLast7Days, applicationsPrev7Days),
    totalHires: getTrend(hiresLast7Days, hiresPrev7Days),
  };

  res.status(200).json({
    success: true,
    message: "Lấy dữ liệu phân tích thành công",
    counts: {
      totalActiveJobs,
      totalApplications,
      totalHired,
      trend: trends,
      data: {
        recentJobs,
        recentApplications,
      },
    },
  });
});
