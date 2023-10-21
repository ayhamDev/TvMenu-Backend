const { request, response } = require("express");
const { validationResult } = require("express-validator");
const { device } = require("../../utils/db");

const PatchDeviceBulk = async (req = request, res = response) => {
  const DevicesID = req.body.data;
  const { field, value } = req.query;
  const result = validationResult(req);
  if (!result.isEmpty()) return res.status(400).json(result.array());
  try {
    await device.update(
      { [field]: value },
      {
        where: {
          id: DevicesID,
        },
      }
    );
    res.json({
      message: "Updated All Devices Successfully",
      DevicesID,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed To Update Devices",
      error: err,
    });
  }
};
module.exports.PatchDeviceBulk = PatchDeviceBulk;
