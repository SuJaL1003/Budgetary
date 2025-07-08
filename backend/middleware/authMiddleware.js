const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access Denied",
    });
  }

  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET_KEY);
    console.log("Decoded Token:", decoded);

    req.user = decoded;
    next();
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: "Invalid Token",
    });
  }
};

module.exports = authMiddleware;
