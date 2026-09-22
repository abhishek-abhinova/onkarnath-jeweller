const jwt = require('jsonwebtoken');
const env = require('../config/env');
const store = require('../data/store');

const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES });

const readToken = (req) => {
  const auth = req.headers.authorization || '';
  if (auth.startsWith('Bearer ')) return auth.slice(7);
  return req.cookies ? req.cookies.onas_token : null;
};

const requireAdmin = async (req, res, next) => {
  try {
    const token = readToken(req);
    if (!token) return res.status(401).json({ success: false, message: 'Authentication required' });
    const payload = jwt.verify(token, env.JWT_SECRET);
    const user = await store.findUser({ id: payload.id });
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired session' });
  }
};

module.exports = { signToken, requireAdmin };