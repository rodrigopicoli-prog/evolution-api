function validate(schema) {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const issues = result.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));
      const error = new Error('Validation error');
      error.statusCode = 400;
      error.details = issues;
      return next(error);
    }
    req.body = result.data;
    return next();
  };
}

module.exports = { validate };
