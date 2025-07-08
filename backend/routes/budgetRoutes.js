// const express = require("express");
// const router = express.Router();

// const { authMiddleware } = require("../middleware/authMiddleware");
// const { getBudget, setBudget } = require("../controllers/budgetController");

// router.get("/get", authMiddleware, getBudget);
// router.post("/set", authMiddleware, setBudget);

// module.exports = router;

const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const { setBudget, getBudget } = require("../controllers/budgetController");

router.post("/set", authMiddleware, setBudget);
router.get("/get", authMiddleware, getBudget);

module.exports = router;
