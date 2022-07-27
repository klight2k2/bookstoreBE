const router = require('express').Router();
const userController = require('../controllers/UserController');
const storage = require('../middleware/storage');

router.get('/findall', userController.findAll);
router.delete('/:id/delete', userController.delete);
router.get('/:id/find', userController.find);
//update user
// delete user
// get a user
router.put('/:id', storage, userController.update);

module.exports = router;
