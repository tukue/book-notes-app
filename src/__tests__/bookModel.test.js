const axios = require('axios');
const pool = require('../../config/database');
const bookModel = require('../models/bookModel');
const {
  mockBooks,
  mockAxiosResponse,
  mockDatabaseQuery,
  mockAxiosGet,
  mockConsoleError
} = require('./testHelper.helper');

// Mock the database connection
jest.mock('../../config/database');
jest.mock('axios');

describe('Book Model', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchBookCover', () => {
    it('should fetch book cover URL from Open Library Covers API', async () => {
      mockAxiosGet(mockAxiosResponse);

      const coverUrl = await bookModel.fetchBookCover('Test Book');
      expect(coverUrl).toBe('https://covers.openlibrary.org/b/id/12345-L.jpg');
      expect(axios.get).toHaveBeenCalledWith('https://openlibrary.org/search.json?title=Test%20Book');
    });

    it('should return null if no cover ID is found', async () => {
      mockAxiosGet({ status: 200, data: { docs: [] } });

      const coverUrl = await bookModel.fetchBookCover('Test Book');
      expect(coverUrl).toBeNull();
    });

    it('should return null if an error occurs', async () => {
      const consoleErrorMock = mockConsoleError();
      axios.get.mockRejectedValue(new Error('API Error'));

      const coverUrl = await bookModel.fetchBookCover('Test Book');
      expect(coverUrl).toBeNull();
      expect(console.error).toHaveBeenCalledWith('Error fetching book cover:', expect.any(Error));

      consoleErrorMock.mockRestore();
    });
  });

  describe('getAllBooks', () => {
    it('should fetch all books from the database', async () => {
      const mockBooksWithCovers = mockBooks.map(book => ({
        ...book,
        coverUrl: 'https://covers.openlibrary.org/b/id/12345-L.jpg'
      }));
      mockDatabaseQuery(mockBooksWithCovers);
      mockAxiosGet(mockAxiosResponse);
    
      const books = await bookModel.getAllBooks();
      expect(books).toEqual(mockBooksWithCovers);
      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM books');
    });
    

    it('should fetch book covers for all books', async () => {
      mockDatabaseQuery(mockBooks);
      mockAxiosGet(mockAxiosResponse);

      const books = await bookModel.getAllBooks();
      const expectedBooks = mockBooks.map(book => ({
        ...book,
        coverUrl: 'https://covers.openlibrary.org/b/id/12345-L.jpg'
      }));
      expect(books).toEqual(expectedBooks);
    });

    it('should handle errors when fetching books from the database', async () => {
      const consoleErrorMock = mockConsoleError();
      pool.query.mockRejectedValue(new Error('Database Error'));

      await expect(bookModel.getAllBooks()).rejects.toThrow('Database Error');
      expect(console.error).toHaveBeenCalledWith('Error getting all books:', expect.any(Error));

      consoleErrorMock.mockRestore();
    });
  });

  describe('getBooksPaginated', () => {
    it('should fetch paginated books from the database', async () => {
      mockDatabaseQuery(mockBooks);

      const books = await bookModel.getBooksPaginated(10, 0);
      expect(books).toEqual(mockBooks);
      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM books LIMIT $1 OFFSET $2', [10, 0]);
    });

    it('should fetch book covers for paginated books', async () => {
      mockDatabaseQuery(mockBooks);
      mockAxiosGet(mockAxiosResponse);

      const books = await bookModel.getBooksPaginated(10, 0);
      const expectedBooks = mockBooks.map(book => ({
        ...book,
        coverUrl: 'https://covers.openlibrary.org/b/id/12345-L.jpg'
      }));
      expect(books).toEqual(expectedBooks);
    });

    it('should handle errors when fetching paginated books from the database', async () => {
      const consoleErrorMock = mockConsoleError();
      pool.query.mockRejectedValue(new Error('Database Error'));

      await expect(bookModel.getBooksPaginated(10, 0)).rejects.toThrow('Database Error');
      expect(console.error).toHaveBeenCalledWith('Error getting books with pagination:', expect.any(Error));

      consoleErrorMock.mockRestore();
    });
  });

