const { DataTypes, UUIDV4 } = require("sequelize");

const UsersTable = (sql) =>
  sql.define("User", {
    User_ID: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Role: {
      type: DataTypes.ENUM(["Admin", "Client"]),
      validate: {
        isIn: {
          args: [["Admin", "Client"]],
          msg: "Invalid Role.",
        },
      },
      allowNull: false,
    },
  });

module.exports = UsersTable;
