var express = require("express");
var router = express.Router();
const {
  createTweet,
  getSingleTweet,
  getAllTweets,
  getUserTweet,
  deleteTweet,
  editTweet,
  likePost,
  unlikePost,
  getTimeline,
} = require("../controllers/tweet.controller");
const { auth } = require("../middleware/auth.middleware");

router.get("/timeline", auth, getTimeline);
router.get("/:id", auth, getSingleTweet);
router.put("/edit/:id", auth, editTweet);
router.post("/compose", auth, createTweet);
router.get("/:user", auth, getUserTweet);
router.delete("/:id", auth, deleteTweet);
router.get("/", auth, getAllTweets);
router.get("/:id/like", auth, likePost);
router.get("/:id/unlike", auth, unlikePost);

module.exports = router;
