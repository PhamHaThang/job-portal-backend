const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Vui lòng nhập tiêu đề công việc"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Vui lòng nhập mô tả công việc"],
    },
    requirements: {
      type: String,
      required: [true, "Vui lòng nhập yêu cầu công việc"],
    },
    location: {
      type: String,
    },
    category: {
      type: String,
    },
    type: {
      type: String,
      enum: ["Full-time", "Part-time", "Internship", "Contract"],
      required: [true, "Vui lòng chọn loại hình công việc"],
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    salaryMin: {
      type: Number,
      min: [0, "Mức lương tối thiểu không được âm"],
      validate: {
        validator: function (value) {
          return this.salaryMax == null || value <= this.salaryMax;
        },
        message: "Mức lương tối thiểu phải nhỏ hơn hoặc bằng mức lương tối đa",
      },
    },
    salaryMax: {
      type: Number,
      min: [0, "Mức lương tối đa không được âm"],
      validate: {
        validator: function (value) {
          return this.salaryMin == null || value >= this.salaryMin;
        },
        message: "Mức lương tối đa phải lớn hơn hoặc bằng mức lương tối thiểu",
      },
    },
    isClosed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Job", jobSchema);
