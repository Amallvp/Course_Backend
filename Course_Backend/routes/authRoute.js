const express = require ("express")
const Router = express.Router()

const {getToken }= require ("../controllers/authController")

Router.route("/Token").post(getToken)

module.exports = Router;