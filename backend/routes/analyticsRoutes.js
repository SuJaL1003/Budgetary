const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const getFullMonthlyAnalytics = require("../controllers/analyticsController");
const router = express.Router();

router.get("/monthly", authMiddleware, getFullMonthlyAnalytics);

module.exports = router;
