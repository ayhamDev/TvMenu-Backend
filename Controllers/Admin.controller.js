const { request, response } = require("express");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const { Admin } = require("../utils/db");
const jwt = require("jsonwebtoken");

const AdminLogin = async (req = request, res = response) => {
  const result = validationResult(req);
  if (!result.isEmpty()) return res.status(400).json(result.array());
  const { email, password } = req.body;
  const AdminData = await Admin.findOne({
    where: {
      email: email,
    },
  });
  if (!AdminData)
    return res.status(404).json({
      message: "Email Or Password Is Incorrect.",
    });
  const eq = await bcrypt.compare(password, AdminData.password);
  if (!eq)
    return res.status(404).json({
      message: "Email Or Password Is Incorrect.",
    });
  try {
    const Token = jwt.sign(
      {
        email: AdminData.email,
      },
      process.env.TOKEN_KEY,
      {
        expiresIn: "3h",
      }
    );
    res.json({
      message: "Login Successfull",
      Token,
    });
  } catch (err) {
    res.status(500).json({
      message: "Couldn't Create The Token.",
      err,
    });
  }
};
module.exports = { AdminLogin };
