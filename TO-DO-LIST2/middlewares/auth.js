function requireAuth(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  } else {
    return res.redirect('/auth/login');
  }
}

function preventLoggedInAccess(req, res, next) {
  if (req.session && req.session.userId) {
    return res.redirect('/');
  } else {
    return next();
  }
}

module.exports = {
  requireAuth,
  preventLoggedInAccess
};
