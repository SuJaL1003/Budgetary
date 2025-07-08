const { default: mongoose } = require("mongoose");
const Budget = require("../models/Budget");
const Category = require("../models/Category");
const Transaction = require("../models/Transaction");

exports.setBudget = async (req, res) => {
  try {
    const { category, catAmount, month } = req.body;

    const monthNumberMap = {
      January: 0,
      February: 1,
      March: 2,
      April: 3,
      May: 4,
      June: 5,
      July: 6,
      August: 7,
      September: 8,
      October: 9,
      November: 10,
      December: 11,
    };

    const monthIndex = monthNumberMap[month];
    if (monthIndex === undefined) {
      return res.status(400).json({ success: false, message: "Invalid month" });
    }

    const year = new Date().getFullYear(); // Optional: accept year from frontend
    const startDate = new Date(Date.UTC(year, monthIndex, 1, 0, 0, 0));
    const endDate = new Date(
      Date.UTC(year, monthIndex + 1, 0, 23, 59, 59, 999)
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
    let existingBudget = await Budget.findOne({
      user: req.user.userId,
      category,
      month,
    });

    if (existingBudget) {
      existingBudget.catAmount = catAmount;
      existingBudget.spent = spent;
      await existingBudget.save();
    } else {
      await Budget.create({
        user: req.user.userId,
        category,
        catAmount,
        spent,
        month,
      });
    }

    res
      .status(200)
      .json({ success: true, message: "Budget saved successfully." });
  } catch (error) {
    console.error("❌ Error setting budget:", error);
    res.status(500).json({ success: false, message: "Failed to set budget." });
  }
};

const sendEmail = require("../utils/sendEmail");

exports.getBudget = async (req, res) => {
  try {
    const userId = req.user.userId;
    const userEmail = req.user.email;

    const budgets = await Budget.find({ user: userId }).sort({ month: 1 });

    for (let b of budgets) {
      const usedPercent = (b.spent / b.catAmount) * 100;

      if (usedPercent >= 70 && !b._notified) {
        // 📧 Send alert email
        await sendEmail(
          userEmail,
          `⚠️ Budget Alert for ${b.category}`,
          `You have used ${usedPercent.toFixed(1)}% of your '${
            b.category
          }' budget for ${b.month}.\nSpent: ₹${b.spent} of ₹${b.catAmount}.`
        );

        // ✅ Update _notified flag
        b._notified = true;
        await b.save();
      }

      // Optional: reset flag if below threshold again
      if (usedPercent < 70 && b._notified) {
        b._notified = false;
        await b.save();
      }
    }

    res.status(200).json({
      success: true,
      data: budgets,
    });
  } catch (error) {
    console.error("Error fetching budget:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch budgets." });
  }
};
