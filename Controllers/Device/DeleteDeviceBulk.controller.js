const { request, response } = require("express");
const { device, LogWriter } = require("../../utils/db");
const { validationResult } = require("express-validator");
const { io } = require("../../utils/Socket");
const DeleteDeviceBulk = async (req = request, res = response) => {
  const DevicesID = req.body.data;
  const result = validationResult(req);
  if (!result.isEmpty()) return res.status(400).json(result.array());
  try {
    const DeletedDevices = await device.findAll({
      where: {
        Device_ID: DevicesID,
      },
    });
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
    DeletedDevices.forEach((device) => {
      io?.sockets?.sockets?.get(device.connectionID)?.disconnect();
    });
    res.json({
      message:
        DevicesID.length == 1
          ? "Deleted Devices Successfully"
          : "Deleted Device Successfully",
      DevicesID,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message:
        DevicesID.length == 1
          ? "Failed Deleted Devices"
          : "Failed Deleted Device",
      error: err,
    });
  }
};
module.exports.DeleteDeviceBulk = DeleteDeviceBulk;
