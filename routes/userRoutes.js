const express = require('express');

const userControlller = require('../controllers/usercontroller');
const authControlller = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authControlller.signup);
router.post('/login', authControlller.login);
router.get('/logout', authControlller.logout);
router.post('/forget-password', authControlller.forgetPassword);
router.patch('/reset-password/:token', authControlller.resetPassword);
//PROTECT ALL ROUTES AFTER THIS MIDDLEWARE
router.use(authControlller.protect);
router.patch('/update-my-password', authControlller.updatePassword);
router.get('/me', userControlller.getMe, userControlller.getUser);
router.patch(
  '/update-me',
  userControlller.uploadUserPhoto,
  userControlller.resizeUserPhoto,
  userControlller.updateMe
);
router.delete('/delete-me', userControlller.deleteMe);
router.use(authControlller.restrictTo('admin'));
router
  .route('/')
  .get(userControlller.getAllUsers)
  .post(userControlller.createUser);
router
  .route('/:id')
  .get(userControlller.getUser)
  .patch(userControlller.updateUser)
  .delete(userControlller.deleteUser);

module.exports = router;
