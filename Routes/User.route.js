const express = require("express");
const { response } = require("express");
const Router = express.Router();
const { body } = require("express-validator");
const {
  UserLogin,
  CreateUser,
  GetUsers,
} = require("../Controllers/User.controller");
const { VerifyAdmin } = require("../Middleware/VerifyAdmin");

Router.post(
  "/register",
  body("email").isEmail(),
  body("password").isString(),
  body("Role").isIn(["Admin", "Client"]),
  CreateUser
);

Router.post(
  "/login",
  body("email").isEmail(),
  body("password").isString(),
  UserLogin
);
Router.get("/verify", VerifyAdmin, (req, res = response) =>
  res.json({
    message: "Token Is Valid",
  })
);

Router.get("/", GetUsers);
module.exports.UserRouter = Router;
