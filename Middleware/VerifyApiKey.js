const VerifyAPiKey = (req, res, next) => {
  const { api_key } = req.headers;
  if (!api_key)
    return res.status(401).json({ message: "Api Key Is Required." });
  // invalid api key > 401 no access
  if ((process.env.API_KEY || "myapikey") != api_key)
    return res.status(401).json({
      message: "invalid Api Key.",
    });
  // valid api key > Next
  next();
};
module.exports.VerifyAPiKey = VerifyAPiKey;
