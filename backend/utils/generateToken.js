const jwt = require('jsonwebtoken');

const generateToken = (userId, email, role = 'user') =>
  jwt.sign(
    {
      sub: userId,
      email,
      role,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

module.exports = generateToken;

