const mongoose = require("mongoose");

const QuizSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "course",
      required: true,
    },
    createdBy: {
     type:String,
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

module.exports = mongoose.model("quizzes", QuizSchema)
