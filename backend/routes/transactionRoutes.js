const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  createTransaction,
  getTransaction,
  updateTransaction,
  deleteTransaction,
  getStats,
} = require("../controllers/transactionController");

router.post("/create", authMiddleware, createTransaction);
router.get("/get", authMiddleware, getTransaction);
router.get("/stats", authMiddleware, getStats);
router.put("/:id", authMiddleware, updateTransaction);
router.delete("/:id", authMiddleware, deleteTransaction);

module.exports = router;
