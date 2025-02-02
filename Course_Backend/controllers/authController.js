const jwt = require("jsonwebtoken");
const catchAsyncError = require("../middleware/catchAsyncError");
const myConstant = require("../config/constant");

const validTokens = new Set();

const getToken = catchAsyncError(async (req, res, next) => {
  const token = jwt.sign({ access: "api" }, process.env.JWT_SECRET, {
    expiresIn: "10m",
  });

  validTokens.add(token);

  res.json({ token });
});

module.exports = {
  getToken,
  validTokens,
};
