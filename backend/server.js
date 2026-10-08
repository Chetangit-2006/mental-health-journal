const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
const journalRoutes = require("./routes/journal");
const aiRoutes = require("./routes/ai");

const app = express();

app.use(cors());
app.use(express.json());

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/journal", journalRoutes);
app.use("/api/ai", aiRoutes);

// Simple backend test
app.get("/api/test", (req, res) => {
    res.json({
        message: "Backend test route is working!"
    });
});

// Home route
app.get("/", (req, res) => {
    res.json({
        message: "Mental Health Journal API is running!"
    });
});

// Database connection
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});