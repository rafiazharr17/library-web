const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { authenticateUser, authorizeAdmin } = require("../middleware/auth");

// Get all users (admin only)
router.get("/", authenticateUser, authorizeAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
});

// Get current user profile
router.get("/profile", authenticateUser, async (req, res) => {
  res.json(req.user);
});

module.exports = router;