describe('addBook', () => {
  it('should add a new book to the database', async () => {
    const newBook = { 
      title: 'Test Book', 
      author: 'Test Author', 
      rating: 5, 
      notes: 'Test notes' 
    };
    const mockResult = { ...newBook, id: 1 };
    
    // Mock the database query
    mockDatabaseQuery([mockResult]);
    
    // Mock the cover URL fetch
    mockAxiosGet(mockAxiosResponse);

    const result = await bookModel.addBook(
      newBook.title, 
      newBook.author, 
      newBook.rating, 
      newBook.notes
    );
    
    // Check the final result
    expect(result).toEqual({
      ...mockResult,
      coverUrl: 'https://covers.openlibrary.org/b/id/12345-L.jpg'
    });
    
    // Verify the database query was called correctly
    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO books'),
      [newBook.title, newBook.author, newBook.rating, newBook.notes]
    );
    
    // Verify the cover API was called
    expect(axios.get).toHaveBeenCalledWith(
      `https://openlibrary.org/search.json?title=${encodeURIComponent(newBook.title)}`
    );
  });

    it('should handle errors when adding a new book to the database', async () => {
      const consoleErrorMock = mockConsoleError();
      pool.query.mockRejectedValue(new Error('Database Error'));

      await expect(bookModel.addBook('Test Book', 'Test Author', 5, 'Test notes')).rejects.toThrow('Database Error');
      expect(console.error).toHaveBeenCalledWith('Error adding new book:', expect.any(Error));

      consoleErrorMock.mockRestore();
    });
  });

  describe('updateBook', () => {
    it('should update a book in the database', async () => {
      // Setup test data
      const updatedBook = {
        id: 1,
        title: 'Updated Test Book',
        author: 'Updated Test Author',
        rating: 4,
        notes: 'Updated test notes'
      };
  
      // Mock the database response
      mockDatabaseQuery([updatedBook]);
  
      // Mock the cover API response
      mockAxiosGet({
        status: 200,
        data: {
          docs: [{ cover_i: 12345 }]
        }
      });
  
      // Call the update function
      const result = await bookModel.updateBook(
        updatedBook.id,
        updatedBook.title,
        updatedBook.author,
        updatedBook.rating,
        updatedBook.notes
      );
  
      // Verify the result includes both the updated book data and cover URL
      expect(result).toEqual({
        ...updatedBook,
        coverUrl: 'https://covers.openlibrary.org/b/id/12345-L.jpg'
      });
  
      // Verify the database query was called with correct parameters
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE books'),
        [
          updatedBook.title,
          updatedBook.author,
          updatedBook.rating,
          updatedBook.notes,
          updatedBook.id
        ]
      );
    });
  
    it('should handle errors when updating a book', async () => {
      // Mock console.error to prevent error output in tests
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  
      // Setup test data
      const updatedBook = {
        id: 1,
        title: 'Updated Test Book',
        author: 'Updated Test Author',
        rating: 4,
        notes: 'Updated test notes'
      };
  
      // Mock database error
      pool.query.mockRejectedValue(new Error('Database error'));
  
      // Verify that the error is properly thrown
      await expect(bookModel.updateBook(
        updatedBook.id,
        updatedBook.title,
        updatedBook.author,
        updatedBook.rating,
        updatedBook.notes
      )).rejects.toThrow('Database error');
  
      // Verify that console.error was called with the correct message
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error updating book:',
        expect.any(Error)
      );
  
      // Restore console.error
      consoleErrorSpy.mockRestore();
    });
  
    // Clean up after each test
    afterEach(() => {
      jest.clearAllMocks();
    });
  });
  

  describe('deleteBook', () => {
    it('should delete a book from the database', async () => {
      const mockResult = { id: 1, title: 'Test Book', author: 'Test Author', rating: 5, notes: 'Test notes' };
      mockDatabaseQuery([mockResult]);

      const result = await bookModel.deleteBook(1);
      expect(result).toEqual(mockResult);
      expect(pool.query).toHaveBeenCalledWith('DELETE FROM books WHERE id = $1 RETURNING *;', [1]);
    });

    it('should handle errors when deleting a book from the database', async () => {
      const consoleErrorMock = mockConsoleError();
      pool.query.mockRejectedValue(new Error('Database Error'));

      await expect(bookModel.deleteBook(1)).rejects.toThrow('Database Error');
      expect(console.error).toHaveBeenCalledWith('Error deleting book:', expect.any(Error));

      consoleErrorMock.mockRestore();
    });
  });

  describe('getBooksSorted', () => {
    it('should fetch books sorted by rating from the database', async () => {
      mockDatabaseQuery(mockBooks);

      const books = await bookModel.getBooksSorted('rating');
      expect(books).toEqual(mockBooks);
      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM books ORDER BY rating DESC');
    });

    it('should fetch books sorted by recency from the database', async () => {
      mockDatabaseQuery(mockBooks);

      const books = await bookModel.getBooksSorted('recency');
      expect(books).toEqual(mockBooks);
      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM books ORDER BY id DESC');
    });

    it('should fetch book covers for sorted books', async () => {
      mockDatabaseQuery(mockBooks);
      mockAxiosGet(mockAxiosResponse);

      const books = await bookModel.getBooksSorted('rating');
      const expectedBooks = mockBooks.map(book => ({
        ...book,
        coverUrl: 'https://covers.openlibrary.org/b/id/12345-L.jpg'
      }));
      expect(books).toEqual(expectedBooks);
    });

    it('should handle errors when fetching sorted books from the database', async () => {
      const consoleErrorMock = mockConsoleError();
      pool.query.mockRejectedValue(new Error('Database Error'));

      await expect(bookModel.getBooksSorted('rating')).rejects.toThrow('Database Error');
      expect(console.error).toHaveBeenCalledWith('Error getting sorted books:', expect.any(Error));

      consoleErrorMock.mockRestore();
    });
  });
});