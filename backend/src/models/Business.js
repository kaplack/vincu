const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Business = sequelize.define(
  "Business",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(120), allowNull: false },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "active",
    },
  },
  { tableName: "businesses" }
);

module.exports = Business;
