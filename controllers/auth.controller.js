const { UserSchema } = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
require("dotenv").config();

async function register(req, res) {
  const { username, email, password } = req.body;
  const salt = bcrypt.genSaltSync(10);
  const user = await UserSchema.findOne({ email: email });
  if (user) {
    res.status(404).json({
      success: false,
      msg: "user already exists with that email",
    });
  } else {
    const hashedPassword = bcrypt.hashSync(password, salt);
    const newUser = new UserSchema({
      username,
      email,
      password: hashedPassword,
      role: "user",
    });
    newUser.save(function (err) {
      if (err) console.log(err);

      res.status(201).json({
        success: true,
        data: newUser,
      });
    });
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  const user = await UserSchema.findOne({ email }, "username password");
  const passwordMatch = bcrypt.compareSync(password, user.password);
  if (!passwordMatch) {
    res.send("Enter correct credentials(username or password)");
  } else {
    jwt.sign(
      { username: user.username },
      process.env.jwtkey,
      function (err, token) {
        res
          .cookie("access_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
          })
          .status(200)
          .json({
            success: true,
            msg: "logged in successfully",
          });
      }
    );
  }
}

function logout(req, res) {
  res.clearCookie("access_token").status(200).json({
    success: true,
    msg: "logged out successfully",
  });
}

module.exports = { register, login, logout };
