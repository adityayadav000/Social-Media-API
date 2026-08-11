const express = require("express");
const router = express.Router();

const verifyJWT = require("../middleware/auth.middleware");
const { createComment,getComments,deleteComment } = require("../controllers/comment.controller");

router.post("/:postId/comments", verifyJWT, createComment);
router.get("/:postId/comments", getComments);
router.delete("/comments/:commentId", verifyJWT, deleteComment);
module.exports = router;