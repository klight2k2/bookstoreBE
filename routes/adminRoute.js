const router = require('express').Router();
const adminController = require('../controllers/AdminController');

router.get('/getUsers', adminController.getUsers);
router.get('/listbook', adminController.getAll);

module.exports = router;
