const Category = require("../models/Category");
const Transaction = require("../models/Transaction");
const Budget = require("../models/Budget");
const { default: mongoose } = require("mongoose");

// Create
createTransaction = async (req, res) => {
  try {
    const { amount, category, date, type, note, isRecurring, frequency } =
      req.body;

    const transaction = new Transaction({
      user: req.user.userId,
      type,
      amount,
      category,
      date,
      note,
      isRecurring,
      frequency: isRecurring ? frequency : undefined,
    });
    await transaction.save();

    // Only process budget update if it's an expense
    if (type === "expense") {
      const txnDate = new Date(date);
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      const month = monthNames[txnDate.getUTCMonth()];
      const year = txnDate.getUTCFullYear();

      const startDate = new Date(
        Date.UTC(year, txnDate.getUTCMonth(), 1, 0, 0, 0)
      );
      const endDate = new Date(
        Date.UTC(year, txnDate.getUTCMonth() + 1, 0, 23, 59, 59, 999)
      );

      // ✅ DEBUG START
      console.log("=========== DEBUG LOG START ===========");
      console.log("User ID:", req.user.userId);
      console.log("Category:", category);
      console.log("Month:", month);
      console.log(
        "Date Range:",
        startDate.toISOString(),
        "→",
        endDate.toISOString()
      );

      // Check all matching transactions before aggregation
      const debugTxns = await Transaction.find({
        user: req.user.userId,
        category,
        type: "expense",
        date: { $gte: startDate, $lte: endDate },
      });

      console.log(
        `Found ${debugTxns.length} expense transactions with category '${category}':`
      );
      debugTxns.forEach((t) => {
        console.log(
          `- ID: ${t._id}, Date: ${t.date.toISOString()}, Amount: ${t.amount}`
        );
      });
      // ✅ DEBUG END

      // Aggregate spent in date range
      const expenses = await Transaction.aggregate([
        {
          $match: {
            user: new mongoose.Types.ObjectId(req.user.userId),
            category: category,
            type: "expense",
            date: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
          },
        },
      ]);

      console.log("💰 Aggregation Result:", expenses);
      const spent = expenses[0]?.total || 0;
      console.log("✅ Final Calculated Spent:", spent);
      console.log("=========== DEBUG LOG END ===========");

      // Check for existing budget
      const existingBudget = await Budget.findOne({
        user: req.user.userId,
        category,
        month,
      });

      if (existingBudget) {
        existingBudget.spent = spent;
        await existingBudget.save();
      } else {
        // Optional: skip or create a new budget entry
        console.log(
          `⚠️ No budget set for category '${category}' in ${month}. Skipping update.`
        );
      }
    }

    res.status(201).json({ success: true, data: transaction });
  } catch (err) {
    console.error("Error creating transaction:", err);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: err.message,
    });
  }
};
//Stats
const getStats = async (req, res) => {
  try {
    const userId = req.user.userId;

    const transactions = await Transaction.find({ user: userId });

    let totalIncome = 0;
    let totalExpense = 0;

    for (let txn of transactions) {
      if (txn.type === "income") totalIncome += txn.amount;
      else if (txn.type === "expense") totalExpense += txn.amount;
    }

    res.status(200).json({
      success: true,
      income: totalIncome,
      expenses: totalExpense,
    });
  } catch (err) {
    console.error("Failed to get stats:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = { getStats };
// Read
const getTransaction = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.userId }).sort(
      { date: -1 }
    );

    res.status(200).json({ success: true, data: transactions });
  } catch (err) {
    console.error("Error fetching transactions:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch transactions." });
  }
};

// Update
const updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId }, // Ensure ownership
      req.body,
      { new: true, runValidators: true } // Return updated doc + validate schema
    );

    if (!transaction) {
      return res
        .status(404)
        .json({ success: false, message: "Transaction not found" });
    }

    res.status(200).json({ success: true, data: transaction });
  } catch (err) {
    console.error("Error updating transaction:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to update transaction." });
  }
};

// Delete
const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!transaction) {
      return res
        .status(404)
        .json({ success: false, message: "Transaction not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Transaction deleted successfully." });
  } catch (err) {
    console.error(" Error deleting transaction:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete transaction." });
  }
};

module.exports = {
  createTransaction,
  getTransaction,
  getStats,
  deleteTransaction,
  updateTransaction,
};
