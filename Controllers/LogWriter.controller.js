const { request, response } = require("express");
const { LogWriter } = require("../utils/db");

const GetLogs = async (req = request, res = response) => {
  const LogWriterData = await LogWriter.findAll({
    where: { ...req.query },
  });
  res.json(LogWriterData);
};

const GetLog = async (req = request, res = response) => {
  const LogWriterData = await LogWriter.findOne({
    where: { ...req.query },
  });
  res.json(LogWriterData);
};
module.exports = {
  GetLogs,
  GetLog,
};
