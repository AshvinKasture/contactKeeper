const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (req, res, next) => {
  // Get token from header
  const token = req.header('x-auth-token');
  //   console.log('token is');
  //   console.log(token);

  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: 'No token, autherization denied' });
  }

  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    req.user = decoded.user;
    // console.log(decoded.user.id);
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
