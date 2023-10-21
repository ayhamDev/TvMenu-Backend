const { request, response } = require("express");
const jwt = require("jsonwebtoken");

const VerifyAdmin = (req = request, res = response, next = function () {}) => {
  const BearerToken = req.headers.authorization;
  if (!BearerToken)
    return res.status(401).json({
      message: "Token Is Required",
    });
  const [Bearer, Token] = BearerToken.split(" ");
  try {
    const Verified = jwt.verify(Token, process.env.TOKEN_KEY);
    if (!Verified)
      return res.status(401).json({
        message: "Token Is Invalid.",
      });
    req.AdminToken = Token;
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Token Error",
      err,
    });
  }
};
module.exports.VerifyAdmin = VerifyAdmin;
