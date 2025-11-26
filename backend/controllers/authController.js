const bcrypt = require('bcryptjs');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const generateToken = require('../utils/generateToken');
const formatUser = require('../utils/formatUser');

const setAuthCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

const buildDisplayName = (body) => {
  if (body.category === 'company' && body.company) {
    return body.company;
  }
  if (body.first_name || body.last_name) {
    return `${body.first_name || ''} ${body.last_name || ''}`.trim();
  }
  return body.displayName || 'Job Nest User';
};

exports.register = asyncHandler(async (req, res) => {
  const {
    email,
    password,
    userPhone,
    category,
    first_name,
    last_name,
    address = {},
    photoURL,
    company,
  } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(409).json({ message: 'User already exists' });
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({
    email,
    password: hashed,
    userPhone,
    category,
    first_name,
    last_name,
    address,
    photoURL,
    displayName: buildDisplayName({ category, company, first_name, last_name }),
    emailVerified: category === 'company' ? false : true,
  });

  const token = generateToken(user._id, user.email, user.role);
  setAuthCookie(res, token);

  res.status(201).json({
    token,
    user: formatUser(user.toObject()),
  });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = generateToken(user._id, user.email, user.role);
  setAuthCookie(res, token);

  res.json({
    token,
    user: formatUser(user.toObject()),
  });
});

exports.logout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
};

exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  // Placeholder for email service integration.
  console.log(`Password reset requested for ${email}`);
  res.json({ message: 'If that account exists we emailed reset instructions.' });
});

exports.verifyEmail = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { emailVerified: true },
    { new: true }
  );
  res.json({ user: formatUser(user.toObject()) });
});

