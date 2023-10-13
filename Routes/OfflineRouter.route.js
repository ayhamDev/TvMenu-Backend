const express = require("express");
const { GetOffline } = require("../Controllers/Offline.controller");
const { query } = require("express-validator");
const Router = express.Router();

Router.get(
  "/",
  query("Device_ID").isString(),
  query("Device_Token").isString(),
  GetOffline
);

module.exports.OfflineRouter = Router;
