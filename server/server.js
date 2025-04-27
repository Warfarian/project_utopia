require("dotenv").config();
const express = require("express");
const cors = require("cors");

// Import routes
const pinsRouter = require("./routes/pins");
const sheltersRouter = require("./routes/shelters");
const usersRouter = require("./routes/users");
const authRouter = require("./routes/authRouter");

const app = express();
const mongoose = require("mongoose");
mongoose
  .connect("mongodb://127.0.0.1:27017/DevPost", {})
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(
      `[${req.method}] ${req.originalUrl} - ${res.statusCode} (${duration}ms)`
    );
  });
  next();
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/pins", pinsRouter);
app.use("/api/shelters", sheltersRouter);
app.use("/api/users", usersRouter);
app.use("/api/auth", authRouter);

// Basic route for testing
app.get("/", (req, res) => {
  res.json({ message: "Project Utopia API" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
