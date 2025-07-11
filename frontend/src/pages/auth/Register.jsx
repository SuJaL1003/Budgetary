import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

const Register = () => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        // `${import.meta.env.VITE_API_BASE_URL}
        `/api/auth/register`,
        {
          username,
          email,
          password,
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/login");
      } else {
        toast.error(res.data.message || "Registration failed");
      }
    } catch (error) {
      console.error(error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something Went Wrong!");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-emerald-100 via-white to-emerald-200 backdrop-blur-2xl flex items-center justify-center overflow-hidden">
      <div className="w-full max-w-md p-8 bg-white/40 backdrop-blur-md rounded-2xl shadow-md relative">
        <h2 className="text-3xl font-bold text-emerald-700 text-center mb-6">
          Create an Account
        </h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <input
            name="name"
            type="text"
            required
            placeholder="Full Name"
            value={username}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full p-3 rounded-lg bg-white/70 placeholder-emerald-700 text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
          <input
            name="email"
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-lg bg-white/70 placeholder-emerald-700 text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />

          {/* Password Input with toggle */}
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg bg-white/70 placeholder-emerald-700 text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-400 pr-16"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-emerald-700 hover:underline focus:outline-none"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-lg font-semibold transition duration-300"
          >
            Register
          </button>
        </form>

        <p className="text-center mt-4 text-emerald-800">
          Already have an account?{" "}
          <Link to="/login" className="text-emerald-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
      <ToastContainer position="top-center" />
    </div>
  );
};

export default Register;
