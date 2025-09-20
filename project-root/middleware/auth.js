module.exports = {
  ensureAuthenticated: (req, res, next) => {
    if (req.session && req.session.user) {
      return next();
    }
    req.flash('error', 'Vui lòng đăng nhập để thực hiện thao tác này.');
    return res.redirect('/login');
  },
  ensureNotAuthenticated: (req, res, next) => {
    if (req.session && req.session.user) {
      return res.redirect('/');
    }
    next();
  }
};
