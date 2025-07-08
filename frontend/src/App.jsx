import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import VerifyEmail from "./pages/auth/VerifyEmail";
import ResetPassword from "./pages/auth/ResetPassword";
import Transactions from "./pages/Transactions";
import HomePage from "./pages/HomePage";
import PageNotFound from "./pages/PageNotFound";
import AddExpense from "./pages/AddExpense";
import AddIncome from "./pages/AddIncome";
import Analytics from "./pages/Analyicts";
import BudgetSetting from "./pages/BudgetSetting";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import Dashboard from "./pages/Dashboard";

function App() {
  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      <Route path="/transactions" element={<Transactions />} />
      <Route path="/dash" element={<Dashboard />} />
      <Route path="/add-expense" element={<AddExpense />} />
      <Route path="/add-income" element={<AddIncome />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/budget" element={<BudgetSetting />} />

      {/* <Route path="*" element={<PageNotFound />} /> */}
    </Routes>
  );
}

export default App;
