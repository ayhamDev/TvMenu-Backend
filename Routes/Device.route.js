const express = require("express");
const { GetDevice } = require("../Controllers/Device/GetDevice.controller");
const {
  CreateDevice,
} = require("../Controllers/Device/CreateDevice.controller");
const {
  CreateDeviceBulk,
} = require("../Controllers/Device/CreateDeviceBulk.controller");
const {
  DeleteDevice,
} = require("../Controllers/Device/DeleteDevice.controller");
const {
  DeleteDeviceBulk,
} = require("../Controllers/Device/DeleteDeviceBulk.controller");
const { PatchDevice } = require("../Controllers/Device/PatchDevice.controller");
const {
  PatchDeviceBulk,
} = require("../Controllers/Device/PatchDeviceBulk.controller");
const { body, query } = require("express-validator");
const {
  GetSingleDevice,
} = require("../Controllers/Device/GetSingleDevice.controller");

const Router = express.Router();
Router.get("/", GetDevice);
Router.get("/single", GetSingleDevice);
Router.post(
  "/",
  body("Device_ID").isString().notEmpty(),
  body("Device_Token").isString().notEmpty(),
  // body("User_ID").isUUID(),
  body("Status").isIn(["Active", "Suspended"]).optional(),
  body("Status_Message").isString().optional(),
  CreateDevice
);
Router.post("/bulk", body("data").isArray(), CreateDeviceBulk);
Router.delete(
  "/",
  query("Device_ID").isString().notEmpty(),
  query("Device_Token").isString().notEmpty(),
  DeleteDevice
);
Router.delete("/bulk", body("data").isArray(), DeleteDeviceBulk);

Router.patch(
  "/",
  query("id").isString(),
  body("Device_ID").isString().optional(),
  body("Device_Token").isString().optional(),
  body("Display_Type").isNumeric().optional(),
  PatchDevice
);

Router.patch(
  "/bulk",
  query("value").isString(),
  body("data").isArray(),
  PatchDeviceBulk
);

module.exports.DeviceRouter = Router;
