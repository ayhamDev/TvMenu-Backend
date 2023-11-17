const { Sequelize } = require("sequelize");
const CommandTable = require("../Model/Command.table");
const UnRegisterTable = require("../Model/UnRegister.table");
const DeviceTable = require("../Model/Device.table");
const ProgramsTable = require("../Model/Programs.table");
const LogTable = require("../Model/LogWriter.table");
const DevicePowerTable = require("../Model/Power.table");
const UsersTable = require("../Model/Users.table");
const ClientTable = require("../Model/Client.table");

// Dev env (sqlite)
// SQLite Config
const sql =
  process.env.NODE_ENV == "production"
    ? new Sequelize("test", process.env.DB_USER, process.env.DB_PASSWORD, {
        host: "localhost",
        dialect: "mssql",
        port: "1433",
        pool: {
          min: 0,
          max: 10,
          idle: 25000,
          acquire: 25000,
          requestTimeout: 30000,
        },
        logging: false,
        define: {
          timestamps: false,
        },
        dialectOptions: {
          options: {
            encrypt: false,
          },
        },
      })
    : new Sequelize({
        dialect: "sqlite",
        storage: "./database.sqlite",
        logging: false,
        define: {
          timestamps: false,
        },
      });

const device = DeviceTable(sql);
const UnRegisteredDevice = UnRegisterTable(sql);
const Command = CommandTable(sql);
const Programs = ProgramsTable(sql);
const LogWriter = LogTable(sql);
const User = UsersTable(sql);
const DevicePower = DevicePowerTable(sql);
const Client = ClientTable(sql);
module.exports = {
  device,
  UnRegisteredDevice,
  Command,
  Programs,
  LogWriter,
  User,
  DevicePower,
  Client,
};
module.exports.sql = sql;
