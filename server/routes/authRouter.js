const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Register new user
router.post("/register", async (req, res) => {
  try {
    console.log(
      "[POST] /api/auth/register - Registering new user:",
      req.body.email
    );

    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      console.log("[POST] /api/auth/register - Missing required fields");
      return res
        .status(400)
        .json({ error: "Name, email, and password are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("[POST] /api/auth/register - Email already registered");
      return res.status(400).json({ error: "Email already registered" });
    }

    // Create new user
    const user = new User({
      id: Date.now().toString(),
      name,
      email,
      password,
      joinedAt: new Date(),
    });

    await user.save();

    // Generate JWT with 7-day validity
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || "your_jwt_secret", // Replace with env variable in production
      { expiresIn: "7d" }
    );

    console.log("[POST] /api/auth/register - User registered:", user.id);
    res.status(201).json({
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("[POST] /api/auth/register - Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Login existing user
router.post("/login", async (req, res) => {
  try {
    console.log("[POST] /api/auth/login - Logging in user:", req.body.email);

    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      console.log("[POST] /api/auth/login - Missing email or password");
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      console.log("[POST] /api/auth/login - User not found");
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log("[POST] /api/auth/login - Invalid password");
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT with 7-day validity
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || "Vhagar_Arsh_FemBoi", // Replace with env variable in production
      { expiresIn: "7d" }
    );

    console.log("[POST] /api/auth/login - User logged in:", user.id);
    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("[POST] /api/auth/login - Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
