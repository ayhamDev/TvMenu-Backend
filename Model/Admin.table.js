const { DataTypes } = require("sequelize");

const AdminTable = (sql) =>
  sql.define("Admin", {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

module.exports = AdminTable;
