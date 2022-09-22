const mongoose = require("mongoose");

const Tweet = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: {
    type: String,
    trim: true,
  },
  image: String,
  likes: {
    type: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    default: [],
  },
  retweets: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  ],
  comments: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Tweet",
    },
  ],
  isComment: {
    type: Boolean,
    default: false,
  },
});

const TweetSchema = mongoose.model("Tweets", Tweet);
module.exports = { TweetSchema };
