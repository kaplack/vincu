const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Customer = sequelize.define(
  "Customer",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    businessId: { type: DataTypes.INTEGER, allowNull: false },
    phone: { type: DataTypes.STRING(30), allowNull: false },
    name: { type: DataTypes.STRING(120), allowNull: true },
    qrCodeValue: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    status: { type: DataTypes.STRING(20), allowNull: false, defaultValue: "active" },
  },
  {
    tableName: "customers",
    indexes: [
      {
        unique: true,
        fields: ["businessId", "phone"],
      },
    ],
  }
);

module.exports = Customer;
