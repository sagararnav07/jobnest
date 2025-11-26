const Review = require('../models/Review');
const asyncHandler = require('../utils/asyncHandler');

exports.createReview = asyncHandler(async (req, res) => {
  const { receiverEmail, rating, description } = req.body;
  if (!receiverEmail || !rating) {
    return res.status(400).json({ message: 'Receiver and rating required' });
  }

  const review = await Review.create({
    receiverEmail,
    rating,
    description,
    userEmail: req.user.email,
    userName: req.user.displayName,
  });
  res.status(201).json({ review });
});

exports.getReviewsByCompany = asyncHandler(async (req, res) => {
  const { email } = req.query;
  if (!email) {
    return res.status(400).json({ message: 'Company email required' });
  }
  const reviews = await Review.find({ receiverEmail: email }).sort({
    createdAt: -1,
  });
  res.json({ reviews });
});

exports.getReviewsByUser = asyncHandler(async (req, res) => {
  const { email } = req.params;
  const reviews = await Review.find({ userEmail: email }).sort({
    createdAt: -1,
  });
  res.json({ reviews });
});

exports.deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findOne({
    _id: req.params.id,
    userEmail: req.user.email,
  });
  if (!review) {
    return res.status(404).json({ message: 'Review not found' });
  }
  await review.deleteOne();
  res.json({ message: 'Review removed' });
});

