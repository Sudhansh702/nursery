const jwt = require('jsonwebtoken')
const secret = "123456789";

function setUser(user) {
  return jwt.sign({user
  }, secret
);
}

function getUser(token) {
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (error) {
    return null;
  }
}

module.exports = {
  setUser,
  getUser,
};
