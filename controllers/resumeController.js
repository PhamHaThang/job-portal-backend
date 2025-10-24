const Resume = require("../models/Resume");
const asyncHandler = require("express-async-handler");
const AppError = require("../utils/AppError");
const { deleteCloudinaryFile } = require("../utils/cloudinary");
// [POST] /api/resumes
exports.createResume = asyncHandler(async (req, res) => {
  const { title } = req.body;
  if (!title) {
    throw new AppError(400, "Tiêu đề CV là bắt buộc");
  }
  const defaultResumeData = {
    profileInfo: {
      profileImg: "",
      profilePreviewUrl: "",
      fullName: "",
      designation: "",
      summary: "",
    },
    contactInfo: {
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      github: "",
      website: "",
    },
    workExperience: [
      {
        company: "",
        role: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ],
    education: [
      {
        degree: "",
        institution: "",
        startDate: "",
        endDate: "",
      },
    ],
    skills: [
      {
        name: "",
        progress: 0,
      },
    ],
    projects: [
      {
        title: "",
        description: "",
        github: "",
        liveDemo: "",
      },
    ],
    certifications: [
      {
        title: "",
        issuer: "",
        year: "",
      },
    ],
    languages: [
      {
        name: "",
        progress: 0,
      },
    ],
    interest: "",
  };
  const newResume = await Resume.create({
    userId: req.user._id,
    title,
    ...defaultResumeData,
  });
  res.status(201).json({
    success: true,
    message: "Tạo mới CV thành công",
    resume: newResume,
  });
});

// [GET] /api/resumes
exports.getUserResumes = asyncHandler(async (req, res) => {
  const resumes = await Resume.find({ userId: req.user._id }).sort({
    updatedAt: -1,
  });
  res.status(200).json({
    success: true,
    message: "Lấy danh sách CV thành công",
    resumes,
  });
});

// [GET] /api/resumes/:id
exports.getResumeById = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });
  if (!resume) {
    throw new AppError(404, "CV không tồn tại");
  }
  res.status(200).json({
    success: true,
    message: "Lấy thông tin CV thành công",
    resume,
  });
});

// [PUT] /api/resumes/:id
exports.updateResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });
  if (!resume) {
    throw new AppError(404, "CV không tồn tại");
  }
  Object.assign(resume, req.body);
  const savedResume = await resume.save();
  res.status(200).json({
    success: true,
    message: "Cập nhật CV thành công",
    resume: savedResume,
  });
});

// [DELETE] /api/resumes/:id
exports.deleteResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });
  if (!resume) {
    throw new AppError(404, "CV không tồn tại");
  }
  if (resume.thumbnailLink) {
    await deleteCloudinaryFile(resume.thumbnailLink);
  }

  if (resume.profileInfo?.profilePreviewUrl) {
    await deleteCloudinaryFile(resume.profileInfo.profilePreviewUrl);
  }
  await resume.deleteOne();
  res.status(200).json({
    success: true,
    message: "Xóa CV thành công",
  });
});
