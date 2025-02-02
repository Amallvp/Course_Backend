const catchAsyncError = require("../middleware/catchAsyncError.js");
const Course = require("../models/course.js");
const Chapter = require("../models/chapter.js");
const mongoose = require("mongoose");
const {
  isValid,
  validString,
  validateInteger,
} = require("../validator/validator.js");
const myConstant = require("../config/constant.js");

const createCourse = catchAsyncError(async (req, res, next) => {
  try {
    const {
      category,
      title,
      content,
      chapterDescription,
      courseDescription,
      videoLink,
      chapterDuration,
      courseDuration,
      instructorName,
      language,
      level,
      price,
      status,
      visibility,
    } = req.body;
    const userId = "userID123";

    if (
      !category ||
      !title ||
      !content ||
      !chapterDescription ||
      !courseDescription ||
      !videoLink ||
      !chapterDuration ||
      !courseDuration ||
      !instructorName ||
      !language ||
      !level ||
      !price ||
      !status ||
      !visibility
    ) {
      return res.status(myConstant.BAD_REQUEST).json({
        success: false,
        message: myConstant.INPUT_MISSING,
      });
    }

    if (!isValid(category) || !validString(category)) {
      return res.status(myConstant.BAD_REQUEST).json({
        success: false,
        message: myConstant.STRING_INPUT,
      });
    }

    if (!isValid(title) || !validString(title)) {
      return res.status(myConstant.BAD_REQUEST).json({
        success: false,
        message: myConstant.STRING_INPUT,
      });
    }

    if (!isValid(content) || !validString(content)) {
      return res.status(myConstant.BAD_REQUEST).json({
        success: false,
        message: myConstant.STRING_INPUT,
      });
    }

    if (!isValid(chapterDescription) || !validString(chapterDescription)) {
      return res.status(myConstant.BAD_REQUEST).json({
        success: false,
        message: myConstant.STRING_INPUT,
      });
    }

    if (!isValid(courseDescription) || !validString(courseDescription)) {
      return res.status(myConstant.BAD_REQUEST).json({
        success: false,
        message: myConstant.STRING_INPUT,
      });
    }

    if (!isValid(instructorName) || !validString(instructorName)) {
      return res.status(myConstant.BAD_REQUEST).json({
        success: false,
        message: myConstant.STRING_INPUT,
      });
    }

    if (!isValid(language) || !validString(language)) {
      return res.status(myConstant.BAD_REQUEST).json({
        success: false,
        message: myConstant.STRING_INPUT,
      });
    }

    if (!isValid(level) || !validString(level)) {
      return res.status(myConstant.BAD_REQUEST).json({
        success: false,
        message: myConstant.STRING_INPUT,
      });
    }

    if (!isValid(status) || !validString(status)) {
      return res.status(myConstant.BAD_REQUEST).json({
        success: false,
        message: myConstant.STRING_INPUT,
      });
    }

    if (!isValid(visibility) || !validString(visibility)) {
      return res.status(myConstant.BAD_REQUEST).json({
        success: false,
        message: myConstant.STRING_INPUT,
      });
    }

    if (!isValid(price) || !validateInteger(price)) {
      return res.status(myConstant.BAD_REQUEST).json({
        success: false,
        message: myConstant.INT_INPUT,
      });
    }

    if (!isValid(courseDuration) || !validateInteger(courseDuration)) {
      return res.status(myConstant.BAD_REQUEST).json({
        success: false,
        message: myConstant.INT_INPUT,
      });
    }
    if (!isValid(chapterDuration) || !validateInteger(chapterDuration)) {
      return res.status(myConstant.BAD_REQUEST).json({
        success: false,
        message: myConstant.INT_INPUT,
      });
    }

    const coursePayload = {
      category,
      courseDescription,
      courseDuration,
      instructorName,
      language,
      level,
      price,
      status,
      visibility,
      createdBy: userId,
    };

    const createCourse = await Course.create(coursePayload);

    if (!createCourse) {
      res.status(myConstant.BAD_REQUEST).json({
        success: false,
        message: myConstant.CREATION_ERROR,
      });
    }

    const chapterPayload = {
      courseId: createCourse._id,
      title,
      content,
      chapterDescription,
      videoLink,
      chapterDuration,
      createdBy: userId,
    };

    const createChapter = await Chapter.create(chapterPayload);

    if (!createChapter) {
      res.status(myConstant.BAD_REQUEST).json({
        success: false,
        message: myConstant.CREATION_ERROR,
      });
    }

    const response = {
      id: createCourse._id,
      category: createCourse.category,
      chapters: [
        {
          id: createChapter._id,
          title: createChapter.title,
          content: createChapter.content,
          chapterDescription: createChapter.chapterDescription,
          videoLink: createChapter.videoLink,
          duration: createChapter.chapterDuration,
        },
      ],
      description: createCourse.courseDescription,
      duration: createCourse.courseDuration,
      instructorName: createCourse.instructorName,
      language: createCourse.language,
      level: createCourse.level,
      price: createCourse.price,
      status: createCourse.status,
      visibility: createCourse.visibility,
    };

    return res.status(myConstant.GOOD_CODE).json({
      success: true,
      message: `Course ${myConstant.SUCCESSFUL}`,
      data: response,
      //data: { course: createCourse, chapter: createChapter },
    });
  } catch (error) {
    return res.status(myConstant.ERR_CODE).json({
      success: false,
      message: error.message,
    });
  }
});

