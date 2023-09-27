const express = require("express");
const {
  GetCommands,
  CreateCommand,
  DeleteCommand,
} = require("../Controllers/Command.controller");
const { body, query } = require("express-validator");
const Router = express.Router();

Router.get("/", GetCommands);
Router.post(
  "/",
  body("Device_ID").isString().notEmpty(),
  body("Device_Token").isString().notEmpty(),
  body("Command_Type").isIn(["Restart", "Screenshot"]).notEmpty(),
  CreateCommand
);
Router.delete("/", query("Command_ID").isString().notEmpty(), DeleteCommand);

module.exports.CommandRouter = Router;
