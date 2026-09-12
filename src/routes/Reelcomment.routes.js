const express = require("express");
const router = express.Router();

const {createComment, getComments, deleteComment} = require("../controllers/ReelComment.controller");

const verifyJWT = require("../middleware/auth.middleware");

/**
 * @swagger
 * /{reelId}/comment:
 *   post:
 *     summary: Create a comment on a reel
 *     tags: [Reel Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reelId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the reel to comment on
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
 *                 example: Great reel!
 *     responses:
 *       201:
 *         description: Comment created successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Reel not found
 */

router.post(
    "/:reelId/comment",
    verifyJWT,
    createComment
);

/**
 * @swagger
 * /{reelId}/comments:
 *   get:
 *     summary: Get comments for a reel
 *     tags: [Reel Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reelId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the reel
 *     responses:
 *       200:
 *         description: Comments fetched successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Reel not found
*/

router.get(
    "/:reelId/comments",
    verifyJWT,
    getComments
);

/**
 * @swagger
 * /comments/{commentId}:
 *   delete:
 *     summary: Delete a reel comment
 *     tags: [Reel Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the reel comment to delete
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Comment not found
 */

router.delete(
    "/comments/:commentId",
    verifyJWT,
    deleteComment
);

module.exports = router;