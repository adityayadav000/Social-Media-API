const { createStandardJSONSchemaMethod } = require("zod/v4/core");
const cloudinary=require("../config/cloudinary");
const Reel = require("../models/reel.model");
const {redisClient}=require("../config/redis");
const User=require("../models/user.model");
const moderationQueue = require("../queues/moderation.queue");


async function createReel(req, res) {
    try {
       const { caption }=req.body;

       if(!req.file){
        return res.status(400).json({
            message: "video is required"
        });
       }
    

        const result=await cloudinary.uploader.upload(
            req.file.path,
            {
                resource_type: "video",
                folder: "sm-api/reels"
            }
        );
        
        const reel=await Reel.create({
            owner: req.user._id,
            videoUrl: result.secure_url,
            caption,
            moderationStatus: "pending"
        });

        await moderationQueue.add("moderateReel", {
            contentType: "reel",

            contentId: reel.id.toString()
        });

        const followers = await User.find({
        following: req.user._id
        }).select("_id");

        for (const follower of followers) {
    const keys = await redisClient.keys(
        `reel-feed:${follower._id}:*`
    );

    if (keys.length > 0) {
        await redisClient.del(keys);
    }
}


        return res.status(200).json({
            message: "Reel uploaded successfully and is pending moderation",
            reel
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Something went wrong"
        });
    }
}

async function getReels(req,res){

    try{
        const page =parseInt(req.query.page) || 1;
        const limit=parseInt(req.query.limit) || 10;

        const skip =(page - 1)*limit;

        const reels= await Reel.find()
        .populate("owner", "username fullName profilePicture")
        .sort({ createdAt: -1})
        .skip(skip)
        .limit(limit);

        return res.status(200).json({
            message: "Reels fetched successfully",
            reels,
            page,
            limit
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Something went wrong"
        });
    }
}

async function likeReel(req, res) {
    try {
        const { reelId } = req.params;
        const userId = req.user._id;

        const reel = await Reel.findById(reelId);

        if (!reel) {
            return res.status(404).json({
                message: "Reel not found"
            });
        }

        if (reel.likes.includes(userId)) {
            return res.status(400).json({
                message: "Reel already liked"
            });
        }

        await Reel.findByIdAndUpdate(
            reelId,
            {
                $addToSet: {
                    likes: userId
                }
            }
        );

        return res.status(200).json({
            message: "Reel liked successfully"
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Something went wrong"
        });
    }
}

async function unlikeReel(req, res) {
    try {
        const { reelId } = req.params;
        const userId = req.user._id;

        const reel = await Reel.findById(reelId);

        if (!reel) {
            return res.status(404).json({
                message: "Reel not found"
            });
        }

        await Reel.findByIdAndUpdate(
            reelId,
            {
                $pull: {
                    likes: userId
                }
            }
        );

        return res.status(200).json({
            message: "Reel unliked successfully"
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Something went wrong"
        });
    }
}


async function viewReel(req,res){
    try {
         const { reelId } = req.params;
        const userId = req.user._id;

        const key=`reel-view:${userId}:${reelId}`;

        const alreadyViewed=await redisClient.get(key);

        if (alreadyViewed){
            return res.status(200).json({
                message: "view already counted"
            })
        }
        await Reel.findByIdAndUpdate(
            reelId,
            {
                $inc: {
                    views: 1
                }
            }
        );
        await redisClient.set(key, "1",{
            EX: 86400
        });
        return res.status(200).json({
            message: "View counted successfully"
        });

    }catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Something went wrong"
        });
    }
}

async function getReelFeed(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const skip = (page - 1) * limit;

        const cacheKey = `reel-feed:${req.user._id}:${page}:${limit}`;

        const cachedFeed = await redisClient.get(cacheKey);

        if (cachedFeed) {
            console.log("reel feed cache hit");

            return res.status(200).json({
                message: "Reel feed fetched successfully",
                reels: JSON.parse(cachedFeed),
                page,
                limit
            });
        }

        console.log("reel feed cache miss");

        const currentUser = await User.findById(req.user._id)
            .select("following");

        const followingIds = currentUser.following;

        const reels = await Reel.find({
            owner: { $in: followingIds }
        })
            .populate("owner", "username fullName profilePicture")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

            await redisClient.set(
            cacheKey,
            JSON.stringify(reels),
            {
                EX: 60
            }
        );

        return res.status(200).json({
            message: "Reel feed fetched successfully",
            reels,
            page,
            limit
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Something went wrong"
        });
    }
}


module.exports = {
    createReel,getReels,likeReel,unlikeReel,viewReel,getReelFeed
};