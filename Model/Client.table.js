const { DataTypes } = require("sequelize");

const ClientTable = (sql) =>
  sql.define("Client", {
    User_ID: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    Store_Name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    City: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    State: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Zip_Code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

module.exports = ClientTable;
