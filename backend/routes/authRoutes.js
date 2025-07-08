const express = require("express");
const {
  registerUser,
  verifyEmail,
  loginUser,
  resetPassword,
  forgotPassword,
} = require("../controllers/authController");
const router = express.Router();

router.post("/register", registerUser);
router.get("/verify-email", verifyEmail);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

module.exports = router;
