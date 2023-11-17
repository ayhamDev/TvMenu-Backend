const express = require("express");
const { response } = require("express");
const Router = express.Router();
const { query, body } = require("express-validator");
const {
  UserLogin,
  CreateUser,
  GetUsers,
  GetUserById,
  ChangePassword,
  DeleteBulk,
  UpdateClient,
} = require("../Controllers/User.controller");
const { VerifyAdmin } = require("../Middleware/VerifyAdmin");

Router.get("/", GetUsers);
Router.get("/single", query("User_ID"), GetUserById);
Router.get("/verify", VerifyAdmin, (req, res = response) =>
  res.json({
    message: "Token Is Valid",
  })
);

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
Router.patch(
  "/password",
  body("User_ID").isUUID(),
  body("password").isString(),
  ChangePassword
);
Router.patch(
  "/:id",
  body("Store_Name").isString().optional(),
  body("Country").isString().optional(),
  body("State").isString().optional(),
  body("City").isString().optional(),
  body("Address").isString().optional(),
  body("Zip_Code").isNumeric().optional(),
  UpdateClient
);
Router.delete("/bulk", body("data").isArray(), DeleteBulk);

Router.get("/", GetUsers);
module.exports.UserRouter = Router;
