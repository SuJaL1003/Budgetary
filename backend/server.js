require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoute = require("./routes/authRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const analytics = require("./routes/analyticsRoutes");

const app = express();

//DATABASE CONNECTION
const connectDB = require("./db/db");
connectDB();

//MIDDLEWARES
app.use(cors());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://budgetaryy.onrender.com"],
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PORT = process.env.PORT;

app.use("/api/auth", authRoute);
app.use("/api/transactions", transactionRoutes);
app.use("/api/budget", budgetRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/analytics", analytics);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
