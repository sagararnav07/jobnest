const User = require('../models/User');
const Job = require('../models/Job');
const asyncHandler = require('../utils/asyncHandler');
const formatUser = require('../utils/formatUser');
const buildCompanySnapshot = require('../utils/companySnapshot');

exports.getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({ user: formatUser(user.toObject()) });
});

exports.updateMe = asyncHandler(async (req, res) => {
  const allowed = [
    'displayName',
    'first_name',
    'last_name',
    'userPhone',
    'photoURL',
    'address',
  ];

  const updates = {};
  allowed.forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  });

  if (user.category === 'company') {
    await Job.updateMany(
      { 'company.companyId': user._id },
      { $set: { company: buildCompanySnapshot(user) } }
    );
  }

  res.json({ user: formatUser(user.toObject()) });
});

exports.getCompanies = asyncHandler(async (req, res) => {
  const { verified } = req.query;
  const filter = { category: 'company' };

  if (verified === 'true') {
    filter.emailVerified = true;
  }

  const companies = await User.find(filter).select('-password');
  res.json({ companies });
});

exports.getCompanyById = asyncHandler(async (req, res) => {
  const company = await User.findById(req.params.id).select('-password');
  if (!company || company.category !== 'company') {
    return res.status(404).json({ message: 'Company not found' });
  }
  res.json({ company });
});

exports.getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json({ user });
});

exports.getChatUsers = asyncHandler(async (req, res) => {
  const users = await User.find({
    emailVerified: true,
    _id: { $ne: req.user._id },
  })
    .select('displayName email photoURL category')
    .lean();
  res.json({ users });
});