const getCourse = catchAsyncError(async (req, res) => {
  try {
    let { page, limit } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;

    const courses = await Course.aggregate([
      {
        $lookup: {
          from: "chapters",
          localField: "_id",
          foreignField: "courseId",
          as: "chapters",
        },
      },
      { $skip: skip },
      { $limit: limit },
    ]);

    if (!courses) {
      return res.status(myConstant.BAD_REQUEST).json({
        success: false,
        message: myConstant.NOT_FOUND,
      });
    }

    const totalCourses = await Course.countDocuments();

    const response = courses.map((course) => ({
      id: course._id,
      category: course.category,
      chapters: course.chapters.map((chapter) => ({
        id: chapter._id,
        title: chapter.title,
        content: chapter.content,
        description: chapter.chapterDescription,
        videoLink: chapter.videoLink,
        duration: chapter.chapterDuration,
      })),
      description: course.courseDescription,
      duration: course.courseDuration,
      instructorName: course.instructorName,
      language: course.language,
      level: course.level,
      price: course.price,
      status: course.status,
      visibility: course.visibility,
    }));

    return res.status(myConstant.GOOD_CODE).json({
      success: true,
      message: `Courses ${myConstant.FETCHED}`,
      data: response,
      pagination: {
        totalPages: Math.ceil(totalCourses / limit),
        currentPage: page,
        totalCourses,
      },
    });
  } catch (error) {
    return res.status(myConstant.ERR_CODE).json({
      success: false,
      message: error.message,
    });
  }
});

