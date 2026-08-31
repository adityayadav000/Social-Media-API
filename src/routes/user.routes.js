const express = require("express");

const router = express.Router();
const verifyJWT=require("../middleware/auth.middleware")
const { registerUser,loginUser,followUser,unfollowUser,getUserProfile,getFeed,searchUsers }= require("../controllers/user.controller");
const loginRateLimiter = require("../middleware/rateLimiter");
router.post("/register",registerUser);
router.post("/login", loginRateLimiter, loginUser); 
router.post("/:userId/follow", verifyJWT, followUser);
router.delete("/:userId/follow", verifyJWT, unfollowUser);
router.get("/:userId/profile", getUserProfile);
router.get("/feed", verifyJWT, getFeed);
router.get("/search", searchUsers);
router.get("/profile", verifyJWT, function(req,res){
    res.status(200).json({
        message: "profile fetched successfully",
        user: req.user
    })
})



module.exports = router;