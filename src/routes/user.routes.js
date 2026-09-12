const express = require("express");

const router = express.Router();
const verifyJWT=require("../middleware/auth.middleware")
const { registerUser,loginUser,followUser,unfollowUser,getUserProfile,getFeed,searchUsers }= require("../controllers/user.controller");
const loginRateLimiter = require("../middleware/rateLimiter");

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid request
 */


router.post("/register",registerUser);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 *       429:
 *         description: Too many login attempts
 */

router.post("/login", loginRateLimiter, loginUser); 

/**
 * @swagger
 * /{userId}/follow:
 *   post:
 *     summary: Follow a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []   
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to follow
 *     responses:
 *       200:
 *         description: User followed successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */

router.post("/:userId/follow", verifyJWT, followUser);

/**
 * @swagger
 * /{userId}/follow:
 *   delete:
 *     summary: Unfollow a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to unfollow
 *     responses:
 *       200:
 *         description: User unfollowed successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */

router.delete("/:userId/follow", verifyJWT, unfollowUser);

/**
 * @swagger
 * /{userId}/profile:
 *   get:
 *     summary: Get a user's profile
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: User profile fetched successfully
 *       404:
 *         description: User not found
 */


router.get("/:userId/profile", getUserProfile);

/**
 * @swagger
 * /feed:
 *   get:
 *     summary: Get user's feed
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of posts per page
 *     responses:
 *       200:
 *         description: Feed fetched successfully
 *       401:
 *         description: Unauthorized
 */

router.get("/feed", verifyJWT, getFeed);

/**
 * @swagger
 * /search:
 *   get:
 *     summary: Search for users
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: Username to search for
 *     responses:
 *       200:
 *         description: Users found successfully
 *       400:
 *         description: Search query is required
 */

router.get("/search", searchUsers);

/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Get the authenticated user's profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile fetched successfully
 *       401:
 *         description: Unauthorized
 */

router.get("/profile", verifyJWT, function(req,res){
    res.status(200).json({
        message: "profile fetched successfully",
        user: req.user
    })
})



module.exports = router;