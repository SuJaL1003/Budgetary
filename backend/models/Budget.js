const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    catAmount: {
      type: Number,
      required: true,
    },
    month: {
      type: String,
      required: true,
    },
    spent: { type: Number, default: 0 },
    _notified: {
      type: Boolean,
      default: false,
    },
    category: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Budget", budgetSchema);
