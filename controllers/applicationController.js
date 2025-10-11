const AppError = require("../utils/AppError");
const asyncHandler = require("express-async-handler");
const Application = require("../models/Application");
const Job = require("../models/Job");
const User = require("../models/User");

// [POST] /api/applications/:jobId
exports.applyToJob = asyncHandler(async (req, res) => {
  if (!req.user || req.user.role !== "jobseeker") {
    throw new AppError(
      403,
      "Chỉ người tìm việc mới có thể nộp đơn",
      "FORBIDDEN"
    );
  }
  const existingApplication = await Application.findOne({
    job: req.params.jobId,
    applicant: req.user._id,
  });
  if (existingApplication) {
    throw new AppError(
      400,
      "Bạn đã nộp đơn cho công việc này rồi",
      "ALREADY_APPLIED"
    );
  }
  const job = await Job.findById(req.params.jobId);
  if (!job) {
    throw new AppError(404, "Công việc không tồn tại", "JOB_NOT_FOUND");
  }
  const newApplication = new Application({
    job: job._id,
    applicant: req.user._id,
    resume: req.user.resume,
  });
  await newApplication.save();
  res.status(201).json({
    success: true,
    message: "Nộp đơn thành công",
    application: newApplication,
  });
});
// [GET] /api/applications/my
exports.getMyApplications = asyncHandler(async (req, res) => {
  if (!req.user || req.user.role !== "jobseeker") {
    throw new AppError(
      403,
      "Chỉ người tìm việc mới có thể xem đơn của họ",
      "FORBIDDEN"
    );
  }
  const applications = await Application.find({ applicant: req.user._id })
    .populate("job", "title company location type")
    .sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    message: "Lấy danh sách đơn ứng tuyển thành công",
    count: applications.length,
    applications,
  });
});

// [GET] /api/applications/job/:jobId
exports.getApplicationsForJob = asyncHandler(async (req, res) => {
  if (!req.user || req.user.role !== "employer") {
    throw new AppError(
      403,
      "Chỉ nhà tuyển dụng mới có thể xem đơn ứng tuyển",
      "FORBIDDEN"
    );
  }
  const job = await Job.findById(req.params.jobId);
  if (!job) {
    throw new AppError(404, "Công việc không tồn tại", "JOB_NOT_FOUND");
  }
  if (job.company.toString() !== req.user._id.toString()) {
    throw new AppError(
      403,
      "Bạn không có quyền xem các đơn ứng tuyển cho công việc này",
      "FORBIDDEN"
    );
  }
  const applications = await Application.find({ job: job._id })
    .populate("job", "title location category type")
    .populate("applicant", "name email avatar resume");
  res.status(200).json({
    success: true,
    message: "Lấy danh sách đơn ứng tuyển thành công",
    count: applications.length,
    applications,
  });
});
// [GET] /api/applications/:applicationId
exports.getApplicationById = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.applicationId)
    .populate("job", "title company")
    .populate("applicant", "name email avatar resume");
  if (!application) {
    throw new AppError(
      404,
      "Đơn ứng tuyển không tồn tại",
      "APPLICATION_NOT_FOUND"
    );
  }
  const isApplicant =
    application.applicant._id.toString() === req.user._id.toString();
  const isEmployer =
    application.job.company &&
    application.job.company._id.toString() === req.user._id.toString();
  if (!isApplicant && !isEmployer) {
    throw new AppError(
      403,
      "Không có quyền xem đơn ứng tuyển này",
      "FORBIDDEN"
    );
  }
  res.status(200).json({
    success: true,
    message: "Lấy đơn ứng tuyển thành công",
    application,
  });
});
// [PUT] /api/applications/:applicationId/status
exports.updateStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const application = await Application.findById(
    req.params.applicationId
  ).populate("job");
  if (!application) {
    throw new AppError(
      404,
      "Đơn ứng tuyển không tồn tại",
      "APPLICATION_NOT_FOUND"
    );
  }
  if (!req.user || req.user.role !== "employer") {
    throw new AppError(
      403,
      "Chỉ nhà tuyển dụng mới có thể cập nhật trạng thái đơn ứng tuyển",
      "FORBIDDEN"
    );
  }
  if (application.job.company.toString() !== req.user._id.toString()) {
    throw new AppError(
      403,
      "Không có quyền cập nhật trạng thái đơn ứng tuyển cho công việc này",
      "FORBIDDEN"
    );
  }
  application.status = status;
  await application.save();
  res.status(200).json({
    success: true,
    message: "Cập nhật trạng thái đơn ứng tuyển thành công",
    application,
  });
});
