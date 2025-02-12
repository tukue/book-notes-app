const axios = require('axios');
const pool = require('../../config/database');

// Mock data
const mockBooks = [
  { id: 1, title: 'Test Book 1', author: 'Test Author 1', rating: 5, notes: 'Test notes 1', coverUrl: 'https://covers.openlibrary.org/b/id/12345-L.jpg' },
  { id: 2, title: 'Test Book 2', author: 'Test Author 2', rating: 4, notes: 'Test notes 2', coverUrl: 'https://covers.openlibrary.org/b/id/12345-L.jpg' }
];

// Mock responses
const mockAxiosResponse = {
  status: 200,
  data: {
    docs: [{ cover_i: 12345 }]
  }
};

// Helper functions
const mockDatabaseQuery = (queryResult) => {
  pool.query.mockResolvedValue({ rows: queryResult });
};

const mockAxiosGet = (response) => {
  axios.get.mockResolvedValue(response);
};

const mockConsoleError = () => {
  return jest.spyOn(console, 'error').mockImplementation(() => {});
};

module.exports = {
  mockBooks,
  mockAxiosResponse,
  mockDatabaseQuery,
  mockAxiosGet,
  mockConsoleError
};