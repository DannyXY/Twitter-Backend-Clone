const { UserSchema } = require("../models/user.model");
const bcrypt = require("bcrypt");

async function getSingleUser(req, res) {
  const { id: userID } = req.params;
  const user = await UserSchema.findOne({ _id: userID }).select("-_v");
  const { password, ...others } = user._doc;
  if (!user) {
    res.status(404).json({
      success: false,
      msg: "user doesn't exist",
    });
  } else {
    res.status(200).json({
      success: true,
      data: others,
    });
  }
}

async function getAllUsers(req, res) {
  try {
    const users = await UserSchema.find({}).select("-_v");
    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (err) {
    throw err;
  }
}

function checkUser(req, res) {
  res.status(200).json({
    success: true,
    data: req.user,
  });
}

async function deleteUser(req, res) {
  const { id: userID } = req.params;
  const { userID: currentUser, isAdmin } = req.user;
  if (currentUser === userID || isAdmin) {
    const user = await UserSchema.findOneAndDelete({ _id: userID }).select(
      "-_v"
    );
    if (!user) {
      res.status(404).json({
        success: false,
        msg: "user doesn't exist",
      });
    } else {
      res.status(200).json({
        success: true,
        msg: "user deleted successfully",
      });
    }
  } else {
    res.status(403).json({
      success: false,
      msg: "you can only delete your data",
    });
  }
}
async function updateUser(req, res) {
  const { id: userID } = req.params;
  const { userID: currentUser, isAdmin } = req.user;
  if (currentUser === userID || isAdmin) {
    if (req.body.password) {
      const salt = bcrypt.genSaltSync(10);
      req.body.password = bcrypt.hashSync(req.body.password, salt);
    }
    const user = await UserSchema.findByIdAndUpdate(
      { _id: userID },
      { $set: req.body }
    );
    if (!user) {
      res.status(404).json({
        success: false,
        msg: "user doesn't exist",
      });
    } else {
      res.status(200).json({
        success: true,
        msg: "user updated successfully",
      });
    }
  } else {
    res.status(403).json({
      success: false,
      msg: "you can only update your data",
    });
  }
}

async function followUser(req, res) {
  const { id } = req.params;
  const userID = req.user._id;
  if (userID !== id) {
    const currentUser = await UserSchema.findById({ _id: userID });
    const user = await UserSchema.findById({ _id: id });
    if (!user) {
      res.status(200).json({
        success: false,
        msg: "user does not exist",
      });
    } else {
      if (!user.followers.includes(userID)) {
        await user.updateOne({ $push: { followers: userID } });
        await currentUser.updateOne({ $push: { following: userID } });
        res.status(200).json({
          success: true,
          msg: "user successfully followed",
        });
      } else {
        res.status(403).json({
          success: false,
          msg: "you already follow this user",
        });
      }
    }
  } else {
    res.status(403).json({
      success: false,
      msg: "you can't follow yourself",
    });
  }
}
async function unfollowUser(req, res) {
  const { id } = req.params;
  const userID = req.user.userID;
  if (userID !== id) {
    const user = await UserSchema.findById({ id });
    const currentUser = await UserSchema.findById({ userID });
    if (user.followers.includes(userID)) {
      await user.updateOne({ $pull: { followers: userID } });
      await currentUser.updateOne({ $pull: { following: userID } });
    } else {
      res.status(403).json({
        success: false,
        msg: "this action can't be completed",
      });
    }
  } else {
    res.status(403).json({
      success: false,
      msg: "you can't unfollow yourself",
    });
  }
}
module.exports = {
  getSingleUser,
  deleteUser,
  updateUser,
  followUser,
  unfollowUser,
  checkUser,
  getAllUsers,
};
