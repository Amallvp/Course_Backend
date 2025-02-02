const catchAsyncError = require("../middleware/catchAsyncError.js");
const {
  isValid,
  validString,
  validateInteger,
} = require("../validator/validator.js");
const myConstant = require("../config/constant.js");
const Course = require("../models/course.js");
const Question = require("../models/question.js");
const Quiz = require("../models/quiz.js");
const course = require("../models/course.js");
const mongoose = require("mongoose");

const createQuiz = catchAsyncError(async (req, res) => {
  try {
    const courseId = req.params.courseId?.trim();

    if (!courseId) {
      return res.status(myConstant.BAD_REQUEST).json({
        success: false,
        message: myConstant.MISSINGMANDATS,
      });
    }

    const courseExists = await Course.findById(courseId);

    if (!courseExists) {
      return res.status(myConstant.BAD_REQUEST).json({
        success: false,
        message: myConstant.NOT_FOUND,
      });
    }

    const { question, options, answer } = req.body;
    const userId = "userID123";

    if (!question || !options || !answer) {
      return res.status(myConstant.BAD_REQUEST).json({
        success: false,
        message: myConstant.INPUT_MISSING,
      });
    }

    if (!isValid(question) || !validString(question)) {
      return res.status(myConstant.BAD_REQUEST).json({
        success: false,
        message: myConstant.STRING_INPUT,
      });
    }

    let optionsArray = [];
    try {
      optionsArray = JSON.parse(options); // Parse the stringified array
    } catch (error) {
      return res.status(myConstant.BAD_REQUEST).json({
        success: false,
        message: "Invalid options format",
      });
    }

    if (!Array.isArray(optionsArray) || optionsArray.length < 2) {
      return res.status(myConstant.BAD_REQUEST).json({
        success: false,
        message: myConstant.ARRAY_INPUT,
      });
    }

    if (!optionsArray.includes(answer)) {
      return res.status(myConstant.BAD_REQUEST).json({
        success: false,
        message: myConstant.WRONG_INPUT,
      });
    }

    const quizPayload = {
      courseId,
      createdBy: userId,
    };

    const newQuiz = await Quiz.create(quizPayload);

    if (!newQuiz) {
      return res.status(myConstant.BAD_REQUEST).json({
        success: false,
        message: myConstant.NOT_FOUND,
      });
    }

    const questionExists = await Question.findOne({ courseId, question });
    if (questionExists) {
      return res.status(myConstant.BAD_REQUEST).json({
        success: false,
        message: myConstant.ALREADY_EXISTS,
      });
    }

    const questionPayload = {
      quizId: newQuiz._id,
      question,
      options: optionsArray,
      correctAnswer: answer,
    };

    const newQuestion = await Question.create(questionPayload);

    const response = {
      id: newQuiz._id,
      courseId: newQuiz.courseId,
      question: [
        {
          newQuestion,
        },
      ],
    };

    return res.status(myConstant.GOOD_CODE).json({
      success: true,
      message: myConstant.SUCCESSFUL,
      data: response,
    });
  } catch (error) {
    return res.status(myConstant.BAD_REQUEST).json({
      success: false,
      message: error.message,
    });
  }
});

const getQuiz = catchAsyncError(async (req, res) => {
  try {
    let { page, limit } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;

    const courseId = req.params.courseId?.trim();

    if (!courseId) {
      return res.status(myConstant.BAD_REQUEST).json({
        success: false,
        message: myConstant.MISSINGMANDATS,
      });
    }

    const courseExists = await Course.findById(courseId);
    if (!courseExists) {
      return res.status(myConstant.BAD_REQUEST).json({
        success: false,
        message: myConstant.NOT_FOUND,
      });
    }

    const fetchQuiz = await Quiz.aggregate([
      {
        $match: { courseId: new mongoose.Types.ObjectId(courseId) },
      },
      {
        $lookup: {
          from: "questions",
          localField: "_id",
          foreignField: "quizId",
          as: "questions",
        },
      },
      { $skip: skip },
      { $limit: limit },
    ]);

    if (!fetchQuiz) {
      return res.status(myConstant.BAD_REQUEST).json({
        success: false,
        message: myConstant.NOT_FOUND,
      });
    }

    const totalQuizzes = await Quiz.countDocuments({
      courseId: new mongoose.Types.ObjectId(courseId),
    });

    const response = fetchQuiz.map((quiz) => ({
      id: quiz._id,
      courseId: quiz.courseId,
      question: quiz.questions.map((question) => ({
        id: question._id,
        question: question.question,
        options: question.options,
        correctAnswer: question.correctAnswer,
      })),
    }));

    return res.status(myConstant.GOOD_CODE).json({
      success: true,

      message: `Courses ${myConstant.FETCHED}`,
      data: response,
      pagination: {
        totalPages: Math.ceil(totalQuizzes / limit),
        currentPage: page,
        totalQuizzes,
      },
    });
  } catch (error) {
    return res.status(myConstant.ERR_CODE).json({
      success: false,
      message: error.message,
    });
  }
});

