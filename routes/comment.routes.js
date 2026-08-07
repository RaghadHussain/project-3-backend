const router = require("express").Router();
const verifyToken = require("../middleware/verifyToken");
const CommentController = require("../controllers/comment.controller");

router.get("/:id", CommentController.getAllComment);
router.post("/", verifyToken, CommentController.createComment);
router.put("/:id", verifyToken, CommentController.updateCommentById);
router.delete("/:id", verifyToken, CommentController.deleteCommentById);
router.post("/:id/replies", verifyToken, CommentController.addReply);
router.put(
  "/:id/replies/:replyId",
  verifyToken,
  CommentController.updateReplyById,
);
router.delete(
  "/:id/replies/:replyId",
  verifyToken,
  CommentController.deleteReplyById,
);

module.exports = router;
