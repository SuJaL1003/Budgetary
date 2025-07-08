const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Category = require("../models/Category");

// GET /api/category/user
router.get("/user", authMiddleware, async (req, res) => {
  try {
    const categories = await Category.find({ user: req.user.userId });
    res.status(200).json({ success: true, categories });
  } catch (err) {
    console.error("Error fetching user categories:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch categories" });
  }
});

module.exports = router;
