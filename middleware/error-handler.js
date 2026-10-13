function errorHandler(err, req, res, next) {
  console.error(err.stack || err);

  if (res.headersSent) {
    return next(err);
  }

  res.status(500).send("Internal Server Error");
}

export default errorHandler;
