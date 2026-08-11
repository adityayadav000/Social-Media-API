const express = require("express");
const router = express.Router();

const verifyJWT = require("../middleware/auth.middleware");
const { createPost, getAllPosts, deletePost,updatePost,getPost,likePost, unlikePost } = require("../controllers/post.controller");

router.post("/create", verifyJWT, createPost);
router.get("/", getAllPosts);
router.delete("/:postId", verifyJWT, deletePost);
router.put("/:postId", verifyJWT, updatePost);
router.get("/:postId", getPost);
router.post("/:postId/like", verifyJWT, likePost);
router.delete("/:postId/like", verifyJWT, unlikePost);

module.exports = router;