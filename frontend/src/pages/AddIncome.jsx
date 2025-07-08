import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/auth";
import { toast } from "react-toastify";
import DashboardLayout from "../Layouts/DashboardLayout";

const AddIncome = () => {
  const [auth] = useAuth();
  const token = auth?.token;

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || !category || !date) {
      return toast.error("Please fill all required fields");
    }

    const payload = {
      type: "income",
      amount,
      category,
      date,
      note,
      isRecurring,
    };

    if (isRecurring && frequency) {
      payload.frequency = frequency;
    }

    try {
      const res = await axios.post("/api/transactions/create", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Income added successfully ✅");
      // Clear form
      setAmount("");
      setCategory("");
      setDate("");
      setNote("");
      setIsRecurring(false);
      setFrequency("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add income");
    }
  };

  return (
    <DashboardLayout>
      <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto mt-6">
        <h2 className="text-2xl font-semibold text-emerald-600 mb-4">
          Add Income
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="number"
            placeholder="Amount (₹)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            required
          />

          <input
            type="text"
            placeholder="Category (e.g., Salary, Freelance)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            required
          />

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            required
          />

          <textarea
            placeholder="Note (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
          />

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="recurring"
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
            />
            <label htmlFor="recurring" className="text-gray-700">
              Is this recurring income?
            </label>
          </div>

          {isRecurring && (
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
              required
            >
              <option value="">Select Frequency</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          )}

          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-2 rounded-md"
          >
            Add Income
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default AddIncome;
