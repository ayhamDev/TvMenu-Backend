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
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    Log_History: {
      type: DataTypes.TEXT,
      get: function () {
        return JSON.parse(this.getDataValue("Log_History"));
      },
      set: function (value) {
        return this.setDataValue("Log_History", JSON.stringify(value));
      },
    },
  });

module.exports = UnRegisterTable;
