const mongoose = require("mongoose");
const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    note: {
      type: String,
    },
    isRecurring: {
      type: Boolean,
      default: false,
    },
    frequency: {
      type: String,
      enum: ["daily", "weekly", "monthly", null],
    },
    nextOccurrence: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
