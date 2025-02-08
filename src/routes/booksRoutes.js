const express = require('express');
const router = express.Router();
const booksController = require('../controllers/booksController');

router.get('/', booksController.getAllBooks);
router.get('/paginated', booksController.getBooksPaginated);
router.post('/', booksController.addBook);
router.put('/:id', booksController.updateBook);
router.delete('/:id', booksController.deleteBook);
router.get('/sorted', booksController.getBooksSorted);

module.exports = router;