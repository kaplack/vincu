module.exports = (err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error(err);

  // Sequelize-friendly errors
  if (err.name === "SequelizeUniqueConstraintError") {
    return res.status(409).json({
      message: err.errors?.[0]?.message || "Unique constraint violation",
      fields: err.fields,
    });
  }
  if (err.name === "SequelizeValidationError") {
    return res.status(400).json({
      message: err.errors?.[0]?.message || "Validation error",
      errors: err.errors?.map((e) => ({ message: e.message, path: e.path })) || [],
    });
  }

  const status = err.status || err.statusCode || 500;
  const payload = { message: err.message || "Internal server error" };
  if (err.details) payload.details = err.details;
  return res.status(status).json(payload);
};
