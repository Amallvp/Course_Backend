const mongoose = require("mongoose");

const ChapterSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "courses",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    chapterDescription: {
      type: String,
      required: true,
    },
    videoLink: {
      type: String,
      required: true,
    },
    chapterDuration: {
      type: Number,
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
  { timestamps: true }
);

module.exports = mongoose.model("chapters", ChapterSchema);
