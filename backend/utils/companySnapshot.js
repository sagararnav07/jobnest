const buildCompanySnapshot = (user) => ({
  companyId: user._id,
  displayName: user.displayName,
  email: user.email,
  photoURL: user.photoURL,
  userPhone: user.userPhone,
  address: user.address,
});

module.exports = buildCompanySnapshot;

