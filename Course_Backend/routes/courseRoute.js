const express = require("express");
const Router = express.Router();
const jwtMiddleware = require("../middleware/auth.js");
const {
  createCourse,
  getCourse,
  getCourseById,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController.js");

Router.route("/").post(jwtMiddleware, createCourse);

Router.route("/").get(jwtMiddleware, getCourse);

Router.route("/:courseId").get(jwtMiddleware, getCourseById);

Router.route("/:courseId").put(jwtMiddleware, updateCourse);

Router.route("/:courseId").delete(jwtMiddleware, deleteCourse);

module.exports = Router;
