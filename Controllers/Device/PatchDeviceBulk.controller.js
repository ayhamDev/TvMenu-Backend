const { request, response } = require("express");
const { validationResult } = require("express-validator");
const { device } = require("../../utils/db");
const { io } = require("../../utils/Socket");

const PatchDeviceBulk = async (req = request, res = response) => {
  const DevicesID = req.body.data;
  const { value } = req.query;
  const result = validationResult(req);
  if (!result.isEmpty()) return res.status(400).json(result.array());
  try {
    await device.update(
      { Status: value },
      {
        where: {
          Device_ID: DevicesID,
        },
      }
    );
    if (value == "Suspended") {
      const devices = await device.findAll({
        where: {
          Device_ID: DevicesID,
        },
      });
      if (devices.length == 0) return undefined;
      devices.forEach((device) => {
        io.sockets.sockets.get(device.connectionID)?.disconnect();
      });
    }
    res.json({
      message:
        DevicesID.length == 1
          ? "Updated Device Successfully"
          : "Updated All Devices Successfully",
      DevicesID,
    });
  } catch (err) {
    res.status(500).json({
      message:
        DevicesID.length == 1
          ? "Failed To Update Device"
          : "Failed To Update Devices",
      error: err,
    });
  }
};
module.exports.PatchDeviceBulk = PatchDeviceBulk;
