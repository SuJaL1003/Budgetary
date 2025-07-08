import React from "react";
import { toast } from "react-toastify";
import { useAuth } from "../context/auth";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";

const Transactions = () => {
  const [auth] = useAuth();
  const token = auth?.token;
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.post(
          "/api/transactions/get",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTransactions(res.data.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch transactions");
      } finally {
        setLoading(false);
      }
    };
    if (token) {
      fetchTransactions();
    }
  }, [token]);

  return (
    // <DashboardLayout>
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-2xl font-semibold text-emerald-700 mb-4">
        Your Transactions
      </h2>
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : transactions.length === 0 ? (
        <p className="text-gray-600">No transactions found.</p>
      ) : (
        <table className="w-full table-auto border">
          <thead>
            <tr className="bg-emerald-100 text-emerald-800">
              <th className="p-2 text-left">Type</th>
              <th className="p-2 text-left">Category</th>
              <th className="p-2 text-left">Amount</th>
              <th className="p-2 text-left">Date</th>
              <th className="p-2 text-left">Recurring</th>
              <th className="p-2 text-left">Note</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn) => (
              <tr key={txn._id} className="border-t hover:bg-emerald-50">
                <td className="p-2 capitalize">{txn.type}</td>
                <td className="p-2">{txn.category}</td>
                <td className="p-2">₹{txn.amount}</td>
                <td className="p-2">
                  {new Date(txn.date).toLocaleDateString()}
                </td>
                <td className="p-2">
                  {txn.isRecurring ? txn.frequency : "No"}
                </td>
                <td className="p-2">{txn.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
    // </DashboardLayout>
  );
};

export default Transactions;
