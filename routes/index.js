var express = require("express");
var router = express.Router();
const { register, login, logout } = require("../controllers/auth.controller");
const { auth } = require("../middleware/auth.middleware");

/* GET home page. */
router.post("/register", register);
router.post("/login", login);

module.exports = router;
