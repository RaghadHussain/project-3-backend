const Comment = require("../models/Comment");
const Notification = require("../models/Notification");

async function createComment(req, res) {
  try {
    const { post, message } = req.body;

    if (!post || !message) {
      return res
        .status(400)
        .json({ message: "post and message are required." });
    }

    const createdComment = await Comment.create({
      post,
      sender: req.user._id,
      message,
    });

    createdComment.populate("post");
    const createdNotification = await Notification.create({
      reciver: createdComment.post.user,
      type: "comment",
      comment: createdComment._id,
      sender: req.user._id,
    });

    res.status(201).json(createdComment);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

async function getAllComment(req, res) {
  try {
    const { id } = req.params;

    const allComment = await Comment.find({ post: id })
      .populate("sender", "username")
      .populate("replyTo.sender", "username")
      .sort({ createdAt: -1 });

    res.status(200).json(allComment);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

async function updateCommentById(req, res) {
  try {
    const { message } = req.body;

    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: "Comment is not found." });
    }
    if (comment.sender.toString() !== req.user._id) {
      return res
        .status(403)
        .json({ message: "Not authorized to edit this comment." });
    }

    const updatedComment = await Comment.findByIdAndUpdate(
      req.params.id,
      { message },
      { new: true, runValidators: true },
    );

    res.status(200).json(updatedComment);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

async function addReply(req, res) {
  try {
    const { message } = req.body;
    const { id } = req.params;

    if (!message) {
      return res.status(400).json({ message: "message is required." });
    }

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found." });
    }

    comment.replyTo.push({
      post: comment.post,
      sender: req.user._id,
      message,
    });

    await comment.save();

    res.status(201).json(comment);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

async function deleteCommentById(req, res) {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found." });
    }
    if (comment.sender.toString() !== req.user._id) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this comment." });
    }

    await Comment.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Comment deleted." });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

async function updateReplyById(req, res) {
  try {
    const { message } = req.body;
    const { id, replyId } = req.params;

    if (!message) {
      return res.status(400).json({ message: "message is required." });
    }

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found." });
    }

    const reply = comment.replyTo.id(replyId);
    if (!reply) {
      return res.status(404).json({ message: "Reply not found." });
    }
    if (reply.sender.toString() !== req.user._id) {
      return res
        .status(403)
        .json({ message: "Not authorized to edit this reply." });
    }

    reply.message = message;
    await comment.save();

    res.status(200).json(comment);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

async function deleteReplyById(req, res) {
  try {
    const { id, replyId } = req.params;

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found." });
    }

    const reply = comment.replyTo.id(replyId);
    if (!reply) {
      return res.status(404).json({ message: "Reply not found." });
    }
    if (reply.sender.toString() !== req.user._id) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this reply." });
    }

    reply.deleteOne();
    await comment.save();

    res.status(200).json({ message: "Reply deleted." });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = {
  createComment,
  getAllComment,
  updateCommentById,
  addReply,
  updateReplyById,
  deleteReplyById,
  deleteCommentById,
};
