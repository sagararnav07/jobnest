const formatUser = (user) => {
  if (!user) return null;
  const { password, __v, ...rest } = user;
  return rest;
};

module.exports = formatUser;

