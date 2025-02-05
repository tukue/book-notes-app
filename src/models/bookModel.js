// Mock data
let books = [
  { id: 1, title: 'Mock Book 1', author: 'Author 1', rating: 5, notes: 'Notes for book 1' },
  { id: 2, title: 'Mock Book 2', author: 'Author 2', rating: 4, notes: 'Notes for book 2' },
];

// Get all books
const getAllBooks = async () => {
  return books;
};

// Add a new book
const addBook = async (title, author, rating, notes) => {
  const newBook = {
    id: books.length + 1,
    title,
    author,
    rating,
    notes,
  };
  books.push(newBook);
  return newBook;
};

// Update a book
const updateBook = async (id, title, author, rating, notes) => {
  const index = books.findIndex(book => book.id === parseInt(id));
  if (index !== -1) {
    books[index] = { id: parseInt(id), title, author, rating, notes };
    return books[index];
  }
  return null;
};

const deleteBook = async (id) => {
  const index = books.findIndex(book => book.id === parseInt(id));
  if (index !== -1) {
    const deletedBook = books.splice(index, 1);
    return deletedBook[0];
  }
  return null;
};

module.exports = {
  getAllBooks,
  addBook,
  updateBook,
  deleteBook,
};