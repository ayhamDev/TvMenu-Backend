const express = require("express");
const { response } = require("express");
const Router = express.Router();
const { body, validationResult } = require("express-validator");
const { AdminLogin } = require("../Controllers/Admin.controller");
const { VerifyAdmin } = require("../Middleware/VerifyAdmin");
Router.post(
  "/login",
  body("email").isEmail(),
  body("password").isString(),
  AdminLogin
);
Router.get("/verify", VerifyAdmin, (req, res = response) =>
  res.json({
    message: "Token Is Valid",
    Token: req.AdminToken,
  })
);

module.exports.AdminRouter = Router;
