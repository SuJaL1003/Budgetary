const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,

    password: {
      type: String,
      required: true,
    },
    role: { type: String, enum: ["admin", "user"], default: "user" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
