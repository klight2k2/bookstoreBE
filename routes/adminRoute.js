const router = require('express').Router();
const adminController = require('../controllers/AdminController');
const storage = require('../middleware/storage');

router.get('/getUsers', adminController.getUsers);
router.get('/listbook', adminController.getAll);
router.post('/deleteUser', adminController.deleteUser);
router.post('/updateUser', adminController.updateUser);
router.post('/createUser', adminController.createUser);
router.get('/getAll', adminController.getAll);
router.post('/deleteBook', adminController.deleteBook);
router.get('/getAuthors', adminController.getAuthors);
router.get('/getAuthors', adminController.getAuthors);
router.post('/addBook',storage, adminController.addBook);

module.exports = router;
