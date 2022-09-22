var express = require("express");
var router = express.Router();
const {
  getSingleUser,
  deleteUser,
  updateUser,
  followUser,
  unfollowUser,
  checkUser,
  getAllUsers,
} = require("../controllers/user.controller");
const { auth, checkIfAdmin } = require("../middleware/auth.middleware");

/* GET users listing. */
router.get("/:id", auth, getSingleUser);
router.get("/", auth, getAllUsers);
router.put("/:id", auth, updateUser);
router.get("/:id/follow", auth, followUser);
router.get("/:id/unfollow", auth, unfollowUser);
router.delete("/:id", auth, deleteUser);
router.get("/checkUser", auth, checkUser);

module.exports = router;
