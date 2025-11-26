const express = require('express');
const {
  getMe,
  updateMe,
  getCompanies,
  getCompanyById,
  getUserById,
  getChatUsers,
} = require('../controllers/userController');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.get('/me', auth, getMe);
router.patch('/me', auth, updateMe);
router.get('/chat/users', auth, getChatUsers);
router.get('/companies', getCompanies);
router.get('/companies/:id', getCompanyById);
router.get('/:id', auth, getUserById);

module.exports = router;

