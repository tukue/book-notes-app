const request = require('supertest');
const app = require('../app');
const booksModel = require('../models/bookModel');

// Mock the database connection
jest.mock('../models/bookModel');

describe('Books API', () => {
  it('should get all books', async () => {
    const mockBooks = [
      { id: 1, title: 'Test Book 1', author: 'Test Author 1', rating: 5, notes: 'Test notes 1' },
      { id: 2, title: 'Test Book 2', author: 'Test Author 2', rating: 4, notes: 'Test notes 2' }
    ];
    booksModel.getAllBooks.mockResolvedValue(mockBooks);

    const response = await request(app).get('/books');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockBooks);
  });

  it('should add a new book', async () => {
    const newBook = {
      title: 'Test Book',
      author: 'Test Author',
      rating: 5,
      notes: 'Test notes'
    };
    booksModel.addBook.mockResolvedValue(newBook);

    const response = await request(app).post('/books').send(newBook);
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Book added successfully');
    expect(response.body.book).toEqual(newBook);
  });

  it('should update a book', async () => {
    const updatedBook = {
      title: 'Updated Test Book',
      author: 'Updated Test Author',
      rating: 4,
      notes: 'Updated test notes'
    };
    booksModel.updateBook.mockResolvedValue(updatedBook);

    const response = await request(app).put('/books/1').send(updatedBook);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Book updated successfully');
    expect(response.body.book).toEqual(updatedBook);
  });

  it('should delete a book', async () => {
    booksModel.deleteBook.mockResolvedValue({});

    const response = await request(app).delete('/books/1');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Book deleted successfully');
  });
});