const { json } = require("express");
const { TweetSchema } = require("../models/tweet.model");
const { UserSchema } = require("../models/user.model");

async function getAllTweets(req, res) {
  try {
    const tweets = await TweetSchema.find().select("-__v");
    if (!tweets) {
      res.status(200).json({
        success: true,
        msg: "No tweets to be displayed",
      });
    } else {
      res.status(200).json({
        success: true,
        data: tweets,
      });
    }
  } catch (err) {
    throw err;
  }
}

async function getUserTweet(req, res) {
  try {
    const { user: userID } = req.params;
    const userTweets = await TweetSchema.find({ user: userID }).select("-__v");
    if (!userTweets) {
      res.status(200).json({
        success: true,
        msg: "No tweets to be displayed",
      });
    }
    res.status(200).json({
      success: true,
      data: userTweets,
    });
  } catch (err) {
    throw err;
  }
}

async function getSingleTweet(req, res) {
  try {
    const { id: tweetID } = req.params;
    const tweet = await TweetSchema.findOne({ _id: tweetID }).select("-_v");
    if (!tweet) {
      res.status(404).json({
        success: false,
        msg: "Tweet doesn't exist",
      });
    }
    res.status(200).json({
      success: true,
      data: tweet,
    });
  } catch (err) {
    throw err;
  }
}

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

async function getFollowerTweets(followers) {
  let i = 0;
  let timeline = [];
  let tweeter;
  for (i; i < followers.length; i++) {
    const followerTweets = await UserSchema.findOne(
      { _id: followers[i] },
      "tweets"
    );
    console.log(followerTweets);
    for (let j = 0; j < followerTweets.tweets.length; j++) {
      let element = followerTweets.tweets[1];
      console.log(element);
      tweeter = "DN";
      timeline.push(tweeter);
    }
  }
  console.log(timeline);
  return timeline;
}

async function getTimeline(req, res) {
  try {
    console.log(req.user);
    const currentUser = await UserSchema.findById({ _id: req.user._id });
    const followers = currentUser.followers;

    const timeline = await getFollowerTweets(followers);

    await shuffle(timeline);
    res.status(200).json({
      success: true,
      data: timeline,
    });
  } catch (err) {
    throw err;
  }
}

async function createTweet(req, res) {
  try {
    const tweet = req.body;
    const { text, image } = tweet;
    const currentUser = await UserSchema.findById({ _id: req.user.id });
    if (text || image) {
      const newTweet = new TweetSchema({
        text: text,
        image: image,
        user: req.user._id,
      });

      await newTweet.save();
      await currentUser.updateOne({ $push: { tweets: newTweet._id } });
      res.status(201).json({
        success: true,
        data: newTweet,
      });
    } else {
      res.status(400).json({
        success: false,
        msg: "Input text or image",
      });
    }
  } catch (err) {
    throw err;
  }
}

async function editTweet(req, res) {
  try {
    const { id: tweetID } = req.params;
    const tweet = await TweetSchema.findOneAndUpdate(
      { _id: tweetID },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).select("-_v");
    if (!tweet) {
      res.status(404).json({
        success: true,
        msg: "tweet does not exist",
      });
    }
    res.status(200).json({
      success: true,
      tweet,
    });
  } catch (err) {
    throw err;
  }
}

async function deleteTweet(req, res) {
  try {
    const { id: tweetID } = req.params;
    const user = await UserSchema.findOne({ _id: req.user.id });
    if (!user.tweets.includes(tweetID)) {
      res.status(403).json({
        success: false,
        msg: "You can't delete another users tweet nau",
      });
    }
    const tweet = await TweetSchema.findOneAndDelete({ _id: tweetID })
      .select("-_v")
      .exec();
    if (!tweet) {
      res.status(404).json({
        success: false,
        msg: "tweet does not exist",
      });
    }
    res.status(200).json({
      success: true,
      msg: "tweet successfully deleted",
    });
  } catch (err) {
    throw err;
  }
}

async function likePost(req, res) {
  const { id: tweetID } = req.params;
  const tweet = await TweetSchema.findById({ _id: tweetID }).select("-_v");
  if (!tweet.likes.includes(req.user.userID)) {
    await tweet.updateOne({ $push: { likes: req.user.userID } });
    res.status(200).json({
      success: true,
      msg: "post liked successfully",
    });
  } else {
    unlikePost(req, res);
  }
}
async function unlikePost(req, res) {
  const { id: tweetID } = req.params;
  const tweet = await TweetSchema.findById({ _id: tweetID });
  if (tweet.likes.includes(req.user.userID)) {
    await tweet.updateOne({ $pull: { likes: req.user.userID } });
    res.status(200).json({
      success: true,
      msg: "post unliked successfully",
    });
  } else {
    likePost(req, res);
  }
}

module.exports = {
  getAllTweets,
  getSingleTweet,
  createTweet,
  deleteTweet,
  editTweet,
  getUserTweet,
  likePost,
  unlikePost,
  getTimeline,
};
