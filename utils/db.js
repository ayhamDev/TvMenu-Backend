const { Sequelize } = require("sequelize");
const CommandTable = require("../Model/Command.table");
const UnRegisterTable = require("../Model/UnRegister.table");
const DeviceTable = require("../Model/Device.table");

// Dev env (sqlite)
// SQLite Config
const sql = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite",
  logging: false,
  define: {
    timestamps: false,
  },
});

//   //  Microsoft SQL Server Config
// const sql = new Sequelize(
//   "tvmenutest",
//   process.env.DB_USER,
//   process.env.DB_PASSWORD,
//   {
//     host: "localhost",
//     dialect: "mssql",
//     port: "1433",
//     pool: {
//       min: 0,
//       max: 10,
//       idle: 25000,
//       acquire: 25000,
//       requestTimeout: 30000,
//     },
//     logging: false,
//     define: {
//       timestamps: false,
//     },
//     dialectOptions: {
//       options: {
//         encrypt: false,
//       },
//     },
//   }
// );

module.exports.sql = sql;
module.exports.device = DeviceTable(sql);
module.exports.UnRegisteredDevice = UnRegisterTable(sql);
module.exports.Command = CommandTable(sql);
