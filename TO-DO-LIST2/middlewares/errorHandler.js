function notFoundHandler(req, res, next) {
  res.status(404);
  res.render('pages/error', {
    title: '404 - Not Found',
    message: 'The page you are looking for does not exist.',
    status: 404,
    user: req.session ? req.session.user : null
  });
}

function globalErrorHandler(err, req, res, next) {
  console.error(err.stack);
  res.status(err.status || 500);
  res.render('pages/error', {
    title: '500 - Server Error',
    message: err.message || 'Something went wrong on our end.',
    status: err.status || 500,
    user: req.session ? req.session.user : null
  });
}

module.exports = {
  notFoundHandler,
  globalErrorHandler
};
