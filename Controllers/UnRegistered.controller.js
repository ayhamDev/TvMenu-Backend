const { request, response } = require("express");
const { UnRegisteredDevice } = require("../utils/db");

const UnRegisteredController = async (req = request, res = response) => {
  if (req.query.Unregistered_Device_ID && req.query.Device_Token) {
    const Devices = await UnRegisteredDevice.findOne({
      where: {
        Unregistered_Device_ID: req.query.Unregistered_Device_ID,
        Device_Token: req.query.Device_Token,
      },
    });
    if (!Devices) return res.json({});

    res.json(Devices);
  } else {
    const Devices = await UnRegisteredDevice.findAll();
    if (!Devices) return res.json([]);
    res.json(Devices);
  }
};
module.exports.UnRegisteredController = UnRegisteredController;