const getCourseById = catchAsyncError(async (req, res) => {
  try {
    const courseId = req.params.courseId?.trim();

    if (!courseId) {
      return res.status(myConstant.BAD_REQUEST).json({
        success: false,
        message: "Invalid Course ID",
      });
    }

    const existingCourse = await Course.findById(courseId);
    if (!existingCourse) {
      return res.status(myConstant.NOT_FOUND_CODE).json({
        success: false,
        message: "Course not found",
      });
    }

    const courseData = await Course.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(courseId) },
      },
      {
        $lookup: {
          from: "chapters",
          localField: "_id",
          foreignField: "courseId",
          as: "chapters",
        },
      },
    ]);
    console.log("courseData :::", courseData);

    if (!courseData || courseData.length === 0) {
      return res.status(myConstant.BAD_REQUEST).json({
        success: false,
        message: "Coursend",
      });
    }

    const response = {
      id: courseData[0]._id,
      category: courseData[0].category,
      chapters: courseData[0].chapters.map((chapter) => ({
        id: chapter._id,
        title: chapter.title,
        content: chapter.content,
        description: chapter.chapterDescription,
        videoLink: chapter.videoLink,
        duration: chapter.chapterDuration,
      })),
      description: courseData[0].courseDescription,
      duration: courseData[0].courseDuration,
      instructorName: courseData[0].instructorName,
      language: courseData[0].language,
      level: courseData[0].level,
      price: courseData[0].price,
      status: courseData[0].status,
      visibility: courseData[0].visibility,
    };

    return res.status(myConstant.GOOD_CODE).json({
      success: true,
      message: `Course ${myConstant.FETCHED}`,
      data: response,
    });
  } catch (error) {
    return res.status(myConstant.ERR_CODE).json({
      success: false,
      message: error.message,
    });
  }
});

