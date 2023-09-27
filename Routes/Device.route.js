const express = require("express");
const { GetDevice } = require("../Controllers/Device/GetDevice.controller");
const {
  CreateDevice,
} = require("../Controllers/Device/CreateDevice.controller");
const {
  DeleteDevice,
} = require("../Controllers/Device/DeleteDevice.controller");
const { PatchDevice } = require("../Controllers/Device/PatchDevice.controller");
const { body, query } = require("express-validator");
const Router = express.Router();
Router.get(
  "/",
  body("Device_ID").isString().optional(),
  query("Device_Token").isString().optional(),
  GetDevice
);
Router.post(
  "/",
  body("Device_ID").isString().notEmpty(),
  body("Device_Token").isString().notEmpty(),
  body("Display_Type").isNumeric().notEmpty(),
  body("Web_Url").isString().notEmpty(),
  body("Image_URL").isString().notEmpty(),
  body("Mp4_URL").isString().notEmpty(),
  body("Offline_Image").isString().notEmpty(),
  body("Status").isIn(["Active", "Suspended"]).optional(),
  body("Status_Message").isString().optional(),
  CreateDevice
);
Router.delete(
  "/",
  query("Device_ID").isString().notEmpty(),
  query("Device_Token").isString().notEmpty(),
  DeleteDevice
);

Router.patch(
  "/",
  query("Device_ID").isString().optional(),
  query("Device_Token").isString().optional(),
  body("Device_ID").isString().optional(),
  body("Device_Token").isString().optional(),
  body("Display_Type").isNumeric().optional(),
  body("Web_Url").isString().optional(),
  body("Image_URL").isString().optional(),
  body("Mp4_URL").isString().optional(),
  body("Offline_Image").isString().optional(),
  PatchDevice
);

module.exports.DeviceRouter = Router;
