const { request, response } = require("express");
const { device, LogWriter } = require("../../utils/db");
const { validationResult } = require("express-validator");
const DeleteDeviceBulk = async (req = request, res = response) => {
  const DevicesID = req.body.data;
  const result = validationResult(req);
  if (!result.isEmpty()) return res.status(400).json(result.array());
  try {
    await device.destroy({
      where: {
        Device_ID: DevicesID,
      },
    });
    await LogWriter.destroy({
      where: {
        Device_ID: DevicesID,
      },
    });
    res.json({
      message: "Deleted All Devices Successfully",
      DevicesID,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Failed To Delete Devices",
      error: err,
    });
  }
};
module.exports.DeleteDeviceBulk = DeleteDeviceBulk;
