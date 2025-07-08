import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
  CartesianGrid,
} from "recharts";
import { useAuth } from "../context/auth"; // adjust based on your project
import { toast } from "react-hot-toast";

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#FF8042",
  "#8dd1e1",
  "#d0ed57",
];
import DashboardLayout from "../Layouts/DashboardLayout";

const Analyicts = () => {
  const now = new Date();
  const defaultMonth = now.toLocaleString("default", { month: "long" }); // e.g., "July"
  const defaultYear = now.getFullYear();

  const [month, setMonth] = useState(defaultMonth);
  const [year, setYear] = useState(defaultYear);
  const [auth] = useAuth();
  const [analytics, setAnalytics] = useState(null);

  const fetchAnalytics = async () => {
    try {
      const res = await axios.get(
        `/api/analytics/monthly?month=${month}&year=${year}`,
        {
          headers: {
            Authorization: `Bearer ${auth?.token}`,
          },
        }
      );
      setAnalytics(res.data);
    } catch (err) {
      toast.error("Failed to fetch analytics");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (!analytics) return <div>Loading analytics...</div>;

  const pieData = Object.entries(analytics.categoryData).map(
    ([key, value]) => ({
      name: key,
      value,
    })
  );
  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
        {/* Month Selector */}
        <div className="w-full md:w-1/3">
          <label className="block mb-1 font-medium text-gray-700">
            Select Month
          </label>
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="w-full p-2 rounded-xl border border-gray-300 shadow focus:ring focus:ring-blue-200"
          >
            {[
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
            ].map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* Year Selector */}
        <div className="w-full md:w-1/3">
          <label className="block mb-1 font-medium text-gray-700">
            Select Year
          </label>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full p-2 rounded-xl border border-gray-300 shadow focus:ring focus:ring-blue-200"
          >
            {[2024, 2025, 2026].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <div className="w-full md:w-auto mt-2 md:mt-6">
          <button
            onClick={fetchAnalytics}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl shadow-md transition"
          >
            Fetch Analytics
          </button>
        </div>
      </div>

      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4">
          Monthly Analytics – {month} {year}
        </h2>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-100 p-4 rounded-xl shadow">
            <h4 className="text-lg font-medium">Total Income</h4>
            <p className="text-xl font-bold text-green-700">
              ₹{analytics.totalIncome}
            </p>
          </div>
          <div className="bg-red-100 p-4 rounded-xl shadow">
            <h4 className="text-lg font-medium">Total Expense</h4>
            <p className="text-xl font-bold text-red-700">
              ₹{analytics.totalExpense}
            </p>
          </div>
          <div className="bg-blue-100 p-4 rounded-xl shadow">
            <h4 className="text-lg font-medium">Net Savings</h4>
            <p className="text-xl font-bold text-blue-700">₹{analytics.net}</p>
          </div>
        </div>

        {/* Pie Chart: Expense by Category */}
        <div className="mb-10">
          <h3 className="text-xl font-semibold mb-2">
            Category-wise Expense Split
          </h3>
          <div className="flex justify-center w-full">
            <PieChart width={400} height={300}>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                label
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>
        </div>

        {/* Bar Chart: Budgeted vs Spent */}
        <div className="mb-10">
          <h3 className="text-xl font-semibold mb-2">Budgeted vs Spent</h3>
          <BarChart
            width={600}
            height={300}
            data={analytics.budgetVsSpent}
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="budgeted" fill="#8884d8" />
            <Bar dataKey="spent" fill="#82ca9d" />
          </BarChart>
        </div>

        {/* Top 3 Expense Categories */}
        <div>
          <h3 className="text-xl font-semibold mb-2">
            Top 3 Expense Categories
          </h3>
          <ul className="list-disc ml-6">
            {analytics.topCategories.map((item, index) => (
              <li key={index}>
                {item.category}: ₹{item.amount}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analyicts;
