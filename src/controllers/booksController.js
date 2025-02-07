const bookModel = require('../models/bookModel');

const getAllBooks = async (req, res) => {
  try {
    const books = await bookModel.getAllBooks();
    res.status(200).json(books); // Ensure the response is in JSON format
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

const addBook = async (req, res) => {
  const { title, author, rating, notes } = req.body;
  try {
    const newBook = await bookModel.addBook(title, author, rating, notes);
    res.status(201).json({ message: 'Book added successfully', book: newBook });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

const updateBook = async (req, res) => {
  const { id } = req.params;
  const { title, author, rating, notes } = req.body;
  try {
    const updatedBook = await bookModel.updateBook(id, title, author, rating, notes);
    res.status(200).json({ message: 'Book updated successfully', book: updatedBook });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

const deleteBook = async (req, res) => {
  const { id } = req.params;
  try {
    await bookModel.deleteBook(id);
    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

const getBooksSorted = async (req, res) => {
  const { sortBy } = req.query;
  try {
    const books = await bookModel.getBooksSorted(sortBy);
    res.status(200).json(books); // Ensure the response is in JSON format
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  getAllBooks,
  addBook,
  updateBook,
  deleteBook,
  getBooksSorted,
};