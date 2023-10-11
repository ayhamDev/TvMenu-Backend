const express = require("express");
const { body, query } = require("express-validator");
const {
  GetPowers,
  CreatePower,
  GetPower,
  DeletePower,
  PatchPower,
} = require("../Controllers/Power.controller");
const Router = express.Router();
const IsTime = (value) => {
  if (!/^([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/.test(value))
    return new Error("Invalid Time Format.");
  return true;
};

Router.get("/", GetPowers);
Router.get("/:row", GetPower);
Router.delete("/", query("Row_Number").isNumeric(), DeletePower);
Router.post(
  "/",
  body("Device_ID").isString(),
  body("Device_Token").isString(),
  body("Sat_On").custom(IsTime),
  body("Sat_Off").custom(IsTime),
  body("Sun_On").custom(IsTime),
  body("Sun_Off").custom(IsTime),
  body("Mon_On").custom(IsTime),
  body("Mon_Off").custom(IsTime),
  body("Tue_On").custom(IsTime),
  body("Tue_Off").custom(IsTime),
  body("Wed_On").custom(IsTime),
  body("Wed_Off").custom(IsTime),
  body("Thu_On").custom(IsTime),
  body("Thu_Off").custom(IsTime),
  body("Fri_On").custom(IsTime),
  body("Fri_Off").custom(IsTime),
  body("Command_Txt1").isString().optional(),
  body("Command_Txt2").isString().optional(),
  body("Command_On").isString().optional(),
  body("Command_Off").isString().optional(),
  CreatePower
);
Router.patch(
  "/",
  query("Row_Number").isString(),
  body("Device_ID").isString().optional(),
  body("Device_Token").isString().optional(),
  body("Sat_On").custom(IsTime).optional(),
  body("Sat_Off").custom(IsTime).optional(),
  body("Sun_On").custom(IsTime).optional(),
  body("Sun_Off").custom(IsTime).optional(),
  body("Mon_On").custom(IsTime).optional(),
  body("Mon_Off").custom(IsTime).optional(),
  body("Tue_On").custom(IsTime).optional(),
  body("Tue_Off").custom(IsTime).optional(),
  body("Wed_On").custom(IsTime).optional(),
  body("Wed_Off").custom(IsTime).optional(),
  body("Thu_On").custom(IsTime).optional(),
  body("Thu_Off").custom(IsTime).optional(),
  body("Fri_On").custom(IsTime).optional(),
  body("Fri_Off").custom(IsTime).optional(),
  body("Command_Txt1").isString().optional().optional(),
  body("Command_Txt2").isString().optional().optional(),
  body("Command_On").isString().optional().optional(),
  body("Command_Off").isString().optional().optional(),
  PatchPower
);
module.exports.PowerRouter = Router;
