const { request, response } = require("express");
const { validationResult } = require("express-validator");
const { DevicePower } = require("../utils/db");

const GetPowers = async (req = request, res = response) => {
  try {
    const DevicePowerData = await DevicePower.findAll({
      where: { ...req.query },
    });
    res.json(DevicePowerData);
  } catch (err) {
    res.status(500).json({
      message: "Failed To Get All Device Power.",
      error: err,
    });
  }
};
const GetPower = async (req = request, res = response) => {
  try {
    const DevicePowerData = await DevicePower.findOne({
      where: { Row_Number: req.params.row },
    });
    res.json(DevicePowerData);
  } catch (err) {
    res.status(500).json({
      message: "Failed To Get Device Power.",
      Row_Number: req.params.row,
      error: err,
    });
  }
};
const CreatePower = async (req = request, res = response) => {
  const result = validationResult(req);
  if (!result.isEmpty()) return res.status(400).json(result.array());
  const {
    Device_ID,
    Device_Token,
    Sat_On,
    Sat_Off,
    Sun_On,
    Sun_Off,
    Mon_On,
    Mon_Off,
    Tue_On,
    Tue_Off,
    Wed_On,
    Wed_Off,
    Thu_On,
    Thu_Off,
    Fri_On,
    Fri_Off,
    Command_Txt1,
    Command_Txt2,
    Command_On,
    Command_Off,
  } = req.body;

  try {
    await DevicePower.create({
      Device_ID,
      Device_Token,
      Sat_On,
      Sat_Off,
      Sun_On,
      Sun_Off,
      Mon_On,
      Mon_Off,
      Tue_On,
      Tue_Off,
      Wed_On,
      Wed_Off,
      Thu_On,
      Thu_Off,
      Fri_On,
      Fri_Off,
      Command_Txt1,
      Command_Txt2,
      Command_On,
      Command_Off,
    });
    res.json({
      message: "The Device Power Was Created Successfully.",
      Device_ID: Device_ID,
      Device_Token: Device_Token,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed To Create Device Power.",
      error: err,
    });
  }
};
const DeletePower = async (req = request, res = response) => {
  const result = validationResult(req);
  if (!result.isEmpty()) return res.status(400).json(result.array());
  try {
    const deleted = await DevicePower.destroy({
      where: {
        Row_Number: req.query.Row_Number,
      },
    });
    if (deleted) {
      res.json({
        message: "The Device Power Was Deleted Successfully.",
        Row_Number: req.query.Row_Number,
      });
    } else {
      res.status(400).json({
        message: "Device Power Doesn't Exist.",
        Row_Number: req.query.Row_Number,
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Failed To Delete Device Power.",
      Row_Number: req.query.Row_Number,
      error: err,
    });
  }
};
const PatchPower = async (req = request, res = response) => {
  const result = validationResult(req);
  if (!result.isEmpty()) return res.status(400).json(result.array());
  try {
    const DevicePowerData = await DevicePower.findOne({
      where: {
        Row_Number: req.query.Row_Number,
      },
    });
    if (!DevicePowerData)
      return res.status(404).json({
        message: "Device Power Not Found.",
        Row_Number: req.query.Row_Number,
      });
    try {
      for (const key in req.body) {
        if (Object.hasOwnProperty.call(req.body, key)) {
          DevicePowerData[key] = req.body[key];
        }
      }
      await DevicePowerData.save();
      res.json({
        message: "Device Power Updated Successfully.",
        Row_Number: req.query.Row_Number,
      });
    } catch (err) {
      res.json({
        message: "Failed To Update Device Power.",
        Row_Number: req.query.Row_Number,
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Failed To Update Device Power.",
      error: err,
    });
  }
};

module.exports = {
  GetPowers,
  GetPower,
  CreatePower,
  DeletePower,
  PatchPower,
};
