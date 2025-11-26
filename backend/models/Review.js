const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    userEmail: { type: String, required: true },
    userName: { type: String, required: true },
    receiverEmail: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    description: { type: String, default: '' },
  },
  { timestamps: true }
);

reviewSchema.index({ receiverEmail: 1 });
reviewSchema.index({ userEmail: 1 });

module.exports = mongoose.model('Review', reviewSchema);

