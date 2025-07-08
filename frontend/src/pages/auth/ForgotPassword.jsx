import axios from "axios";
import React, { useState } from "react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      const { data } = await axios.post("/api/auth/forgot-password", { email });
      setMessage(data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-emerald-100 via-white to-emerald-200 backdrop-blur-2xl flex items-center justify-center overflow-hidden">
      <div className="w-full max-w-md p-8 bg-white/40 backdrop-blur-md rounded-2xl shadow-md">
        <h2 className="text-3xl font-bold text-emerald-700 text-center mb-6">
          Forgot Password
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-lg bg-white/70 placeholder-emerald-700 text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-lg font-semibold transition duration-300 disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
        {message && (
          <p className="text-center mt-4 text-emerald-800 font-medium">
            {message}
          </p>
        )}
        <p className="text-center mt-4 text-emerald-800">
          Remembered your password?{" "}
          <a href="/login" className="text-emerald-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
