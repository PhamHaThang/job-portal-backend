const asyncHandler = require("express-async-handler");
const AppError = require("../utils/AppError");
const Job = require("../models/Job");
const User = require("../models/User");
const Application = require("../models/Application");
const SavedJob = require("../models/SavedJob");
// [GET] /api/jobs
exports.getJobs = asyncHandler(async (req, res) => {
  const { keyword, location, category, type, minSalary, maxSalary, userId } =
    req.query;
  const query = {
    isClosed: false,
    ...(keyword && { title: { $regex: keyword, $options: "i" } }),
    ...(location && { location: { $regex: location, $options: "i" } }),
    ...(category && { category }),
    ...(type && { type }),
  };
  if (minSalary || maxSalary) {
    query.$and = [];
    if (minSalary) {
      query.$and.push({ salaryMax: { $gte: Number(minSalary) } });
    }
    if (maxSalary) {
      query.$and.push({ salaryMin: { $lte: Number(maxSalary) } });
    }
    if (query.$and.length === 0) delete query.$and;
  }
  const jobs = await Job.find(query).populate(
    "company",
    "name companyName companyLogo"
  );
  let savedJobIds = [];
  let appliedJobStatusMap = {};
  if (userId) {
    const savedJobs = await SavedJob.find({ jobseeker: userId }).select("job");
    savedJobIds = savedJobs.map((sj) => sj.job.toString());
    const applications = await Application.find({ applicant: userId }).select(
      "job status"
    );
    applications.forEach((app) => {
      appliedJobStatusMap[app.job.toString()] = app.status;
    });
  }
  const jobsWithExtras = jobs.map((job) => {
    jobIdStr = job._id.toString();
    return {
      ...job.toObject(),
      isSaved: savedJobIds.includes(jobIdStr),
      applicationStatus: appliedJobStatusMap[jobIdStr] || null,
    };
  });
  res.json({
    success: true,
    message: "Lấy danh sách việc làm thành công",
    count: jobsWithExtras.length,
    jobs: jobsWithExtras,
  });
});
// [GET] /api/jobs/employer
exports.getJobsEmployer = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const role = req.user.role;
  if (role !== "employer") {
    throw new AppError(
      403,
      "Không có quyền truy cập tài nguyên này",
      "FORBIDDEN"
    );
  }
  const jobs = await Job.find({ company: userId })
    .populate("company", "name companyName companyLogo")
    .lean();
  const jobsWithApplicationCounts = await Promise.all(
    jobs.map(async (job) => {
      const applicationCount = await Application.countDocuments({
        job: job._id,
      });
      return { ...job, applicationCount };
    })
  );
  res.json({
    success: true,
    message: "Lấy danh sách việc làm của nhà tuyển dụng thành công",
    count: jobsWithApplicationCounts.length,
    jobs: jobsWithApplicationCounts,
  });
});
// [GET] /api/jobs/:id
exports.getJobById = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id).populate(
    "company",
    "name companyName companyLogo "
  );
  if (!job) {
    throw new AppError(404, "Không tìm thấy việc làm", "JOB_NOT_FOUND");
  }
  let applicationStatus = null;
  if (req.query.userId) {
    const application = await Application.findOne({
      job: job._id,
      applicant: req.query.userId,
    }).select("status");
    if (application) {
      applicationStatus = application.status;
    }
  }
  res.json({
    success: true,
    message: "Lấy chi tiết việc làm thành công",
    job: { ...job.toObject(), applicationStatus },
  });
});

// Employer only

// [POST] /api/jobs
exports.createJob = asyncHandler(async (req, res) => {
  const job = await Job.create({ ...req.body, company: req.user._id });
  res
    .status(201)
    .json({ success: true, message: "Tạo việc làm thành công", job });
});
// [PUT] /api/jobs/:id
exports.updateJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) {
    throw new AppError(404, "Không tìm thấy việc làm", "JOB_NOT_FOUND");
  }
  if (job.company.toString() !== req.user._id.toString()) {
    throw new AppError(
      403,
      "Không có quyền cập nhật việc làm này",
      "FORBIDDEN"
    );
  }

  Object.assign(job, req.body);
  await job.save();
  res.json({ success: true, message: "Cập nhật việc làm thành công", job });
});
// [DELETE] /api/jobs/:id
exports.deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) {
    throw new AppError(404, "Không tìm thấy việc làm", "JOB_NOT_FOUND");
  }
  if (job.company.toString() !== req.user._id.toString()) {
    throw new AppError(403, "Không có quyền xóa việc làm này", "FORBIDDEN");
  }
  await job.deleteOne();
  res.json({ success: true, message: "Xóa việc làm thành công" });
});
// [PUT] /api/jobs/:id/toggle-close
exports.toggleCloseJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) {
    throw new AppError(404, "Không tìm thấy việc làm", "JOB_NOT_FOUND");
  }
  if (job.company.toString() !== req.user._id.toString()) {
    throw new AppError(403, "Không có quyền đóng/mở việc làm này", "FORBIDDEN");
  }
  job.isClosed = !job.isClosed;
  await job.save();
  res.json({
    success: true,
    message: job.isClosed
      ? "Đóng việc làm thành công"
      : "Mở việc làm thành công",
    job,
  });
});
