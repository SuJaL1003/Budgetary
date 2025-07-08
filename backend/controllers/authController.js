const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// Validate only Gmail IDs
const validateEmail = (email) => {
  const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  return gmailRegex.test(email);
};

// Validate strong password: min 6, 1 uppercase, 1 special char
const validatePassword = (password) => {
  const strongPasswordRegex =
    /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{6,}$/;
  return strongPasswordRegex.test(password);
};

// ----------- Register User ----------
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists!",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: "user",
      isVerified: false,
      verificationToken,
    });

    await newUser.save();

    // Setup transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "susujal4@gmail.com",
        pass: "rpqtiqmgtdblacvb",
      },
    });

    // Verification link
    const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;

    // Send email
    await transporter.sendMail({
      from: `"Verify Your Email" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Email Verification",
      html: `<h4>Hi ${username},</h4>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verifyUrl}">${verifyUrl}</a>`,
    });

    res.status(201).json({
      success: true,
      message:
        "Registration successful. Please check your email to verify your account.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};

// ----------- Login User ----------
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials (email not found)",
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email before logging in.",
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials (wrong password)",
      });
    }

    const accessToken = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    const safeUser = {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: safeUser,
      token: accessToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};

// ----------- Verify Email ----------
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification token.",
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Email verified successfully. You can now login.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Something went wrong during verification.",
    });
  }
};

// ----------- Forgot Password ----------
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "Email not found" });

    const token = crypto.randomBytes(32).toString("hex");
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;

    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 1000 * 60 * 15; // 15 mins
    await user.save();

    // Send email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_ID,
        pass: process.env.MAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Reset Password" <${process.env.MAIL_ID}>`,
      to: user.email,
      subject: "Reset Your Password",
      html: `
        <h3>Password Reset</h3>
        <p>Click below to reset your password. This link expires in 15 minutes.</p>
        <a href="${resetUrl}">${resetUrl}</a>
      `,
    });

    res.status(200).json({
      success: true,
      message: "Reset link sent to your email.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ----------- Reset Password ----------
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successful. You can now login.",
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Error resetting password" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  verifyEmail,
  forgotPassword,
  resetPassword,
};
