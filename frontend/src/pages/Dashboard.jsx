import React from "react";
import DashboardLayout from "../Layouts/DashboardLayout";
import { useAuth } from "../context/auth";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";

const Dashboard = () => {
  const [auth] = useAuth();
  const userName = auth?.user?.username;

  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [net, setNet] = useState(0);
  const [budgetUsed, setBudgetUsed] = useState(0);
  const [recentTxns, setRecentTxns] = useState([]);
  const [search, setSearch] = useState("");

  const fetchStats = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/transactions/stats`,
        {
          headers: { Authorization: `Bearer ${auth?.token}` },
        }
      );
      const incomeVal = data.income || 0;
      const expenseVal = data.expenses || 0;
      setIncome(incomeVal);
      setExpenses(expenseVal);
      setNet(incomeVal - expenseVal);

      const totalBudget = data.income;
      const usedPercent = ((expenseVal / totalBudget) * 100).toFixed(2);
      setBudgetUsed(usedPercent);
    } catch (err) {
      console.error("Failed to load stats:", err);
    }
  };
  const fetchRecentTransactions = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/transactions/get`,
        {
          headers: { Authorization: `Bearer ${auth?.token}` },
        }
      );
      if (data?.success) {
        const filtered = data.data
          .filter(
            (txn) =>
              txn.category.toLowerCase().includes(search.toLowerCase()) ||
              txn.note?.toLowerCase().includes(search.toLowerCase())
          )
          .slice(0, 5);
        setRecentTxns(filtered);
      }
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
    }
  };
  useEffect(() => {
    fetchStats();
  }, [auth?.token]); //Important t0 note pass ni kare toh show ni hoga kuch bhi**

  useEffect(() => {
    fetchRecentTransactions();
  }, [search, auth?.token]);
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 pt-0 pb-2">
        <h2 className="text-2xl font-semibold text-emerald-700 mb-6">
          Welcome back, {userName} 👋
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
          <div className="bg-white shadow rounded p-4 text-center">
            <p className="text-gray-600">Income</p>
            <h3 className="text-xl font-semibold text-green-600">₹{income}</h3>
          </div>
          <div className="bg-white shadow rounded p-4 text-center">
            <p className="text-gray-600">Expenses</p>
            <h3 className="text-xl font-semibold text-red-600">₹{expenses}</h3>
          </div>
          <div className="bg-white shadow rounded p-4 text-center">
            <p className="text-gray-600">Net Balance</p>
            <h3 className="text-xl font-semibold text-emerald-700">₹{net}</h3>
          </div>
          <div className="bg-white shadow rounded p-4 text-center">
            <p className="text-gray-600">Budget Used</p>
            <h3 className="text-xl font-semibold text-yellow-600">
              {budgetUsed}%
            </h3>
          </div>
        </div>
        {/* Saerch*/}
        {/* Search */}
        <div className="flex justify-end mb-4">
          <div className="relative w-full max-w-xs">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-emerald-600">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
                />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search by category or note..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
            />
          </div>
        </div>

        <div className="bg-white shadow rounded p-4 mt-6">
          <h3 className="text-lg font-semibold text-emerald-700 mb-4">
            Recent Transactions
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b">
                  <th className="p-2">Date</th>
                  <th className="p-2">Category</th>
                  <th className="p-2">Type</th>
                  <th className="p-2">Amount</th>
                  <th className="p-2">Note</th>
                </tr>
              </thead>
              <tbody>
                {recentTxns.length > 0 ? (
                  recentTxns.map((txn) => (
                    <tr key={txn._id} className="border-b">
                      <td className="p-2">
                        {new Date(txn.date).toLocaleDateString()}
                      </td>
                      <td className="p-2">{txn.category}</td>
                      {/* <td className="p-2">{txn.category?.category || "N/A"}</td> */}
                      <td className="p-2 capitalize text-sm font-medium text-gray-700">
                        <span
                          className={
                            txn.type === "income"
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        >
                          {txn.type}
                        </span>
                      </td>
                      <td className="p-2">₹{txn.amount}</td>
                      <td className="p-2">{txn.note || "-"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="p-2" colSpan={5}>
                      No recent transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