const updateCourse = catchAsyncError(async (req, res, next) => {
  try {
    const courseId = req.params.courseId?.trim();

    if (!courseId) {
      return res.status(myConstant.BAD_REQUEST).json({
        success: false,
        message: myConstant.MISSINGMANDATS,
      });
    }

    const {
      category,
      title,
      content,
      chapterDescription,
      courseDescription,
      videoLink,
      chapterDuration,
      courseDuration,
      instructorName,
      language,
      level,
      price,
      status,
      visibility,
    } = req.body;
    const userId = "userID123";

    if (
      !category ||
      !title ||
      !content ||
      !chapterDescription ||
      !courseDescription ||
      !videoLink ||
      !chapterDuration ||
      !courseDuration ||
      !instructorName ||
      !language ||
      !level ||
      !price ||
      !status ||
      !visibility
    ) {
      return res.status(myConstant.BAD_REQUEST).json({
        success: false,
        message: myConstant.INPUT_MISSING,
      });
    }

    if (!isValid(category) || !validString(category)) {
      return res.status(myConstant.BAD_REQUEST).json({
        success: false,
        message: myConstant.STRING_INPUT,
      });
    }

    if (!isValid(title) || !validString(title)) {
      return res.status(myConstant.BAD_REQUEST).json({
        success: false,
        message: myConstant.STRING_INPUT,
      });
    }

    if (!isValid(content) || !validString(content)) {
      return res.status(myConstant.BAD_REQUEST).json({
        success: false,
        message: myConstant.STRING_INPUT,
      });
    }

    if (!isValid(chapterDescription) || !validString(chapterDescription)) {
      return res.status(myConstant.BAD_REQUEST).json({
        success: false,
        message: myConstant.STRING_INPUT,
      });
    }

    if (!isValid(courseDescription) || !validString(courseDescription)) {
      return res.status(myConstant.BAD_REQUEST).json({
        success: false,
        message: myConstant.STRING_INPUT,
      });
    }

    if (!isValid(instructorName) || !validString(instructorName)) {
      return res.status(myConstant.BAD_REQUEST).json({
        success: false,
        message: myConstant.STRING_INPUT,
      });
    }

    if (!isValid(language) || !validString(language)) {
      return res.status(myConstant.BAD_REQUEST).json({
        success: false,
        message: myConstant.STRING_INPUT,
      });
    }

    if (!isValid(level) || !validString(level)) {
      return res.status(myConstant.BAD_REQUEST).json({
        success: false,
        message: myConstant.STRING_INPUT,
      });
    }

    if (!isValid(status) || !validString(status)) {
      return res.status(myConstant.BAD_REQUEST).json({
        success: false,
        message: myConstant.STRING_INPUT,
      });
    }

    if (!isValid(visibility) || !validString(visibility)) {
      return res.status(myConstant.BAD_REQUEST).json({
        success: false,
        message: myConstant.STRING_INPUT,
      });
    }

    if (!isValid(price) || !validateInteger(price)) {
      return res.status(myConstant.BAD_REQUEST).json({
        success: false,
        message: myConstant.INT_INPUT,
      });
    }

    if (!isValid(courseDuration) || !validateInteger(courseDuration)) {
      return res.status(myConstant.BAD_REQUEST).json({
        success: false,
        message: myConstant.INT_INPUT,
      });
    }
    if (!isValid(chapterDuration) || !validateInteger(chapterDuration)) {
      return res.status(myConstant.BAD_REQUEST).json({
        success: false,
        message: myConstant.INT_INPUT,
      });
    }

    const existingCourse = await Course.findById(courseId);
    if (!existingCourse) {
      return res.status(myConstant.BAD_REQUEST).json({
        success: false,
        message: myConstant.NOT_FOUND,
      });
    }

    const coursePayload = {
      category,
      courseDescription,
      courseDuration,
      instructorName,
      language,
      level,
      price,
      status,
      visibility,
      updatedBy: userId, // Updated by the logged-in user
    };

    // Update course
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      coursePayload,
      { new: true }
    );

    if (!updatedCourse) {
      return res.status(myConstant.BAD_REQUEST).json({
        success: false,
        message: myConstant.CREATION_ERROR,
      });
    }

    if (content || chapterDescription || videoLink || chapterDuration) {
      const chapterPayload = {
        title,
        content,
        chapterDescription,
        videoLink,
        chapterDuration,
        updatedBy: userId,
      };

      const updatedChapter = await Chapter.findOneAndUpdate(
        { courseId },
        chapterPayload,
        { new: true }
      );

      if (!updatedChapter) {
        return res.status(myConstant.BAD_REQUEST).json({
          success: false,
          message: myConstant.UPDATE_ERROR,
        });
      }

      const response = {
        id: updatedCourse._id,
        category: updatedCourse.category,
        chapters: [
          {
            id: updatedChapter._id,
            title: updatedChapter.title,
            content: updatedChapter.content,
            description: updatedChapter.chapterDescription,
            videoLink: updatedChapter.videoLink,
            duration: updatedChapter.chapterDuration,
          },
        ],
        description: updatedCourse.courseDescription,
        duration: updatedCourse.courseDuration,
        instructorName: updatedCourse.instructorName,
        language: updatedCourse.language,
        level: updatedCourse.level,
        price: updatedCourse.price,
        status: updatedCourse.status,
        visibility: updatedCourse.visibility,
      };

      return res.status(myConstant.GOOD_CODE).json({
        success: true,
        message: myConstant.SUCCESSFUL,
        data: response,
      });
    }
  } catch (error) {
    return res.status(myConstant.ERR_CODE).json({
      success: false,
      message: error.message,
    });
  }
});

const deleteCourse = catchAsyncError(async (req, res, next) => {
  try {
    const courseId = req.params.courseId?.trim();
    if (!courseId) {
      return res.status(myConstant.BAD_REQUEST).json({
        success: false,
        message: myConstant.MISSINGMANDATS,
      });
    }
    const existingCourse = await Course.findById(courseId);
    if (!existingCourse) {
      return res.status(myConstant.BAD_REQUEST).json({
        success: false,
        message: myConstant.NOT_FOUND,
      });
    }
    const deletedChapter = await Chapter.deleteMany({ courseId });

    if (!deletedChapter) {
      return res.status(myConstant.BAD_REQUEST).json({
        success: false,
        message: myConstant.DELECTION,
      });
    }
    const deletedCourse = await Course.findByIdAndDelete(courseId);

    if (!deletedCourse) {
      return res.status(myConstant.BAD_REQUEST).json({
        success: false,
        message: myConstant.DELECTION,
      });
    }
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
  createCourse,
  getCourse,
  getCourseById,
  updateCourse,
  deleteCourse,
};
