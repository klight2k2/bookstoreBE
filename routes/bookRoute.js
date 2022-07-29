const router = require('express').Router();
const bookController = require('../controllers/BookController');

router.get('/trending', bookController.getTrendingBook);
module.exports = router;
