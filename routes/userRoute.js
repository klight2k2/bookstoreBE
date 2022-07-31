const router = require('express').Router();
const userController = require('../controllers/UserController');
const auth=require('../middleware/auth')
const storage = require('../middleware/storage');

router.post('/orders', auth,userController.orders);

//update user
// delete user
// get a user

module.exports = router;
