import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/auth";
import { toast } from "react-toastify";
import DashboardLayout from "../Layouts/DashboardLayout";

const AddExpense = () => {
  const [auth] = useAuth();

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState("monthly");
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
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "/api/transactions/create",
        {
          type: "expense",
          amount,
          category,
          date,
          note,
          isRecurring,
          frequency: isRecurring ? frequency : null,
        },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      toast.success("Expense added successfully!");

      // Reset fields
      setAmount("");
      setCategory("");
      setDate("");
      setNote("");
      setIsRecurring(false);
      setFrequency("monthly");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add expense.");
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold text-emerald-700 mb-4">
          Add Expense
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border p-3 rounded"
            required
          />

          {/* Category dropdown */}
          <select
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
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
          {/* <input
            type="text"
            name="category"
            placeholder="Category (e.g. Rent, Food)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border p-3 rounded"
            required
          /> */}

          <input
            type="date"
            name="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border p-3 rounded"
            required
          />

          <textarea
            name="note"
            placeholder="Note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full border p-3 rounded"
          />

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
            />
            <label className="text-gray-700">
              Is this a recurring expense?
            </label>
          </div>

          {isRecurring && (
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="w-full border p-3 rounded"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          )}

          <button
            type="submit"
            className="bg-emerald-600 text-white px-6 py-2 rounded hover:bg-emerald-700"
          >
            Add Expense
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default AddExpense;
