const express = require("express");
const { GetLogs, GetLog } = require("../Controllers/LogWriter.controller");
const Router = express.Router();

Router.get("/", GetLogs);
Router.get("/device", GetLog);

module.exports.LogWriterRouter = Router;
