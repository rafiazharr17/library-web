const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bookRoutes = require("./routes/bookRoutes");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const loanRoutes = require("./routes/loanRoutes");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const User = require("./models/User");
const bcrypt = require("bcryptjs");

async function initializeAdmin() {
  try {
    const adminUsername = "admin";
    const adminPassword = "admin123"; // Ganti dengan password yang lebih aman

    const existingAdmin = await User.findOne({ username: adminUsername });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      const adminUser = new User({
        username: adminUsername,
        password: hashedPassword,
        role: "admin",
      });
      await adminUser.save();
      console.log("Admin user created successfully");
      console.log("Admin hashed password:", hashedPassword); // Tambahkan log ini
    } else {
      console.log("Admin user already exists");
      // Jika admin sudah ada, update password-nya
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      existingAdmin.password = hashedPassword;
      await existingAdmin.save();
      console.log("Admin password updated");
      console.log("Admin hashed password:", hashedPassword); // Tambahkan log ini
    }
  } catch (error) {
    console.error("Error initializing admin user:", error);
  }
}

async function initializeUsers() {
  const users = [
    { username: "user1", role: "user" },
    { username: "user2", role: "user" },
    { username: "user3", role: "user" },
    { username: "user4", role: "user" },
  ];

  for (const userData of users) {
    try {
      const existingUser = await User.findOne({ username: userData.username });
      if (!existingUser) {
        const hashedPassword = await bcrypt.hash(userData.username, 10); // Menggunakan username sebagai password
        const newUser = new User({
          username: userData.username,
          password: hashedPassword,
          role: userData.role,
        });
        await newUser.save();
        console.log(`User ${userData.username} created successfully`);
        console.log(
          `Hashed password for ${userData.username}:`,
          hashedPassword
        );
      } else {
        // Update password jika user sudah ada
        const hashedPassword = await bcrypt.hash(userData.username, 10);
        existingUser.password = hashedPassword;
        await existingUser.save();
        console.log(`Password updated for existing user ${userData.username}`);
        console.log(
          `New hashed password for ${userData.username}:`,
          hashedPassword
        );
      }
    } catch (error) {
      console.error(
        `Error creating/updating user ${userData.username}:`,
        error
      );
    }
  }
}

const connectWithRetry = () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    })
    .then(() => {
      console.log("MongoDB connected successfully");
      setupRoutes();
      initializeAdmin();
      initializeUsers(); // Pastikan ini dipanggil
    })
    .catch((err) => {
      console.error("MongoDB connection error:", err);
      setTimeout(connectWithRetry, 5000);
    });
};

function setupRoutes() {
  app.use("/api/books", bookRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/auth", authRoutes);
  app.use("/api/loans", loanRoutes);

  // 404 handler should be after all routes
  app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
  });
}

connectWithRetry();

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ message: "An unexpected error occurred", error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
