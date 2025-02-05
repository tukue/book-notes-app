const pool = require('../../config/database');

// Get all books
const getAllBooks = async () => {
  const query = 'SELECT * FROM books';
  try {
    const result = await pool.query(query);
    return result.rows;
  } catch (err) {
    console.error('Error getting all books', err);
    throw err;
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
    const result = await pool.query(query, values);
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
    const result = await pool.query(query, values);
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
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (err) {
    console.error('Error deleting book', err);
    throw err;
  }
};

module.exports = {
  getAllBooks,
  addBook,
  updateBook,
  deleteBook,
};