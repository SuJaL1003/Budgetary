import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import DashboardLayout from "../Layouts/DashboardLayout";
import { useAuth } from "../context/auth";

const BudgetSettings = () => {
  const [auth] = useAuth();
  const [month, setMonth] = useState("");
  const [categories, setCategories] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categoryAmount, setCategoryAmount] = useState("");
  const [income, setIncome] = useState(0);

  const userName = auth?.user?.username;

  // Helper array for the month dropdown
  const MONTHS = [
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
  const CATEGORIES = [
    "Food",
    "Transport",
    "Utilities",
    "Entertainment",
    "Shopping",
    "Healthcare",
    "Rent",
    "Savings",
    "Misc",
  ];

  const fetchStats = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/transactions/stats`,
        {
          headers: { Authorization: `Bearer ${auth?.token}` },
        }
      );
      setIncome(data.income || 0);
    } catch (err) {
      console.error("Failed to load stats:", err);
    }
  };

  const fetchBudgets = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/budget/get`,
        {
          headers: { Authorization: `Bearer ${auth?.token}` },
        }
      );
      if (res.data.success) {
        const mapped = res.data.data.map((b) => ({
          category: b.category,
          amount: b.catAmount,
          spent: b.spent,
          month: b.month,
        }));
        setBudgets(mapped);
      }
    } catch (err) {
      console.error("Failed to fetch budgets:", err);
    }
  };

  useEffect(() => {
    if (auth?.token) {
      // fetchCategories();
      fetchStats();
      fetchBudgets();
    }
  }, [auth?.token]);

  const handleSubmit = async () => {
    if (!month || !selectedCategory || !categoryAmount) {
      toast.error("Please fill in all fields");
      return;
    }
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/budget/set`,
        {
          category: selectedCategory,
          catAmount: Number(categoryAmount),
          month,
        },
        {
          headers: {
            Authorization: `Bearer ${auth?.token}`,
          },
        }
      );

      if (res.data.success) {
        toast.success("Budget saved successfully");
        setSelectedCategory("");
        setCategoryAmount("");
        fetchBudgets(); // Refresh list
      } else {
        toast.error(res.data.message || "Failed to save budget");
      }
    } catch (error) {
      console.error("Error saving budget:", error);
      toast.error("Something went wrong while saving the budget");
    }
  };

  return (
    <DashboardLayout>
      <h2 className="text-2xl font-semibold text-emerald-700 mb-2 text-center">
        Welcome back, {userName} 👋
      </h2>
      <p className="text-md text-gray-600 mb-6 text-center">
        Your total income is{" "}
        <span className="font-semibold text-green-600">₹{income}</span>
      </p>

      <div className="max-w-3xl mx-auto bg-white rounded shadow p-6 mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Month
        </label>
        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="w-full border px-3 py-2 rounded mb-4 bg-white"
        >
          <option value="">Select Month</option>
          {MONTHS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        <h3 className="text-lg font-semibold mb-2 text-emerald-600">
          Category Budgets
        </h3>

        <div className="flex gap-3 mb-4">
          <select
            name="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full border p-3 rounded bg-white"
            required
          >
            <option value="">Select category</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <input
            type="number"
            value={categoryAmount}
            onChange={(e) => setCategoryAmount(e.target.value)}
            placeholder="Amount"
            className="border px-3 py-2 rounded w-1/2"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Save Budget
        </button>
      </div>

      <br />
      <div className="grid md:grid-cols-2 gap-4 mb-6 mt-6 px-4">
        {/* {budgets.map((b, i) => (
          <div
            key={i}
            className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 shadow-sm"
          >
            <h4 className="text-lg font-semibold text-emerald-800">
              {b.category}
            </h4>
            <p className="text-sm text-gray-700">
              Month: <span className="font-medium">{b.month}</span>
            </p>
            <p className="text-sm text-gray-700">
              Amount: ₹<span className="font-medium">{b.amount}</span>
            </p>
          </div>
        ))} */}
        {budgets.map((b, i) => {
          const percentUsed = ((b.spent / b.amount) * 100).toFixed(0);
          const isOver70 = percentUsed >= 70;

          return (
            <div
              key={i}
              className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 shadow-sm"
            >
              <h4 className="text-lg font-semibold text-emerald-800">
                {b.category}
              </h4>
              <p className="text-sm text-gray-700">
                Month: <span className="font-medium">{b.month}</span>
              </p>
              <p className="text-sm text-gray-700">
                Budget: ₹<span className="font-medium">{b.amount}</span>
              </p>
              <p className="text-sm text-gray-700">
                Spent: ₹<span className="font-medium">{b.spent}</span>
              </p>

              <div className="w-full bg-gray-200 h-2 rounded mt-2">
                <div
                  className={`h-full rounded ${
                    isOver70 ? "bg-red-500" : "bg-green-500"
                  }`}
                  style={{ width: `${percentUsed}%` }}
                ></div>
              </div>
              <p
                className={`text-xs mt-1 ${
                  isOver70 ? "text-red-600" : "text-green-700"
                }`}
              >
                {percentUsed}% of budget used
              </p>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
};

export default BudgetSettings;
