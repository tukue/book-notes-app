const bookModel = require('../models/bookModel');

// Helper function to handle errors
const handleError = (res, error, message) => {
  console.error(message, error);
  res.status(500).send(`Server Error: ${message}`);
};

// Get all books
const getAllBooks = async (req, res) => {
  try {
    const books = await bookModel.getAllBooks();
    res.render('book', { books }); // Render the book.ejs template with the books data
  } catch (err) {
    handleError(res, err, 'Unable to fetch books');
  }
};

// Get books with pagination
const getBooksPaginated = async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 10; // Default limit is 10
  const offset = parseInt(req.query.offset, 10) || 0; // Default offset is 0
  try {
    const books = await bookModel.getBooksPaginated(limit, offset);
    res.render('book', { books }); // Render the book.ejs template with the books data
  } catch (err) {
    handleError(res, err, 'Unable to fetch paginated books');
  }
};

// Add a new book
const addBook = async (req, res) => {
  const { title, author, rating, notes } = req.body;

  // Validate input data
  if (!title || !author) {
    return res.status(400).send('Title and Author are required');
  }

  try {
    await bookModel.addBook(title, author, rating, notes);
    res.redirect('/books'); // Redirect to the /books page
  } catch (err) {
    handleError(res, err, 'Unable to add book');
  }
};

// Update a book
const updateBook = async (req, res) => {
  const { id } = req.params;
  const { title, author, rating, notes } = req.body;

  // Validate input data
  if (!title || !author) {
    return res.status(400).send('Title and Author are required');
  }

  try {
    await bookModel.updateBook(id, title, author, rating, notes);
    res.redirect('/books'); // Redirect to the /books page
  } catch (err) {
    handleError(res, err, 'Unable to update book');
  }
};

// Delete a book
const deleteBook = async (req, res) => {
  const { id } = req.params;
  try {
    await bookModel.deleteBook(id);
    res.redirect('/books'); // Redirect to the /books page
  } catch (err) {
    handleError(res, err, 'Unable to delete book');
  }
};

// Get books sorted by rating or recency
const getBooksSorted = async (req, res) => {
  const { sortBy } = req.query;
  try {
    const books = await bookModel.getBooksSorted(sortBy);
    res.render('book', { books }); // Render the book.ejs template with the sorted books data
  } catch (err) {
    handleError(res, err, 'Unable to fetch sorted books');
  }
};

module.exports = {
  getAllBooks,
  getBooksPaginated,
  addBook,
  updateBook,
  deleteBook,
  getBooksSorted,
};