const express = require("express");
const { body, query } = require("express-validator");
const {
  CreateProgram,
  GetProgram,
  DeleteProgram,
  PatchProgram,
} = require("../Controllers/Program.controller");
const Router = express.Router();

Router.post(
  "/",
  body("Device_ID").isString(),
  body("Device_Token").isString(),
  body("Program_Status").isIn(["Active", "Suspended"]),
  body("Program_Name").isString(),
  body("Program_Layer_Number").isString(),
  body("Start_DateTime").isISO8601().toDate(),
  body("End_DateTime").isISO8601().toDate(),
  body("Program_Type").isNumeric(),
  body("Program_Web_Url").isString(),
  body("Program_Image_Url").isString(),
  body("Program_MP4_Url").isString(),
  body("Program_Note").isString(),
  body("Program_X").isString(),
  body("Program_Y").isString(),
  body("Program_W").isString(),
  body("Program_H").isString(),
  body("Program_Duration").isNumeric(),
  body("Next_Loop_Seconds").isNumeric(),
  body("Program_Transition").isString(),
  CreateProgram
);
Router.get("/", GetProgram);
Router.delete("/", query("Program_Row_Number").isNumeric(), DeleteProgram);
Router.patch(
  "/",
  query("Program_Row_Number").isNumeric(),
  body("Device_ID").isString().optional(),
  body("Device_Token").isString().optional(),
  body("Program_Status").isIn(["Active", "Suspended"]).optional(),
  body("Program_Name").isString().optional(),
  body("Program_Layer_Number").isString().optional(),
  body("Start_DateTime").isISO8601().toDate().optional(),
  body("End_DateTime").isISO8601().toDate().optional(),
  body("Program_Type").isNumeric().optional(),
  body("Program_Web_Url").isString().optional(),
  body("Program_Image_Url").isString().optional(),
  body("Program_MP4_Url").isString().optional(),
  body("Program_Note").isString().optional(),
  body("Program_X").isString().optional(),
  body("Program_Y").isString().optional(),
  body("Program_W").isString().optional(),
  body("Program_H").isString().optional(),
  body("Program_Duration").isNumeric().optional(),
  body("Next_Loop_Seconds").isNumeric().optional(),
  body("Program_Transition").isString().optional(),
  PatchProgram
);

module.exports.ProgramRouter = Router;
