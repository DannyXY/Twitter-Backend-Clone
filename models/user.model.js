const mongoose = require("mongoose");

const User = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please provide name"],
      minlength: 3,
      maxlength: 50,
      unique: true,
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Please provide email"],
    },
    password: {
      type: String,
      required: [true, "Please provide password"],
      minlength: 6,
    },
    profilePicture: {
      type: String,
      default:
        "https://www.personality-insights.com/wp-content/uploads/2017/12/default-profile-pic-e1513291410505.jpg",
    },
    coverPicture: {
      type: String,
      default: "",
    },
    followers: {
      type: [
        {
          type: mongoose.Types.ObjectId,
          ref: "User",
        },
      ],
      default: [],
    },
    following: {
      type: [
        {
          type: mongoose.Types.ObjectId,
          ref: "User",
        },
      ],
      default: [],
    },
    tweets: {
      type: [
        {
          type: mongoose.Types.ObjectId,
          ref: "Tweet",
        },
      ],
      default: [],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    desc: {
      type: String,
      minlength: 10,
    },
  },
  { timestamps: true }
);

const UserSchema = mongoose.model("User", User);
module.exports = { UserSchema };
