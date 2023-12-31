const { device } = require("../../utils/db");
const { response, request } = require("express");

const GetDevice = async (req = request, res = response) => {
  try {
    if (Object.keys(req.query).length != 0) {
      const Device = await device.findAll({
        where: req.query,
      });
      if (!Device) {
        res.status(404).json([]);
      } else {
        res.json(Device);
      }
    } else {
      res.json(await device.findAll());
    }
  } catch (err) {
    res.status(400).json({
      message: "Server Error",
    });
  }
};

module.exports.GetDevice = GetDevice;
