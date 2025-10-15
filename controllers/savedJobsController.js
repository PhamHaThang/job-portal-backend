const asyncHandler = require("express-async-handler");
const AppError = require("../utils/AppError");
const SavedJob = require("../models/SavedJob");
// [POST] /api/saved-jobs/:jobId
exports.saveJob = asyncHandler(async (req, res) => {
  if (!req.params.jobId) {
    throw new AppError(400, "Vui lòng cung cấp jobId", "NO_JOB_ID");
  }

  const existingSavedJob = await SavedJob.findOne({
    jobseeker: req.user._id,
    job: req.params.jobId,
  });
  if (existingSavedJob) {
    throw new AppError(
      400,
      "Công việc đã được lưu trước đó",
      "JOB_ALREADY_SAVED"
    );
  }
  const newSavedJob = await SavedJob.create({
    jobseeker: req.user._id,
    job: req.params.jobId,
  });
  res.status(201).json({
    success: true,
    message: "Lưu công việc thành công",
    savedJob: newSavedJob,
  });
});
// [DELETE] /api/saved-jobs/:jobId
exports.unsaveJob = asyncHandler(async (req, res) => {
  if (!req.params.jobId) {
    throw new AppError(400, "Vui lòng cung cấp jobId", "NO_JOB_ID");
  }
  const savedJob = await SavedJob.findOne({
    jobseeker: req.user._id,
    job: req.params.jobId,
  });
  if (!savedJob) {
    throw new AppError(404, "Công việc chưa được lưu", "JOB_NOT_SAVED");
  }
  await savedJob.deleteOne();
  res.status(200).json({
    success: true,
    message: "Bỏ lưu công việc thành công",
  });
});
// [GET] /api/saved-jobs/my
exports.getMySavedJobs = asyncHandler(async (req, res) => {
  const savedJobs = await SavedJob.find({ jobseeker: req.user._id }).populate({
    path: "job",
    populate: { path: "company", select: "name companyName companyLogo" },
  });
  res.status(200).json({
    success: true,
    message: "Lấy danh sách công việc đã lưu thành công",
    savedJobs,
  });
});
