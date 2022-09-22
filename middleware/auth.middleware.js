const jwt = require("jsonwebtoken");
const { UserSchema } = require("../models/user.model");
const cookieParser = require("cookie-parser");

function auth(req, res, next) {
  const token = req.cookies.access_token;
  if (token) {
    jwt.verify(token, process.env.jwtkey, function (err, payload) {
      if (err) console.log(err);
      UserSchema.findOne(
        { username: payload.username },
        "username isAdmin _id",
        function (err, user) {
          if (err) console.log(err);
          else if (!user) {
            res.status(404).json({
              success: false,
              msg: "user doesn't exist",
            });
          } else {
            req.user = user;
            console.log(user);
            next();
          }
        }
      );
    });
  } else {
    res.status(401).json({
      success: true,
      msg: "You're not allowed access to this route",
    });
  }
}

function checkIfAdmin(req, res, next) {
  if (req.user.isAdmin) {
    next();
  } else {
    res.status(400).json({
      success: false,
      msg: "Only admins can access this route",
    });
  }
}

module.exports = { auth, checkIfAdmin };
