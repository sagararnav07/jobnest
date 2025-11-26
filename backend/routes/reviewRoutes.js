const express = require('express');
const {
  createReview,
  getReviewsByCompany,
  getReviewsByUser,
  deleteReview,
} = require('../controllers/reviewController');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, createReview);
router.get('/', auth, getReviewsByCompany);
router.get('/user/:email', auth, getReviewsByUser);
router.delete('/:id', auth, deleteReview);

module.exports = router;

