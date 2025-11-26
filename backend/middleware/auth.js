const jwt = require('jsonwebtoken');
const User = require('../models/User');

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

const auth = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const tokenFromHeader = authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : null;
  const token = tokenFromHeader || req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.sub).lean();

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
});

const requireCompany = (req, res, next) => {
  if (req.user?.category !== 'company') {
    return res.status(403).json({ message: 'Company access required' });
  }
  next();
};

module.exports = {
  auth,
  requireCompany,
};

