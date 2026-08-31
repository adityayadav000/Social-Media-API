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

router.get("/", getReels)
router.post(
    "/:reelId/like",
    verifyJWT,
    likeReel
);

router.post(
    "/:reelId/unlike",
    verifyJWT,
    unlikeReel
);
router.post(
    "/:reelId/view",
    verifyJWT,
    viewReel
);

router.get(
    "/feed",
    verifyJWT,
    getReelFeed
);

router.post(
    "/",
    verifyJWT,
    handleUpload,
    createReel
);

module.exports = router;