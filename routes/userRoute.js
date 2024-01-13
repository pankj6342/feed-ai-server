const express = require('express');
const router = express.Router();     
const userController= require('../controller/userController');
const fetchuser = require('../middleware/fetchuser');

router.post('/signup',userController.signup);
router.post('/login',userController.login);
router.post('/confirmEmail',userController.confirmEmail);
router.post('/sendEmail',userController.emailSend);
router.get('/getPosts', userController.getAllPostsForUser);
router.get('/getUserData', fetchuser, userController.getUserData);
module.exports = router;