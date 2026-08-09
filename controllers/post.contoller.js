const Post = require("../models/Post");
const Notification = require("../models/Notification");

async function createNewPost(req, res) {
  try {
    const { title, caption, category } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : undefined;

    const createdPost = await Post.create({
      user: req.user._id,
      title,
      caption,
      image,
      category,
    });

    res.status(201).json(createdPost);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

async function getAllPosts(req, res) {
  try {
    const allPosts = await Post.find().populate("user").sort({ createdAt: -1 });

    res.status(200).json(allPosts);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

async function getPostById(req, res) {
  try {
    const onePost = await Post.findById(req.params.id).populate("user");

    if (!onePost) {
      return res.status(404).json({ message: "Post Not Found" });
    }

    res.status(200).json(onePost);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

async function getPostsByUser(req, res) {
  try {
    const userPosts = await Post.find({ user: req.params.id })
      .populate("user")
      .sort({ createdAt: -1 });

    res.status(200).json(userPosts);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

async function updatePostById(req, res) {
  try {
    const { title, caption, category } = req.body;
    const updateData = { title, caption, category };
    if (req.file) updateData.image = `/uploads/${req.file.filename}`;

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true },
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Post Not Found" });
    }

    res.status(200).json(updatedPost);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

async function likePost(req, res) {
  try {
    const foundPost = await Post.findById(req.params.id);

    if (!foundPost) {
      return res.status(404).json({ message: "Post Not Found" });
    }

    foundPost.likes.push(req.user._id);
    await foundPost.save();
    const createdNotification = await Notification.create({
      reciver: foundPost.user,
      type: "like",
      post: foundPost._id,
      sender: req.user._id,
    });

    res.status(200).json(foundPost);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

async function unlikePost(req, res) {
  try {
    const foundPost = await Post.findById(req.params.id);

    if (!foundPost) {
      return res.status(404).json({ message: "Post Not Found" });
    }

    const allIdsButMyId = foundPost.likes.filter(
      (oneId) => !oneId.equals(req.user._id),
    );
    foundPost.likes = allIdsButMyId;
    await foundPost.save();

    res.status(200).json(foundPost);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

async function deletePostById(req, res) {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);

    if (!deletedPost) {
      return res.status(404).json({ message: "Cannot Delete Post" });
    }

    res.status(200).json(deletedPost);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = {
  createNewPost,
  getAllPosts,
  getPostById,
  updatePostById,
  deletePostById,
  getPostsByUser,
  likePost,
  unlikePost,
};
