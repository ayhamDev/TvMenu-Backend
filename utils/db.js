const { Sequelize, DataTypes } = require("sequelize");

// Dev env (sqlite)
// SQLite Config
const sql = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite",

  define: {
    timestamps: false,
  },
});

//   //  Microsoft SQL Server Config
// const sql = new Sequelize("TVmenu","TVBackendUser","Hello!@!@!@2023A",{
//   host: "localhost",
//   dialect: "mssql",
//   port: '1433',
//   pool: {
//     min:0,
//     max: 10,
//     idle:25000,
//     acquire: 25000,
//     requestTimeout: 30000
//   },
//    dialectOptions: {
//     options: {
//       "encrypt": false
//     }
//   },

const Device = sql.define("device", {
  id: {
    type: Sequelize.INTEGER,
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
  Display_Type: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  Web_Url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Image_URL: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Mp4_URL: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Offline_Image: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Last_Online_hit: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

(module.exports.sql = sql), (module.exports.device = Device);
