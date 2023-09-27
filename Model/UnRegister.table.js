const { DataTypes } = require("sequelize");

const UnRegisterTable = (sql) =>
  sql.define("unregistered_device", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    Unregistered_Device_ID: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Device_Token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    IP_Address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    First_Date_Time_Hit: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    Last_Date_Time_Hit: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    Requested_Count: {
      type: DataTypes.NUMBER,
      allowNull: false,
      defaultValue: 1,
    },
    Log_History: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

module.exports = UnRegisterTable;
