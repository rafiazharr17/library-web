const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  token: String,
  createdAt: { type: Date, expires: "1h", default: Date.now },
});

module.exports = mongoose.model("Session", sessionSchema);
