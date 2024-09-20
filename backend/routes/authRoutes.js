const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const manualHashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// Login route
router.post("/login", async (req, res) => {
  console.log("Login request received:", req.body);
  try {
    const { username, password } = req.body;
    console.log("Login attempt for username:", username);

    // Find user by username
    const user = await User.findOne({ username });
    console.log("User found:", user);

    if (!user) {
      console.log(`User not found: ${username}`);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log(`Stored hashed password for ${username}:`, user.password);
    console.log(`Provided password:`, password);

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log(`Password match result:`, isMatch);

    if (!isMatch) {
      console.log(`Invalid password for user: ${username}`);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log(`User logged in successfully: ${username}, Role: ${user.role}`);
    res.json({ userId: user._id, role: user.role });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "An error occurred during login" });
  }
});

// Logout route can be removed as we're not using sessions anymore

module.exports = router;
