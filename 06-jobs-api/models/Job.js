const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Please provide company name"],
      minlength: 5,
      maxlength: 50,
    },
    position: {
      type: String,
      required: [true, "Please provide position name"],
      minlength: 5,
      maxlength: 50,
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "interview", "declined"],
        message: "${VALUE} not allowed",
      },
      default: "pending",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", JobSchema);
