const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
    },
    courseDescription: {
      type: String,
      required: true,
    },
    courseDuration: {
      type: Number,
      required: true,
    },
    instructorName: {
      type: String,
      required: true,
    },

    language: {
      type: String,
      required: true,
    },

    level: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    visibility: {
      type: String,
      required: true,
    },
    createdBy: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    modifiedBy: {
      type:String,
    },
    modifiedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("courses", CourseSchema);
