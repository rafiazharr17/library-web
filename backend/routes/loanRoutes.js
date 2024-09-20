const express = require("express");
const router = express.Router();
const Loan = require("../models/Loan");
const Book = require("../models/Book");
const { authenticateUser } = require("../middleware/auth");

// Pinjam buku
router.post("/", authenticateUser, async (req, res) => {
  try {
    const { bookId } = req.body;
    const book = await Book.findById(bookId);
    if (!book || !book.available) {
      return res.status(400).json({ message: "Buku tidak tersedia" });
    }
    const loan = new Loan({ user: req.user._id, book: bookId });
    await loan.save();
    book.available = false;
    await book.save();
    res.status(201).json(loan);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Dapatkan semua peminjaman
router.get("/", authenticateUser, async (req, res) => {
  try {
    const loans = await Loan.find({ user: req.user._id }).populate("book");
    res.json(loans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Dapatkan semua peminjaman (admin only)
router.get("/all", authenticateUser, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Akses ditolak" });
  }
  try {
    const loans = await Loan.find().populate("user").populate("book");
    res.json(loans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Kembalikan buku
router.post("/return", authenticateUser, async (req, res) => {
  try {
    const { loanId } = req.body;
    const loan = await Loan.findById(loanId);
    if (!loan) {
      return res.status(404).json({ message: "Peminjaman tidak ditemukan" });
    }
    if (loan.returnDate) {
      return res.status(400).json({ message: "Buku sudah dikembalikan" });
    }
    loan.returnDate = new Date();
    await loan.save();
    const book = await Book.findById(loan.book);
    book.available = true;
    await book.save();
    res.json({ message: "Buku berhasil dikembalikan" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
