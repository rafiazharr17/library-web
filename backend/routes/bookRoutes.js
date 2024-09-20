const express = require("express");
const router = express.Router();
const Book = require("../models/Book");
const { authenticateUser, authorizeAdmin } = require("../middleware/auth");

// Get all books (public)
router.get("/", async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching books", error: error.message });
  }
});

// Add a new book (admin only)
router.post("/", authenticateUser, authorizeAdmin, async (req, res) => {
  try {
    console.log("Received request to add book:", req.body);
    const newBook = new Book(req.body);
    await newBook.save();
    console.log("Book added successfully:", newBook);
    res.status(201).json(newBook);
  } catch (error) {
    console.error("Error adding book:", error);
    res
      .status(400)
      .json({ message: "Error adding book", error: error.message });
  }
});

// Update a book (admin only)
router.put("/:id", authenticateUser, authorizeAdmin, async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.json(updatedBook);
  } catch (error) {
    console.error("Error updating book:", error);
    res
      .status(400)
      .json({ message: "Error updating book", error: error.message });
  }
});

// Delete a book (admin only)
router.delete("/:id", authenticateUser, authorizeAdmin, async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(204).end();
  } catch (error) {
    console.error("Error deleting book:", error);
    res
      .status(400)
      .json({ message: "Error deleting book", error: error.message });
  }
});

module.exports = router;
