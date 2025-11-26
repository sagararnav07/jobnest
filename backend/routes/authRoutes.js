const express = require('express');
const {
  register,
  login,
  logout,
  forgotPassword,
  verifyEmail,
} = require('../controllers/authController');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.post('/verify-email', auth, verifyEmail);

module.exports = router;

