const Express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/dbConfig");
const app = Express();
const port = process.env.PORT || 5000;
const multer = require('multer');

app.use(cors());
app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));
dotenv.config();
connectDB();
const upload = multer();
app.use(upload.none()); 

const authRoute = require("./routes/authRoute");
const courseRoute = require("./routes/courseRoute");
const quizRoute = require("./routes/quizRoute");

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/courses", courseRoute);
app.use("/api/v1/quiz",quizRoute)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
