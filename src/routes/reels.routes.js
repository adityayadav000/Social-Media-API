const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = require("../middleware/upload.middleware");
const { createReel, getReels, likeReel, unlikeReel, viewReel, getReelFeed} = require("../controllers/reel.controller");
const verifyJWT = require("../middleware/auth.middleware");

function handleUpload(req,res,next){
    upload.single("video")(req,res,function(error){

        if(error instanceof multer.MulterError){
            return res.status(400).json({
                message: error.message
            })
        }

        if (error){
            return res.status(400).json({
                message: error.message
            });
        }

        next();
    })
}

/**
 * @swagger
 * /:
 *   get:
 *     summary: Get all reels
 *     tags: [Reels]
 *     responses:
 *       200:
 *         description: Reels fetched successfully
 */
router.get("/", getReels)

/**
 * @swagger
 * /{reelId}/like:
 *   post:
 *     summary: Like a reel
 *     tags: [Reels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reelId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the reel to like
 *     responses:
 *       200:
 *         description: Reel liked successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Reel not found
 */

router.post(
    "/:reelId/like",
    verifyJWT,
    likeReel
);

/**
 * @swagger
 * /{reelId}/unlike:
 *   post:
 *     summary: Unlike a reel
 *     tags: [Reels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reelId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the reel to unlike
 *     responses:
 *       200:
 *         description: Reel unliked successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Reel not found
 */

router.post(
    "/:reelId/unlike",
    verifyJWT,
    unlikeReel
);

/**
 * @swagger
 * /{reelId}/view:
 *   post:
 *     summary: Record a reel view
 *     tags: [Reels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reelId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the reel being viewed
 *     responses:
 *       200:
 *         description: Reel view recorded successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Reel not found
 */

router.post(
    "/:reelId/view",
    verifyJWT,
    viewReel
);

/**
 * @swagger
 * /feed:
 *   get:
 *     summary: Get personalized reel feed
 *     tags: [Reels]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Reel feed fetched successfully
 *       401:
 *         description: Unauthorized
 */

router.get(
    "/feed",
    verifyJWT,
    getReelFeed
);

/**
 * @swagger
 * /:
 *   post:
 *     summary: Create a new reel
 *     tags: [Reels]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - video
 *             properties:
 *               video:
 *                 type: string
 *                 format: binary
 *                 description: Video file for the reel
 *               caption:
 *                 type: string
 *                 description: Caption for the reel
 *     responses:
 *       201:
 *         description: Reel uploaded successfully and is pending moderation
 *       400:
 *         description: Invalid video upload or request
 *       401:
 *         description: Unauthorized
 */

router.post(
    "/",
    verifyJWT,
    handleUpload,
    createReel
);

module.exports = router;