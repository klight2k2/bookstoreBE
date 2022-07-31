const authRoute = require('./authRoute');
const bookRoute = require('./bookRoute');
const userRoute = require('./userRoute');
const router = require('express').Router();


router.use('/auth', authRoute);
router.use('/book', bookRoute);
router.use('/user', userRoute);
module.exports =router;
// function route(app){
//     app.use('/auth', authRoute);
//     app.use('/book', bookRoute);
// }
