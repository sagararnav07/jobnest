const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema(
  {
    street: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    zip: { type: String, default: '' },
    country: { type: String, default: '' },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    displayName: { type: String, trim: true },
    first_name: { type: String, trim: true },
    last_name: { type: String, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    photoURL: {
      type: String,
      default:
        'https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg',
    },
    userPhone: { type: String, default: '' },
    category: {
      type: String,
      enum: ['undergraduate', 'jobseeker', 'company', 'other'],
      default: 'jobseeker',
    },
    address: { type: addressSchema, default: () => ({}) },
    emailVerified: { type: Boolean, default: false },
    role: { type: String, default: 'user' },
    provider: { type: String, default: 'local' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);

