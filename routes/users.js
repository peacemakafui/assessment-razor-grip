const { Router } = require('express');
const userController = require('../controller/userController');
const router = Router();

const auth = require('../middleware/auth');

router.get('/signup', userController.signup_get);

router.post('/signup',  userController.signup_post);

router.post('/login', userController.login_post);

router.post('/isTokenValid', userController.token_valid_post);

router.get('/profile',auth, userController.profile_get);

router.delete('/profile',auth,userController.profile_delete);


module.exports = router