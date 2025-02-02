const express = require("express");
const Router = express.Router();
const jwtMiddleware = require("../middleware/auth.js");
const {
  createQuiz,
  getQuiz,
  getQuizById,
  updateQuiz,
  deleteQuiz,
} = require("../controllers/quizController.js");

Router.route("/:courseId").post(jwtMiddleware, createQuiz);

Router.route("/:courseId").get(jwtMiddleware, getQuiz);

Router.route("/quizzes/:quizId").get(jwtMiddleware, getQuizById);

Router.route("/quizzes/:quizId").put(jwtMiddleware, updateQuiz);

Router.route("/quizzes/:quizId").delete(jwtMiddleware, deleteQuiz);

module.exports = Router;
