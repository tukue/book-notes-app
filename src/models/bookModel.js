const axios = require('axios');
const pool = require('../../config/database');

// Get all books
const getAllBooks = async () => {
  const query = 'SELECT * FROM books';
  try {
    console.log('Executing query:', query);
    const result = await pool.query(query);
    console.log('Query result:', result.rows);
    const books = result.rows;

    for (const book of books) {
      const coverUrl = await fetchBookCover(book.title);
      book.coverUrl = coverUrl;
    }
    console.log('Updated books:', books);
    return books;
  } catch (err) {
    console.error('Error getting all books', err);
    throw err;
  }
};

// Fetch book cover from Open Library Covers API
const fetchBookCover = async (title) => {
  try {
    const response = await axios.get(`https://openlibrary.org/search.json?title=${encodeURIComponent(title)}`);
    if (response.status === 200 && response.data.docs && response.data.docs.length > 0) {
      const coverId = response.data.docs[0].cover_i;
      console.log('Cover ID:', coverId);
      if (coverId) {
        return `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`;
      }
    }
    return null;
  } catch (err) {
    console.error('Error fetching book cover', err);
    return null;
  }
};

// Add a new book
const addBook = async (title, author, rating, notes) => {
  const query = `
    INSERT INTO books (title, author, rating, notes)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const values = [title, author, rating, notes];
  try {
    console.log('Executing query:', query, 'with values:', values);
    const result = await pool.query(query, values);
    console.log('Query result:', result.rows[0]);
    console.log('Book added:', result.rows[0]);
    return result.rows[0];
  } catch (err) {
    console.error('Error adding new book', err);
    throw err;
  }
};

// Update a book
const updateBook = async (id, title, author, rating, notes) => {
  const query = `
    UPDATE books
    SET title = $1, author = $2, rating = $3, notes = $4
    WHERE id = $5
    RETURNING *;
  `;
  const values = [title, author, rating, notes, id];
  try {
    console.log('Executing query:', query, 'with values:', values);
    const result = await pool.query(query, values);
    console.log('Query result:', result.rows[0]);
    return result.rows[0];
  } catch (err) {
    console.error('Error updating book', err);
    throw err;
  }
};

// Delete a book
const deleteBook = async (id) => {
  const query = 'DELETE FROM books WHERE id = $1 RETURNING *;';
  const values = [id];
  try {
    console.log('Executing query:', query, 'with values:', values);
    const result = await pool.query(query, values);
    console.log('Query result:', result.rows[0]);
    return result.rows[0];
  } catch (err) {
    console.error('Error deleting book', err);
    throw err;
  }
};

// Get books sorted by rating or recency
const getBooksSorted = async (sortBy) => {
  let query;
  if (sortBy === 'rating') {
    query = 'SELECT * FROM books ORDER BY rating DESC';
  } else if (sortBy === 'recency') {
    query = 'SELECT * FROM books ORDER BY id DESC';
  } else {
    query = 'SELECT * FROM books';
  }

  try {
    console.log('Executing query:', query);
    const result = await pool.query(query);
    console.log('Query result:', result.rows);
    const books = result.rows;

    for (const book of books) {
      const coverUrl = await fetchBookCover(book.title);
      book.coverUrl = coverUrl;
    }
    console.log('Updated books:', books);
    return books;
  } catch (err) {
    console.error('Error getting sorted books', err);
    throw err;
  }
};

module.exports = {
  getAllBooks,
  addBook,
  updateBook,
  deleteBook,
  getBooksSorted,
};