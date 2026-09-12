const express = require("express");
const router = express.Router();

const verifyJWT = require("../middleware/auth.middleware");
const { createPost, getAllPosts, deletePost,updatePost,getPost,likePost, unlikePost } = require("../controllers/post.controller");
/**
 * @swagger
 * /create:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: Hello everyone!
 *     responses:
 *       201:
 *         description: Post created successfully
 *       400:
 *         description: Content is required
 *       401:
 *         description: Unauthorized
 */

router.post("/create", verifyJWT, createPost);
/**
 * @swagger
 * /:
 *   get:
 *     summary: Get all posts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: Posts fetched successfully
 */


router.get("/", getAllPosts);

/**
 * @swagger
 * /{postId}:
 *   delete:
 *     summary: Delete a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the post to delete
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Post not found
 */

router.delete("/:postId", verifyJWT, deletePost);

/**
 * @swagger
 * /{postId}:
 *   put:
 *     summary: Update a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the post to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: Updated post content
 *     responses:
 *       200:
 *         description: Post updated successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Post not found
 */


router.put("/:postId", verifyJWT, updatePost);

/**
 * @swagger
 * /{postId}:
 *   get:
 *     summary: Get a post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the post
 *     responses:
 *       200:
 *         description: Post fetched successfully
 *       404:
 *         description: Post not found
 */

router.get("/:postId", getPost);

/**
 * @swagger
 * /{postId}/like:
 *   post:
 *     summary: Like a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the post to like
 *     responses:
 *       200:
 *         description: Post liked successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Post not found
 */

router.post("/:postId/like", verifyJWT, likePost);

/**
 * @swagger
 * /{postId}/like:
 *   delete:
 *     summary: Unlike a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the post to unlike
 *     responses:
 *       200:
 *         description: Post unliked successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Post not found
 */

router.delete("/:postId/like", verifyJWT, unlikePost);

module.exports = router;