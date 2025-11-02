const asyncHandler = require("express-async-handler");
const AppError = require("../utils/AppError");
const SavedJob = require("../models/SavedJob");
const Application = require("../models/Application");
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
  const savedJobs = await SavedJob.find({ jobseeker: req.user._id })
    .populate({
      path: "job",
      populate: { path: "company", select: "name companyName companyLogo" },
    })
    .lean();

  const jobIds = savedJobs
    .map((savedJob) => savedJob?.job?._id)
    .filter((jobId) => jobId);

  let applicationsMap = new Map();
  if (jobIds.length > 0) {
    const applications = await Application.find({
      job: { $in: jobIds },
      applicant: req.user._id,
    })
      .select("job status")
      .lean();

    applicationsMap = new Map(
      applications.map((application) => [application.job.toString(), application.status])
    );
  }

  const normalizedSavedJobs = savedJobs.map((savedJob) => {
    if (savedJob && savedJob.job) {
      savedJob.job.isSaved = true;
      const jobId = savedJob.job._id?.toString();
      const status = jobId ? applicationsMap.get(jobId) : null;
      if (status) {
        savedJob.job.isApplied = true;
        savedJob.job.applicationStatus = status;
      } else {
        savedJob.job.isApplied = false;
        savedJob.job.applicationStatus = null;
      }
    }
    return savedJob;
  });

  res.status(200).json({
    success: true,
    message: "Lấy danh sách công việc đã lưu thành công",
    savedJobs: normalizedSavedJobs,
  });
});
