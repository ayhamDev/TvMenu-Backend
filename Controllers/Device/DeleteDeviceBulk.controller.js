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
        id: DevicesID,
      },
    });
    await LogWriter.destroy({
      where: {
        id: DevicesID,
      },
    });
    res.json({
      message: "Deleted All Devices Successfully",
      DevicesID,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed To Delete Devices",
      error: err,
    });
  }
};
module.exports.DeleteDeviceBulk = DeleteDeviceBulk;
