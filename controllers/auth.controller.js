const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

async function signUp(req, res) {
  try {
    const { username, password, profileImage, bio } = req.body;

    // Validation
    if (!username || !password) return res.status(400).json({message: "Username and password are required.",});
    if (password.length < 6) return res.status(400).json({message: "Password must be more than 6 characters",});

    const user = await User.create({
      username,
      hashedPassword: await bcrypt.hash(password, 12),
      profileImage,
      bio
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
    const user = await User.findOne({ username:username.toLowerCase().trim() });
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
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

async function viewUser(req, res) {
  try{
    const userInfo = await User.findById(req.user._id)
    res.status(200).json(userInfo)
  }catch(e){
    return res.status(500).json({
      message: "Internal Server Error",
    })
  }
}

async function updateUserInfo(req, res) {
  try {
        const { bio } = req.body
        const updatedData = { bio }
        if (req.file) updatedData.profileImage = `/uploads/${req.file.filename}`

        const updatedInfo = await User.findByIdAndUpdate(req.user._id,
            updatedData,
            { new: true, runValidators: true })

        if (!updatedInfo) {
            return res.status(404).json({ message: "User Not Found" })
        }

        res.status(200).json(updatedInfo)
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}

module.exports = {
  signUp,
  signIn,
  verifyUser,
  viewUser,
  updateUserInfo
};