const getQuizById = catchAsyncError(async (req, res) => {
  try {
    const quizId = req.params.quizId?.trim();

    if (!quizId) {
      return res.status(myConstant.BAD_REQUEST).json({
        success: false,
        message: "Invalid ID",
      });
    }

    const quizData = await Quiz.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(quizId) },
      },
      {
        $lookup: {
          from: "questions",
          localField: "_id",
          foreignField: "quizId",
          as: "questions",
        },
      },
    ]);

    console.log("Quiz Data:", quizData);

    // Check if quiz exists
    if (!quizData || quizData.length === 0) {
      return res.status(myConstant.BAD_REQUEST).json({
        success: false,
        message: "Quiz not found",
      });
    }

    const quiz = quizData[0];

    const response = {
      id: quiz._id,
      courseId: quiz.courseId,
      questions: quiz.questions.map((question) => ({
        id: question._id,
        question: question.question,
        options: question.options,
        correctAnswer: question.correctAnswer,
      })),
    };

    return res.status(myConstant.GOOD_CODE).json({
      success: true,
      message: myConstant.FETCHED,
      data: response,
    });
  } catch (error) {
    return res.status(myConstant.ERR_CODE).json({
      success: false,
      message: myConstant.COMMON_ERROR,
    });
  }
});

const updateQuiz = catchAsyncError(async (req, res) => {
  try {
    const quizId = req.params.quizId?.trim();

    const { question, options, answer } = req.body;
    const userId = "userID123";

    if (!quizId) {
      return res.status(myConstant.BAD_REQUEST).json({
        success: false,
        message: myConstant.MISSINGMANDATS,
      });
    }

    if (!question || !options || !answer) {
      return res.status(myConstant.BAD_REQUEST).json({
        success: false,
        message: myConstant.INPUT_MISSING,
      });
    }

    if (!isValid(question) || !validString(question)) {
      return res.status(myConstant.BAD_REQUEST).json({
        success: false,
        message: myConstant.STRING_INPUT,
      });
    }

    const existingQuiz = await Quiz.findById(quizId);
    if (!existingQuiz) {
      return res.status(myConstant.BAD_REQUEST).json({
        success: false,
        message: myConstant.NOT_FOUND,
      });
    }

    let optionsArray = [];
    try {
      optionsArray = JSON.parse(options);
    } catch (error) {
      return res.status(myConstant.BAD_REQUEST).json({
        success: false,
        message: myConstant.INVALID_FORMAT,
      });
    }

    if (!Array.isArray(optionsArray) || optionsArray.length < 2) {
      return res.status(myConstant.BAD_REQUEST).json({
        success: false,
        message: myConstant.ARRAY_INPUT,
      });
    }

    if (!optionsArray.includes(answer)) {
      return res.status(myConstant.BAD_REQUEST).json({
        success: false,
        message: myConstant.WRONG_INPUT,
      });
    }

    const updatedQuiz = await Quiz.findByIdAndUpdate(
      quizId,
      { $set: { modifiedBy: userId } },
      { new: true }
    );

    const existingQuestion = await Question.findOne({ quizId, question });
    if (existingQuestion) {
      const updatedQuestion = await Question.findOneAndUpdate(
        { quizId, question },
        {
          $set: {
            options: optionsArray,
            correctAnswer: answer,
          },
        },
        { new: true }
      );
      return res.status(myConstant.GOOD_CODE).json({
        success: true,
        message: myConstant.SUCCESSFUL,
        data: updatedQuestion,
      });
    }

    const questionPayload = {
      quizId: updatedQuiz._id,
      question,
      options: optionsArray,
      correctAnswer: answer,
      modifiedBy: userId,
    };

    const newQuestion = await Question.create(questionPayload);

    return res.status(myConstant.GOOD_CODE).json({
      success: true,
      message: myConstant.UPDATED,
      data: { updatedQuiz, newQuestion },
    });
  } catch (error) {
    return res.status(myConstant.ERR_CODE).json({
      success: false,
      message: myConstant.COMMON_ERROR
    });
  }
});

const deleteQuiz = catchAsyncError(async (req, res) => {
  try {
    const quizId = req.params.quizId?.trim();

    if (!quizId) {
      return res.status(myConstant.BAD_REQUEST).json({
        success: false,
        message: myConstant.INPUT_MISSING,
      });
    }

    const existingQuiz = await Quiz.findById(quizId);
    if (!existingQuiz) {
      return res.status(myConstant.BAD_REQUEST).json({
        success: false,
        message: myConstant.NOT_FOUND,
      });
    }

    await Question.deleteMany({ quizId });

    await Quiz.findByIdAndDelete(quizId);

    return res.status(myConstant.GOOD_CODE).json({
      success: true,
      message: myConstant.DELETED,
    });
  } catch (error) {
    return res.status(myConstant.ERR_CODE).json({
      success: false,
      message: myConstant.COMMON_ERROR,
    });
  }
});

module.exports = {
  createQuiz,
  getQuiz,
  getQuizById,
  updateQuiz,
  deleteQuiz,
};
