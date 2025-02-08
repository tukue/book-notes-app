const bookModel = require('../models/bookModel');

const getAllBooks = async (req, res) => {
  try {
    const books = await bookModel.getAllBooks();
    res.render('book', { books }); // Render the book.ejs template with the books data
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

const getBooksPaginated = async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 10; // Default limit is 10
  const offset = parseInt(req.query.offset, 10) || 0; // Default offset is 0
  try {
    const books = await bookModel.getBooksPaginated(limit, offset);
    res.render('book', { books }); // Render the book.ejs template with the books data
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

const addBook = async (req, res) => {
  const { title, author, rating, notes } = req.body;
  try {
    await bookModel.addBook(title, author, rating, notes);
    res.redirect('/books'); // Redirect to the /books page
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

const updateBook = async (req, res) => {
  const { id } = req.params;
  const { title, author, rating, notes } = req.body;
  try {
    await bookModel.updateBook(id, title, author, rating, notes);
    res.redirect('/books'); // Redirect to the /books page
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};
const deleteBook = async (req, res) => {
  const { id } = req.params;
  try {
    await bookModel.deleteBook(id);
    res.redirect('/books'); // Redirect to the /books page
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

const getBooksSorted = async (req, res) => {
  const { sortBy } = req.query;
  try {
    const books = await bookModel.getBooksSorted(sortBy);
    res.render('book', { books }); // Render the book.ejs template with the sorted books data
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
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