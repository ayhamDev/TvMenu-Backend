const { query } = require("express-validator");
const {
  UnRegisteredController,
} = require("../Controllers/UnRegistered.controller");
const express = require("express");

const Router = express.Router();
Router.get(
  "/",
  query("Unregistered_Device_ID").isString().optional(),
  query("Device_Token").isString().optional(),
  UnRegisteredController
);

module.exports.UnRegisteredRouter = Router;
