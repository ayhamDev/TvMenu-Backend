const { DataTypes } = require("sequelize");

const CommandTable = (sql) =>
  sql.define("Command", {
    Command_ID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    Device_ID: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Device_Token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    User_ID: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    Command_Type: {
      type: DataTypes.ENUM(["Restart", "Screenshot"]),
      validate: {
        isIn: {
          args: [["Restart", "Screenshot"]],
          msg: "Invalid Command Type.",
        },
      },
      allowNull: false,
    },
    Command_Status: {
      type: DataTypes.ENUM(["pending", "executing", "success", "fail"]),
      validate: {
        isIn: {
          args: [["pending", "executing", "success", "fail"]],
          msg: "Invalid Command Type.",
        },
      },
      allowNull: false,
      defaultValue: "pending",
    },
    CreatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    ExecutedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  });

module.exports = CommandTable;
