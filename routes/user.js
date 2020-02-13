const express = require('express');
const expressDeliver = require('express-deliver');
const router = express.Router();
const userController = require('../controllers/userController');

expressDeliver(router);

router.get('/', userController.getUser);
router.post('/login', userController.login);
router.post('/register', userController.register);
router.post('/register/verify', userController.verify);
router.post('/register/verify-resend', userController.verifyResend);
router.post('/register/forgot-password', userController.forgotPassword);
router.post('/register/change-password', userController.changePassword);
// router.get('/user/logout', userController.requireUser, userController.logOut)

module.exports = router;
