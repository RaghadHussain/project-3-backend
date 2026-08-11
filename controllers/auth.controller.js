const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const Notification = require("../models/Notification");

async function signUp(req, res) {
  try {
    const { username, password, bio } = req.body;

    // Validation
    if (!username || !password)
      return res
        .status(400)
        .json({ message: "Username and password are required." });
    if (password.length < 6)
      return res
        .status(400)
        .json({ message: "Password must be more than 6 characters" });

    const user = await User.create({
      username,
      hashedPassword: await bcrypt.hash(password, 12),
      profileImage: req.file ? `/uploads/${req.file.filename}` : undefined,
      bio,
    });

    const { _id, createdAt, updatedAt } = user;

    res
      .status(201)
      .json({ username: user.username, _id, createdAt, updatedAt });
  } catch (err) {
    console.log(err);
    if (err.name === "ValidationError") {
      return res.status(400).json({
        message: err.message,
      });
    }
    if (err.code === 11000) {
      return res.status(409).json({
        message: "Username already exists",
      });
    }

    console.log(err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

async function signIn(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required.",
      });
    }
    const user = await User.findOne({
      username: username.toLowerCase().trim(),
    });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.hashedPassword,
    );
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Construct the payload
    const payload = { username: user.username, _id: user._id };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    return res.status(200).json({
      accessToken,
      user: {
        _id: user._id,
        username: user.username,
        profileImage: user.profileImage,
        bio: user.bio,
      },
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

async function verifyUser(req, res) {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    return res.status(200).json({
      _id: user._id,
      username: user.username,
      profileImage: user.profileImage,
      bio: user.bio,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

async function getUserById(req, res) {
  try {
    const userInfo = await User.findById(req.params.id)
    .populate('followers', 'username profileImage')
    .populate('followings', 'username profileImage');

    if (!userInfo) {
      return res.status(404).json({ message: "User Not Found" });
    }

    res.status(200).json(userInfo);
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function followUser(req, res) {
  try {
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (!userToFollow) {
      return res.status(404).json({ message: "User Not Found" });
    }

    const alreadyFollowing = userToFollow.followers.some((oneId) =>
      oneId.equals(req.user._id),
    );

    if (!alreadyFollowing) {
      userToFollow.followers.push(req.user._id);
      currentUser.followings.push(userToFollow._id);
      await userToFollow.save();
      await currentUser.save();
    }

    const createdNotification = await Notification.create({
      reciver: userToFollow._id,
      type: "follow",
      sender: currentUser._id,
    });

    res.status(200).json(userToFollow);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

async function unfollowUser(req, res) {
  try {
    const userToUnfollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (!userToUnfollow) {
      return res.status(404).json({ message: "User Not Found" });
    }

    userToUnfollow.followers = userToUnfollow.followers.filter(
      (oneId) => !oneId.equals(req.user._id),
    );
    currentUser.followings = currentUser.followings.filter(
      (oneId) => !oneId.equals(userToUnfollow._id),
    );

    await userToUnfollow.save();
    await currentUser.save();

    res.status(200).json(userToUnfollow);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

async function updateUserInfo(req, res) {
  try {
    const { bio } = req.body;
    const updatedData = { bio };
    if (req.file) updatedData.profileImage = `/uploads/${req.file.filename}`;

    const updatedInfo = await User.findByIdAndUpdate(
      req.user._id,
      updatedData,
      { new: true, runValidators: true },
    );

    if (!updatedInfo) {
      return res.status(404).json({ message: "User Not Found" });
    }

    res.status(200).json(updatedInfo);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}


async function searchUsername(req, res) {
  try {
    const query = req.query.q

    if (!query) {
      return res.json([])
    }

    const filtredUsers = await User.find({
      username: { $regex: query, $options: "i" },
    })
    res.status(200).json(filtredUsers)

  }catch(e){
    res.status(500).json({ message: e.message });
  }
}

module.exports = {
  signUp,
  signIn,
  verifyUser,
  getUserById,
  followUser,
  unfollowUser,
  updateUserInfo,
  searchUsername
};
