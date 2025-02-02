const jwt = require("jsonwebtoken");
const { validTokens } = require("../controllers/authController");
const myConstant = require("../config/constant");

const jwtMiddleware = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(myConstant.AUTH_CODE)
      .json({ message: myConstant.NO_TOKEN });
  }

  const token = authHeader.slice(7);

  try {
    if (!validTokens.has(token)) {
      return res
        .status(myConstant.FORB_CODE)
        .json({ message: myConstant.INVALID_TOKEN });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.apiAccess = decoded;
    next();
  } catch (error) {
    return res
      .status(myConstant.FORB_CODE)
      .json({ message: myConstant.INVALID_TOKEN });
  }
};

module.exports = jwtMiddleware;
