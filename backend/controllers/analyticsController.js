const Budget = require("../models/Budget");
const Transaction = require("../models/Transaction");

const getFullMonthlyAnalytics = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { month, year } = req.query;

    if (!month || !year) {
      return res
        .status(400)
        .json({ success: false, message: "Month and year requied" });
    }

    const monthIndex = new Date(`${month} 1,${year}`).getMonth();
    const startDate = new Date(Date.UTC(year, monthIndex, 1));
    const endDate = new Date(
      Date.UTC(year, monthIndex + 1, 0, 23, 59, 59, 999)
    );

    const transactions = await Transaction.find({
      user: userId,
      date: { $gte: startDate, $lte: endDate },
    });

    let totalIncome = 0;
    let totalExpense = 0;
    let categoryData = {};

    for (let txn of transactions) {
      if (txn.type === "income") totalIncome += txn.amount;
      else if (txn.type === "expense") {
        totalExpense += txn.amount;
        categoryData[txn.category] =
          (categoryData[txn.category] || 0) + txn.amount;
      }
    }

    const net = totalIncome - totalExpense;

    const budgets = await Budget.find({ user: userId, month });
    const budgetVsSpent = budgets.map((b) => ({
      category: b.category,
      budgeted: b.catAmount,
      spent: b.spent,
    }));

    // Top 3 expense categories
    const topCategories = Object.entries(categoryData)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([category, amount]) => ({ category, amount }));

    return res.status(200).json({
      success: true,
      totalIncome,
      totalExpense,
      net,
      categoryData,
      budgetVsSpent,
      topCategories,
    });
  } catch (error) {
    console.error("Analytics error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch analytics" });
  }
};

module.exports = getFullMonthlyAnalytics;
