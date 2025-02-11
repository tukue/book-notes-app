const axios = require('axios');
const pool = require('../../config/database');
const bookModel = require('../models/bookModel');

// Mock the database connection
jest.mock('../../config/database');
jest.mock('axios');

describe('Book Model', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchBookCover', () => {
    it('should fetch book cover URL from Open Library Covers API', async () => {
      const mockResponse = {
        status: 200,
        data: {
          docs: [{ cover_i: 12345 }]
        }
      };
      axios.get.mockResolvedValue(mockResponse);

      const coverUrl = await bookModel.fetchBookCover('Test Book');
      expect(coverUrl).toBe('https://covers.openlibrary.org/b/id/12345-L.jpg');
      expect(axios.get).toHaveBeenCalledWith('https://openlibrary.org/search.json?title=Test%20Book');
    });

    it('should return null if no cover ID is found', async () => {
      const mockResponse = {
        status: 200,
        data: {
          docs: []
        }
      };
      axios.get.mockResolvedValue(mockResponse);

      const coverUrl = await bookModel.fetchBookCover('Test Book');
      expect(coverUrl).toBeNull();
    });

    it('should return null if an error occurs', async () => {
      const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
      axios.get.mockRejectedValue(new Error('API Error'));

      const coverUrl = await bookModel.fetchBookCover('Test Book');
      expect(coverUrl).toBeNull();
      expect(console.error).toHaveBeenCalledWith('Error fetching book cover:', expect.any(Error));

      consoleErrorMock.mockRestore();
    });
  });

  describe('getAllBooks', () => {
    it('should fetch all books from the database', async () => {
      const mockBooks = [
        { id: 1, title: 'Test Book 1', author: 'Test Author 1', rating: 5, notes: 'Test notes 1', coverUrl: null },
        { id: 2, title: 'Test Book 2', author: 'Test Author 2', rating: 4, notes: 'Test notes 2', coverUrl: null }
      ];
      pool.query.mockResolvedValue({ rows: mockBooks });

      const books = await bookModel.getAllBooks();
      expect(books).toEqual(mockBooks);
      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM books');
    });

    it('should fetch book covers for all books', async () => {
      const mockBooks = [
        { id: 1, title: 'Test Book 1', author: 'Test Author 1', rating: 5, notes: 'Test notes 1' },
        { id: 2, title: 'Test Book 2', author: 'Test Author 2', rating: 4, notes: 'Test notes 2' }
      ];
      pool.query.mockResolvedValue({ rows: mockBooks });
      axios.get.mockResolvedValue({
        status: 200,
        data: {
          docs: [{ cover_i: 12345 }]
        }
      });

      const books = await bookModel.getAllBooks();
      expect(books).toEqual([
        { id: 1, title: 'Test Book 1', author: 'Test Author 1', rating: 5, notes: 'Test notes 1', coverUrl: 'https://covers.openlibrary.org/b/id/12345-L.jpg' },
        { id: 2, title: 'Test Book 2', author: 'Test Author 2', rating: 4, notes: 'Test notes 2', coverUrl: 'https://covers.openlibrary.org/b/id/12345-L.jpg' }
      ]);
    });

    it('should handle errors when fetching books from the database', async () => {
      const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
      pool.query.mockRejectedValue(new Error('Database Error'));

      await expect(bookModel.getAllBooks()).rejects.toThrow('Database Error');
      expect(console.error).toHaveBeenCalledWith('Error getting all books:', expect.any(Error));

      consoleErrorMock.mockRestore();
    });
  });

  describe('getBooksPaginated', () => {
    it('should fetch paginated books from the database', async () => {
      const mockBooks = [
        { id: 1, title: 'Test Book 1', author: 'Test Author 1', rating: 5, notes: 'Test notes 1', coverUrl: 'https://covers.openlibrary.org/b/id/12345-L.jpg' },
        { id: 2, title: 'Test Book 2', author: 'Test Author 2', rating: 4, notes: 'Test notes 2', coverUrl: 'https://covers.openlibrary.org/b/id/12345-L.jpg' }
      ];
      pool.query.mockResolvedValue({ rows: mockBooks });

      const books = await bookModel.getBooksPaginated(10, 0);
      expect(books).toEqual(mockBooks);
      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM books LIMIT $1 OFFSET $2', [10, 0]);
    });

    it('should fetch book covers for paginated books', async () => {
      const mockBooks = [
        { id: 1, title: 'Test Book 1', author: 'Test Author 1', rating: 5, notes: 'Test notes 1' },
        { id: 2, title: 'Test Book 2', author: 'Test Author 2', rating: 4, notes: 'Test notes 2' }
      ];
      pool.query.mockResolvedValue({ rows: mockBooks });
      axios.get.mockResolvedValue({
        status: 200,
        data: {
          docs: [{ cover_i: 12345 }]
        }
      });

      const books = await bookModel.getBooksPaginated(10, 0);
      expect(books).toEqual([
        { id: 1, title: 'Test Book 1', author: 'Test Author 1', rating: 5, notes: 'Test notes 1', coverUrl: 'https://covers.openlibrary.org/b/id/12345-L.jpg' },
        { id: 2, title: 'Test Book 2', author: 'Test Author 2', rating: 4, notes: 'Test notes 2', coverUrl: 'https://covers.openlibrary.org/b/id/12345-L.jpg' }
      ]);
    });

    it('should handle errors when fetching paginated books from the database', async () => {
      const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
      pool.query.mockRejectedValue(new Error('Database Error'));

      await expect(bookModel.getBooksPaginated(10, 0)).rejects.toThrow('Database Error');
      expect(console.error).toHaveBeenCalledWith('Error getting books with pagination:', expect.any(Error));

      consoleErrorMock.mockRestore();
    });
  });

  describe('addBook', () => {
    it.skip('should add a new book to the database', async () => {
      const newBook = { title: 'Test Book', author: 'Test Author', rating: 5, notes: 'Test notes' };
      const mockResult = { ...newBook, id: 1 };
      pool.query.mockResolvedValue({ rows: [mockResult] });

      const result = await bookModel.addBook(newBook.title, newBook.author, newBook.rating, newBook.notes);
      expect(result).toEqual(mockResult);
      expect(pool.query).toHaveBeenCalledWith(
        `
        INSERT INTO books (title, author, rating, notes)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
      `,
        [newBook.title, newBook.author, newBook.rating, newBook.notes]
      );
    });

    it('should handle errors when adding a new book to the database', async () => {
      const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
      pool.query.mockRejectedValue(new Error('Database Error'));

      await expect(bookModel.addBook('Test Book', 'Test Author', 5, 'Test notes')).rejects.toThrow('Database Error');
      expect(console.error).toHaveBeenCalledWith('Error adding new book:', expect.any(Error));

      consoleErrorMock.mockRestore();
    });
  });

  describe('updateBook', () => {
    it.skip('should update a book in the database', async () => {
      const updatedBook = { id: 1, title: 'Updated Test Book', author: 'Updated Test Author', rating: 4, notes: 'Updated test notes' };
      pool.query.mockResolvedValue({ rows: [updatedBook] });

      const result = await bookModel.updateBook(updatedBook.id, updatedBook.title, updatedBook.author, updatedBook.rating, updatedBook.notes);
      expect(result).toEqual(updatedBook);
      expect(pool.query).toHaveBeenCalledWith(
        `
        UPDATE books
        SET title = $1, author = $2, rating = $3, notes = $4
        WHERE id = $5
        RETURNING *;
      `,
        [updatedBook.title, updatedBook.author, updatedBook.rating, updatedBook.notes, updatedBook.id]
      );
    });

    it('should handle errors when updating a book in the database', async () => {
      const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
      pool.query.mockRejectedValue(new Error('Database Error'));

      await expect(bookModel.updateBook(1, 'Updated Test Book', 'Updated Test Author', 4, 'Updated test notes')).rejects.toThrow('Database Error');
      expect(console.error).toHaveBeenCalledWith('Error updating book:', expect.any(Error));

      consoleErrorMock.mockRestore();
    });
  });

  describe('deleteBook', () => {
    it('should delete a book from the database', async () => {
      const mockResult = { id: 1, title: 'Test Book', author: 'Test Author', rating: 5, notes: 'Test notes' };
      pool.query.mockResolvedValue({ rows: [mockResult] });

      const result = await bookModel.deleteBook(1);
      expect(result).toEqual(mockResult);
      expect(pool.query).toHaveBeenCalledWith('DELETE FROM books WHERE id = $1 RETURNING *;', [1]);
    });

    it('should handle errors when deleting a book from the database', async () => {
      const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
      pool.query.mockRejectedValue(new Error('Database Error'));

      await expect(bookModel.deleteBook(1)).rejects.toThrow('Database Error');
      expect(console.error).toHaveBeenCalledWith('Error deleting book:', expect.any(Error));

      consoleErrorMock.mockRestore();
    });
  });

  describe('getBooksSorted', () => {
    it('should fetch books sorted by rating from the database', async () => {
      const mockBooks = [
        { id: 1, title: 'Test Book 1', author: 'Test Author 1', rating: 5, notes: 'Test notes 1', coverUrl: 'https://covers.openlibrary.org/b/id/12345-L.jpg' },
        { id: 2, title: 'Test Book 2', author: 'Test Author 2', rating: 4, notes: 'Test notes 2', coverUrl: 'https://covers.openlibrary.org/b/id/12345-L.jpg' }
      ];
      pool.query.mockResolvedValue({ rows: mockBooks });

      const books = await bookModel.getBooksSorted('rating');
      expect(books).toEqual(mockBooks);
      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM books ORDER BY rating DESC');
    });

    it('should fetch books sorted by recency from the database', async () => {
      const mockBooks = [
        { id: 1, title: 'Test Book 1', author: 'Test Author 1', rating: 5, notes: 'Test notes 1', coverUrl: 'https://covers.openlibrary.org/b/id/12345-L.jpg' },
        { id: 2, title: 'Test Book 2', author: 'Test Author 2', rating: 4, notes: 'Test notes 2', coverUrl: 'https://covers.openlibrary.org/b/id/12345-L.jpg' }
      ];
      pool.query.mockResolvedValue({ rows: mockBooks });

      const books = await bookModel.getBooksSorted('recency');
      expect(books).toEqual(mockBooks);
      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM books ORDER BY id DESC');
    });

    it('should fetch book covers for sorted books', async () => {
      const mockBooks = [
        { id: 1, title: 'Test Book 1', author: 'Test Author 1', rating: 5, notes: 'Test notes 1', coverUrl: 'https://covers.openlibrary.org/b/id/12345-L.jpg' },
        { id: 2, title: 'Test Book 2', author: 'Test Author 2', rating: 4, notes: 'Test notes 2', coverUrl: 'https://covers.openlibrary.org/b/id/12345-L.jpg' }
      ];
      pool.query.mockResolvedValue({ rows: mockBooks });
      axios.get.mockResolvedValue({
        status: 200,
        data: {
          docs: [{ cover_i: 12345 }]
        }
      });

      const books = await bookModel.getBooksSorted('rating');
      expect(books).toEqual([
        { id: 1, title: 'Test Book 1', author: 'Test Author 1', rating: 5, notes: 'Test notes 1', coverUrl: 'https://covers.openlibrary.org/b/id/12345-L.jpg' },
        { id: 2, title: 'Test Book 2', author: 'Test Author 2', rating: 4, notes: 'Test notes 2', coverUrl: 'https://covers.openlibrary.org/b/id/12345-L.jpg' }
      ]);
    });

    it('should handle errors when fetching sorted books from the database', async () => {
      const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
      pool.query.mockRejectedValue(new Error('Database Error'));

      await expect(bookModel.getBooksSorted('rating')).rejects.toThrow('Database Error');
      expect(console.error).toHaveBeenCalledWith('Error getting sorted books:', expect.any(Error));

      consoleErrorMock.mockRestore();
    });
  });
});