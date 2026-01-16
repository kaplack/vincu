const { Sequelize } = require("sequelize");
const { DATABASE_URL, NODE_ENV } = require("./env");

/**
 * For local (pgAdmin): SSL disabled by default.
 * For production (Neon): we enable SSL (common requirement).
 */
const sequelize = new Sequelize(DATABASE_URL, {
  logging: NODE_ENV === "development" ? console.log : false,
  dialectOptions:
    NODE_ENV === "production"
      ? { ssl: { require: true, rejectUnauthorized: false } }
      : {},
});

module.exports = sequelize;
